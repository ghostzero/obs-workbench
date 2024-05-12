import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import {execSync} from "node:child_process";

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
process.env.VITE_GIT_COMMIT_HASH = gitHash

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    envPrefix: 'VITE_'
  }
})
