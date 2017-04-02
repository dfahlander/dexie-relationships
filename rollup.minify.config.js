import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  moduleName: 'dexieRelationships',
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/index.min.js',
  sourceMap: true,
  external: ['dexie'],
  globals: {
    dexie: 'Dexie',
  },
  plugins: [ buble(), uglify({}, minify), sourcemaps() ]
};
