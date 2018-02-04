class SchemaParser {

  /**
   * Schema parser
   *
   * @param {Object} schema
   */
  constructor (schema) {
    this.schema = schema
  }

  /**
   * Extracts foreign keys from the schema
   *
   * @return {Object}
   */
  getForeignKeys () {
    const foreignKeys = {}

    Object.keys(this.schema).forEach(table => {
      foreignKeys[table] = this.schema[table]
        .split(/\s*,\s*/)
        .filter(idx => !idx.includes('->'))
        .map(idx => {
          // split the column and foreign table info
          const [column, target] = idx.split(/\s*->\s*/)

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
    const schema = {}

    Object.keys(this.schema).forEach(table => {
      // Remove foreign keys syntax before calling the original method
      schema[table] = this.schema[table]
        .split(/\s*,\s*/)
        .map(idx => idx.split(/\s*->\s*/)[0])
        .join(', ')
    })

    return schema
  }
}

export default SchemaParser
