import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from '@babel/core';
import { visualizer } from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
// import builtins from 'rollup-plugin-node-builtins';
// import * as path from 'path';
import pkg from './package.json';

const path = require('path').posix;

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const processEnv = isProd || isTesting ? 'production' : 'development';

export const baseConfig = ({ outputDir = 'dist/esm', injectCSS = true } = {}) => ({
  input: 'src/lib/index.ts',
  external: [
    'react',
    'react-dom',
    'jotai',
    'immer',
    'lodash.debounce',
    // 'resize-observer-polyfill',
    'eventemitter3',
    (id) => id.includes('@babel/runtime'),
  ],
  onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      rollupWarn(warning);
    }
  },
  output: {
    dir: outputDir,
    // file: path.resolve(__dirname, outputDir, 'index.js'),
    format: 'esm',
    // sourcemap: true,
  },

  plugins: [
    terser(),
    replace({
      __ENV__: JSON.stringify(processEnv),
      __TAIL_VERSION__: JSON.stringify(pkg.version),
      // __INJECT_STYLES__: injectCSS,
      preventAssignment: true,
    }),
    postcss({
      minimize: isProd,
      // inject: true,
      use: ['sass'],
      // modules: true,
      extract: 'index.css'
    }),
    svgr(),
    resolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          jsx: 'react'
        }
      },
      clean: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      extensions: [...DEFAULT_BABEL_EXTENSIONS, '.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      // '@babel/plugin-transform-runtime',
      plugins: [[
        "@babel/plugin-transform-react-jsx",
        {
          "throwIfNamespace": false, // defaults to true
          "runtime": "classic", // defaults to classic
          // "importSource": "custom-jsx-library" // defaults to react
        }
      ]],

    }),
    visualizer(),
    alias({
      entries: {
        // '@lib': path.resolve(__dirname, '../src/lib')
        '@lib': path.resolve(__dirname, './src/lib')
      }
    }),
    // builtins()
  ],
});

// export default isProd && !isTesting
//   ? [
//     baseConfig(),
//     baseConfig({
//       outputDir: 'dist/nocss',
//       injectCSS: false,
//     }),
//   ]
//   : baseConfig();

export default baseConfig();