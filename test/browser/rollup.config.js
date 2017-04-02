import buble from 'rollup-plugin-buble'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  entry: './all-browser-tests.js',
  format: 'umd',
  dest: 'bundle.js',
  sourceMap: true,
  external: ['dexie'],
  globals: {dexie: 'Dexie'},
  plugins: [buble(), globals(), builtins(), uglify({}, minify), sourcemaps()]
};
