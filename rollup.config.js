import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import typescript from 'rollup-plugin-typescript2';
import terser from "@rollup/plugin-terser";
import externals from "rollup-plugin-node-externals";

export default defineConfig([
  {
    input: {
      index: 'src/index.ts', // 入口文件
    },
    output: [
      {
        dir: 'dist',   // 输出目录
        format: 'cjs', // 输出格式为 commonjs 文件
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      typescript(),
      terser(),
      externals({
        devDeps: false, // 可以识别 package.json 中的 devDependencies 当做外部依赖
      })
    ]
  }
]);