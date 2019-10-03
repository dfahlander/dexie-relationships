import Dexie from 'dexie'
import SchemaParser from './schema-parser'
import {isIndexableType} from './utils'

const Relationships = (db) => {
  // Use Dexie.Promise to ensure transaction safety.
  const Promise = Dexie.Promise

  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Table.prototype.with = function (relationships) {
    return this.toCollection().with(relationships)
  }

  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Collection.prototype.with = function (relationships) {
    const baseTable = this._ctx.table.name
    const databaseTables = db._allTables

    // this holds tables that have foreign keys pointing at the current table
    let usableForeignTables = []

    // validate target tables and add them into our usable tables object
    Object.keys(relationships).forEach((column) => {
      let tableOrIndex = relationships[column]
      let matchingIndex = this._ctx.table.schema.idxByName[tableOrIndex]

      if (matchingIndex && matchingIndex.hasOwnProperty('foreignKey')) {
        let index = matchingIndex
        usableForeignTables.push({
          column: column,
          index: index.foreignKey.targetIndex,
          tableName: index.foreignKey.targetTable,
          targetIndex: index.foreignKey.index,
          oneToOne: true
        })
      } else {
        let table = tableOrIndex

        if (!databaseTables.hasOwnProperty(table)) {
          throw new Error('Relationship table ' + table + ' doesn\'t exist.')
        }

        if (!databaseTables[table].schema.hasOwnProperty('foreignKeys')) {
          throw new Error('Relationship table ' + table + ' doesn\'t have foreign keys set.')
        }

        // remove the foreign keys that don't link to the base table
        let columns = databaseTables[table].schema.foreignKeys.filter(column => column.targetTable === baseTable)

        if (columns.length > 0) {
          usableForeignTables.push({
            column: column,
            index: columns[0].index,
            tableName: table,
            targetIndex: columns[0].targetIndex
          })
        }
      }
    })

    return this.toArray().then(rows => {
      //
      // Extract the mix of all related keys in all rows
      //
      let queries = usableForeignTables
        .map(foreignTable => {
          // For each foreign table, query all items that any row refers to
          let tableName = foreignTable.tableName
          let allRelatedKeys = rows
            .map(row => row[foreignTable.targetIndex])
            .filter(isIndexableType)

          // Build the Collection to retrieve all related items
          return databaseTables[tableName]
            .where(foreignTable.index)
            .anyOf(allRelatedKeys)
        })

      // Execute queries in parallell
      let queryPromises = queries.map(query => query.toArray())

      //
      // Await all results and then try mapping each response
      // with its corresponding row and attach related items onto each row
      //
      return Promise.all(queryPromises).then(queryResults => {
        usableForeignTables.forEach((foreignTable, idx) => {
          let tableName = foreignTable.tableName
          let result = queryResults[idx]
          let targetIndex = foreignTable.targetIndex
          let foreignIndex = foreignTable.index
          let column = foreignTable.column

          // Create a lookup by targetIndex (normally 'id')
          // and set the column onto the target
          let lookup = {}
          result.forEach(record => {
            let foreignKey = record[foreignIndex]
            if (foreignTable.oneToOne) {
              lookup[foreignKey] = record
            } else {
              (lookup[foreignKey] = lookup[foreignKey] || [])
                .push(record)
            }
          })

          // Populate column on each row
          rows.forEach(row => {
            let foreignKey = row[targetIndex]
            let record = lookup[foreignKey] || []
            if (foreignKey !== null && foreignKey !== undefined && !record) {
              throw new Error(
                `Could not lookup foreign key where ` +
                `${tableName}.${foreignIndex} == ${baseTable}.${column}. ` +
                `The content of the failing key was: ${JSON.stringify(foreignKey)}.`)
            }

            // Set it as a non-enumerable property so that the object can be safely put back
            // to indexeddb without storing relations redundantly (IndexedDB will only store "own non-
            // enumerable properties")
            Object.defineProperty(row, column, {
              value: record,
              enumerable: false,
              configurable: true,
              writable: true
            })
          })
        })
      }).then(() => rows)
    })
  }

  db.Version.prototype._parseStoresSpec = Dexie.override(
    db.Version.prototype._parseStoresSpec,
    parseStoresSpec => function (storesSpec, outDbSchema) {
      const parser = new SchemaParser(storesSpec)

      let foreignKeys = parser.getForeignKeys()
      // call the original method
      let rv = parseStoresSpec.call(this, parser.getCleanedSchema(), outDbSchema)

      // set foreign keys into database table objects
      // to use later in 'with' method
      Object.keys(outDbSchema).forEach(table => {
        if (foreignKeys.hasOwnProperty(table)) {
          outDbSchema[table].foreignKeys = foreignKeys[table]
          foreignKeys[table].forEach(fk => {
            outDbSchema[table].idxByName[fk.index].foreignKey = fk
          })
        }
      })

      return rv
    })
}

// https://github.com/dfahlander/Dexie.js/issues/625:
Relationships.default = Relationships

export default Relationships
