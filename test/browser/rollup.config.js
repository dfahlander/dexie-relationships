import buble from 'rollup-plugin-buble'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'

export default {
  entry: './all-browser-tests.js',
  format: 'umd',
  dest: 'bundle.js',
  external: ['dexie'],
  globals: {dexie: 'Dexie'},
  plugins: [buble(), globals(), builtins(), uglify({}, minify)]
};
