import buble from 'rollup-plugin-buble'

export default {
  moduleName: 'dexieRelationships',
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/index.js',
  globals: {
    Dexie: 'Dexie',
  },
  plugins: [ buble() ]
};
