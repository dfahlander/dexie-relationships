import assert from 'assert'
import SchemaParser from '../src/schema-parser'

describe('SchemaParser', function () {
  let schema = {
    parent: 'id, name',
    child: 'id, name, parent_id -> parent.id'
  }
  let parser = new SchemaParser(schema)

  describe('getCleanedSchema', function () {
    it('should return table list without foreign keys', function () {
      let expected = {
        'parent': 'id,name',
        'child': 'id,name,parent_id'
      }

      assert.deepEqual(expected, parser.getCleanedSchema())
    })
  })

  describe('getForeignKeys', function () {
    it('should return table foreign keys', function () {
      let expected = {
        parent: [],
        child: [{
          index: 'parent_id',
          targetTable: 'parent',
          targetIndex: 'id'
        }]
      }

      assert.deepEqual(expected, parser.getForeignKeys())
    })
  })
})
