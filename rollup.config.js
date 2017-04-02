import buble from 'rollup-plugin-buble'
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  moduleName: 'dexieRelationships',
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/index.js',
  sourceMap: true,
  external: ['dexie'],
  globals: {
    dexie: 'Dexie',
  },
  plugins: [ buble(), sourcemaps() ]
};
