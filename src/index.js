import Dexie from 'dexie'
import SchemaParser from './schema-parser'
import {isIndexableType} from './utils'

const Relationships = (db) => {
  // Use Dexie.Promise to ensure transaction safety.
  let Promise = Dexie.Promise

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
    let usableForeignTables = {}

    // validate target tables and add them into our usable tables object
    Object.keys(relationships).forEach((column) => {
      let table = relationships[column]

      if (!databaseTables.hasOwnProperty(table)) {
        throw new Error('Relationship table ' + table + ' doesn\'t exist.')
      }

      if (!databaseTables[table].schema.hasOwnProperty('foreignKeys')) {
        throw new Error('Relationship table ' + table + ' doesn\'t have foreign keys set.')
      }

      // remove the foreign keys that don't link to the base table
      let columns = databaseTables[table].schema.foreignKeys.filter(column => column.targetTable === baseTable)

      if (columns.length > 0) {
        usableForeignTables[table] = {
          column: column,
          foreign: columns[0]
        }
      }
    })

    let foreignTableNames = Object.keys(usableForeignTables)

    return this.toArray().then(rows => {
      //
      // Extract the mix of all related keys in all rows
      //
      let queries = foreignTableNames
        .map (tableName => {
          // For each foreign table, query all items that any row refers to
          let foreignTable = usableForeignTables[tableName]
          let allRelatedKeys = rows
            .map(row => row[foreignTable.foreign.targetIndex])
            .filter (isIndexableType)

          // Build the Collection to retrieve all related items 
          return databaseTables[table]
            .where (foreignTable.foreign.index)
            .anyOf (allRelatedKeys)
        })
      
      // Execute queries in parallell
      let queryPromises = queries.map(query => query.toArray());

      //
      // Await all results and then try mapping each response
      // with its corresponding row and attach related items onto each row
      // 
      return Promise.all(queryPromises).then (queryResults => {
        foreignTableNames.forEach((tableName, idx) => {
          let foreignTable = usableForeignTables[tableName]
          let result = queryResults[idx]
          let targetIndex = foreignTable.foreign.targetIndex
          let foreignIndex = foreignTable.foreign.index

        });
      });
      return Promise.all (queries.map(query => query.toArray())).then(results => {
        let {table, allRelatedObjs} = results;

      })
    })

    return new Promise((resolve) => {
      self.toArray().then(rows => {
        let queue = []

        // loop through all rows and collect all data from the related table
        rows.forEach((row) => {
          let tables = Object.keys(usableForeignTables)

          tables.forEach(table => {
            let relatedTable = usableForeignTables[table]

            let promise = databaseTables[table]
              .where(relatedTable.foreign.index)
              .equals(row[relatedTable.foreign.targetIndex])
              .toArray()
              .then(relations => {
                row[relatedTable.column] = relations
              })

            queue.push(promise)
          })
        })

        // we need to wait until all data is retrieved
        // once it's there we can resolve the promise
        Promise.all(queue).then(() => {
          resolve(rows)
        })
      })
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
        }
      })

      return rv
    })
}

Dexie.addons.push(Relationships)
