(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.dexieRelationships = factory());
}(this, (function () { 'use strict';

var SchemaParser = function SchemaParser (schema) {
  this.schema = schema;
};

/**
 * Extracts foreign keys from the schema
 *
 * @returns Object
 */
SchemaParser.prototype.getForeignKeys = function getForeignKeys () {
    var this$1 = this;

  var foreignKeys = {};

  Object.keys(this.schema).forEach(function (table) {
    var indexes = this$1.schema[table].split(',');

    foreignKeys[table] = indexes
      .filter(function (idx) { return idx.indexOf('->') !== -1; })
      .map(function (idx) {
        // split the column and foreign table info
        var ref = idx.split('->').map(function (x) { return x.trim(); });
          var column = ref[0];
          var target = ref[1];

        return {
          index: column,
          targetTable: target.split('.')[0],
          targetIndex: target.split('.')[1]
        }
      });
  });

  return foreignKeys
};

/**
 * Get schema without the foreign key definitions
 *
 * @returns Object
 */
SchemaParser.prototype.getCleanedSchema = function getCleanedSchema () {
    var this$1 = this;

  var schema = {};

  Object.keys(this.schema).forEach(function (table) {
    var indexes = this$1.schema[table].split(',');

    // Remove foreign keys syntax before calling the original method
    schema[table] = indexes.map(function (idx) { return idx.split('->')[0].trim(); }).join(',');
  });

  return schema
};

function isIndexableType (value) {
  return value != null && (// Using "!=" instead of "!==" to check for both null and undefined!
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Date ||
      (Array.isArray(value) && value.every(isIndexableType))
    )
}

var Relationships = function (db) {
  var Dexie = db.constructor;
  // Use Dexie.Promise to ensure transaction safety.
  var Promise = Dexie.Promise;

  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Table.prototype.with = function (relationships) {
    return this.toCollection().with(relationships)
  };

  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Collection.prototype.with = function (relationships) {
    var this$1 = this;

    var baseTable = this._ctx.table.name;
    var databaseTables = db._allTables;

    // this holds tables that have foreign keys pointing at the current table
    var usableForeignTables = {};

    // validate target tables and add them into our usable tables object
    Object.keys(relationships).forEach(function (column) {
      var tableOrIndex = relationships[column];
      var matchingIndex = this$1._ctx.table.schema.idxByName[tableOrIndex];

      if (matchingIndex && matchingIndex.hasOwnProperty('foreignKey')) {
        var index = matchingIndex;
        usableForeignTables[index.foreignKey.targetTable] = {
          column: column,
          index: index.foreignKey.targetIndex,
          targetIndex: index.foreignKey.index,
          oneToOne: true
        };
      } else {
        var table = tableOrIndex;

        if (!databaseTables.hasOwnProperty(table)) {
          throw new Error('Relationship table ' + table + ' doesn\'t exist.')
        }

        if (!databaseTables[table].schema.hasOwnProperty('foreignKeys')) {
          throw new Error('Relationship table ' + table + ' doesn\'t have foreign keys set.')
        }

        // remove the foreign keys that don't link to the base table
        var columns = databaseTables[table].schema.foreignKeys.filter(function (column) { return column.targetTable === baseTable; });

        if (columns.length > 0) {
          usableForeignTables[table] = {
            column: column,
            index: columns[0].index,
            targetIndex: columns[0].targetIndex
          };
        }
      }
    });

    var foreignTableNames = Object.keys(usableForeignTables);

    return this.toArray().then(function (rows) {
      //
      // Extract the mix of all related keys in all rows
      //
      var queries = foreignTableNames
        .map(function (tableName) {
          // For each foreign table, query all items that any row refers to
          var foreignTable = usableForeignTables[tableName];
          var allRelatedKeys = rows
            .map(function (row) { return row[foreignTable.targetIndex]; })
            .filter(isIndexableType);

          // Build the Collection to retrieve all related items
          return databaseTables[tableName]
              .where(foreignTable.index)
              .anyOf(allRelatedKeys)
        });

      // Execute queries in parallell
      var queryPromises = queries.map(function (query) { return query.toArray(); });

      //
      // Await all results and then try mapping each response
      // with its corresponding row and attach related items onto each row
      //
      return Promise.all(queryPromises).then(function (queryResults) {
        foreignTableNames.forEach(function (tableName, idx) {
          var foreignTable = usableForeignTables[tableName];
          var result = queryResults[idx];
          var targetIndex = foreignTable.targetIndex;
          var foreignIndex = foreignTable.index;
          var column = foreignTable.column;

          // Create a lookup by targetIndex (normally 'id')
          // and set the column onto the target
          var lookup = {};
          rows.forEach(function (row) {
            lookup[row[targetIndex]] = row;
          });

          // Populate column on each row
          result.forEach(function (record) {
            var foreignKey = record[foreignIndex];
            var row = lookup[foreignKey];
            if (!row) {
              throw new Error(
                "Could not lookup foreign key where " +
                tableName + "." + foreignIndex + " == " + baseTable + "." + column + ". " +
                "The content of the failing key was: " + (JSON.stringify(foreignKey)) + ".")
            }

            if (foreignTable.oneToOne || !row.hasOwnProperty(column)) {
              // Set it as a non-enumerable property so that the object can be safely put back
              // to indexeddb without storing relations redundantly (IndexedDB will only store "own non-
              // enumerable properties")
              Object.defineProperty(row, column, {
                value: foreignTable.oneToOne ? record : [record],
                enumerable: false,
                configurable: true,
                writable: true
              });
            } else if (!foreignTable.oneToOne) {
              row[column].push(record);
            }
          });
        });
      }).then(function () { return rows; })
    })
  };

  db.Version.prototype._parseStoresSpec = Dexie.override(
    db.Version.prototype._parseStoresSpec,
    function (parseStoresSpec) { return function (storesSpec, outDbSchema) {
      var parser = new SchemaParser(storesSpec);

      var foreignKeys = parser.getForeignKeys();
      // call the original method
      var rv = parseStoresSpec.call(this, parser.getCleanedSchema(), outDbSchema);

      // set foreign keys into database table objects
      // to use later in 'with' method
      Object.keys(outDbSchema).forEach(function (table) {
        if (foreignKeys.hasOwnProperty(table)) {
          outDbSchema[table].foreignKeys = foreignKeys[table];
          foreignKeys[table].forEach(function (fk) {
            outDbSchema[table].idxByName[fk.index].foreignKey = fk;
          });
        }
      });

      return rv
    }; });
};

return Relationships;

})));
