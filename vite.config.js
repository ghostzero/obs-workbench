import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {execSync} from "node:child_process";

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
process.env.VITE_GIT_COMMIT_HASH = gitHash

export default defineConfig({
  plugins: [vue()],
  base: './'
})
