import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/mgsdatatable.min.js',
    format: 'umd',
    name: 'mgsDataTable',
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
};