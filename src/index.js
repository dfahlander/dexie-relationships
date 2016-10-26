import Dexie from 'dexie'
import SchemaParser from './schema-parser'

const Relationships = (db) => {

  let Promise = Dexie.Promise; // Safe to use within transactions. 

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
    const self = this
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

    return new Dexie.Promise((resolve) => {
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
