class SchemaParser {

  /**
   * Schema parser
   *
   * @param schema
   */
  constructor (schema) {
    this.schema = schema
  }

  /**
   * Extracts foreign keys from the schema
   *
   * @returns Object
   */
  getForeignKeys () {
    let foreignKeys = {}

    Object.keys(this.schema).forEach(table => {
      let indexes = this.schema[table].split(',')

      foreignKeys[table] = indexes
        .filter(idx => idx.indexOf('->') !== -1)
        .map(idx => {
          // split the column and foreign table info
          let [column, target] = idx.split('->').map(x => x.trim())

          return {
            index: column,
            targetTable: target.split('.')[0],
            targetIndex: target.split('.')[1]
          }
        })
    })

    return foreignKeys
  }

  /**
   * Get schema without the foreign key definitions
   *
   * @returns Object
   */
  getCleanedSchema () {
    let schema = {}

    Object.keys(this.schema).forEach(table => {
      let indexes = this.schema[table].split(',')

      // Remove foreign keys syntax before calling the original method
      schema[table] = indexes.map(idx => idx.split('->')[0].trim()).join(',')
    })

    return schema
  }
}

export default SchemaParser
