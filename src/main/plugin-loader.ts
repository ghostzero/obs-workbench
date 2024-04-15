import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export class PluginLoader {
  private readonly pluginDirectory: string

  constructor(pluginDirectory: string) {
    this.pluginDirectory = pluginDirectory
  }

  async loadPlugins(): Promise<void> {
    if (!fs.existsSync(this.pluginDirectory)) {
      fs.mkdirSync(this.pluginDirectory, { recursive: true })
    }

    const files = fs.readdirSync(this.pluginDirectory)

    for (const file of files) {
      const pluginPath = path.join(this.pluginDirectory, file)
      const packagePath = path.join(pluginPath, 'package.json')

      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

        if (packageJson.main) {
          const mainScriptPath = path.join(pluginPath, packageJson.main)
          const mainScriptUrl = pathToFileURL(mainScriptPath).href

          try {
            // plugin exports default class that has a method to register itself
            const plugin = await import(mainScriptUrl)
            await plugin.default.init()
          } catch (error) {
            console.error(`Error loading plugin ${file}:`, error)
          }
        }
      }
    }
  }
}
