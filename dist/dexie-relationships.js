'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _dexie = require('dexie');

var _dexie2 = _interopRequireDefault(_dexie);

var _schemaParser = require('./schema-parser');

var _schemaParser2 = _interopRequireDefault(_schemaParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Relationships = function Relationships(db) {
  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Table.prototype.with = function (relationships) {
    return this.toCollection().with(relationships);
  };

  /**
   * Iterate through all items and collect related records
   *
   * @param relationships
   *
   * @returns {Dexie.Promise}
   */
  db.Collection.prototype.with = function (relationships) {
    var self = this;
    var baseTable = this._ctx.table.name;
    var databaseTables = db._allTables;

    // this holds tables that have foreign keys pointing at the current table
    var usableForeignTables = {};

    // validate target tables and add them into our usable tables object
    (0, _keys2.default)(relationships).forEach(function (column) {
      var table = relationships[column];

      if (!databaseTables.hasOwnProperty(table)) {
        throw new Error('Relationship table ' + table + ' doesn\'t exist.');
      }

      if (!databaseTables[table].schema.hasOwnProperty('foreignKeys')) {
        throw new Error('Relationship table ' + table + ' doesn\'t have foreign keys set.');
      }

      // remove the foreign keys that don't link to the base table
      var columns = databaseTables[table].schema.foreignKeys.filter(function (column) {
        return column.targetTable === baseTable;
      });

      if (columns.length > 0) {
        usableForeignTables[table] = {
          column: column,
          foreign: columns[0]
        };
      }
    });

    return new _dexie2.default.Promise(function (resolve) {
      self.toArray().then(function (rows) {
        var queue = [];

        // loop through all rows and collect all data from the related table
        rows.forEach(function (row) {
          var tables = (0, _keys2.default)(usableForeignTables);

          tables.forEach(function (table) {
            var relatedTable = usableForeignTables[table];

            var promise = databaseTables[table].where(relatedTable.foreign.index).equals(row[relatedTable.foreign.targetIndex]).toArray().then(function (relations) {
              row[relatedTable.column] = relations;
            });

            queue.push(promise);
          });
        });

        // we need to wait until all data is retrieved
        // once it's there we can resolve the promise
        _promise2.default.all(queue).then(function () {
          resolve(rows);
        });
      });
    });
  };

  db.Version.prototype._parseStoresSpec = _dexie2.default.override(db.Version.prototype._parseStoresSpec, function (parseStoresSpec) {
    return function (storesSpec, outDbSchema) {
      var parser = new _schemaParser2.default(storesSpec);

      var foreignKeys = parser.getForeignKeys();
      // call the original method
      var rv = parseStoresSpec.call(this, parser.getCleanedSchema(), outDbSchema);

      // set foreign keys into database table objects
      // to use later in 'with' method
      (0, _keys2.default)(outDbSchema).forEach(function (table) {
        if (foreignKeys.hasOwnProperty(table)) {
          outDbSchema[table].foreignKeys = foreignKeys[table];
        }
      });

      return rv;
    };
  });
};

_dexie2.default.addons.push(Relationships);
