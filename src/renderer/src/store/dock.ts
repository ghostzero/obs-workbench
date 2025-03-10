import { defineStore } from 'pinia'
import { useWaitForRef } from '../composables/useWaitForComponent'
import AppGoldenLayout from '../components/atoms/AppGoldenLayout.vue'
import SceneItemList from '../components/docks/SceneItemList.vue'
import SceneList from '../components/docks/SceneList.vue'
import StudioView from '../components/docks/StudioView.vue'
import AudioMixer from '../components/docks/AudioMixer.vue'
import IrlControl from '../components/docks/IrlControl.vue'
import { defaultLayoutConfig } from '../predefined-layouts'
import type { ComponentItemConfig, ItemConfig, LayoutConfig, ResolvedLayoutConfig } from 'golden-layout'
import { Component, markRaw, Ref, ref } from 'vue'
import { Raw } from '@vue/reactivity'

export const useDocksStore = defineStore('dock', () => {
  const layout: Ref<AppGoldenLayout> = ref<typeof AppGoldenLayout>()
  const layoutConfig: Ref<ResolvedLayoutConfig> = ref<ResolvedLayoutConfig>()
  const loadedComponentTypes: Ref<string> = ref<string>()
  const componentTypes: {
    [key: string]: Raw<Component>
  } = {
    Sources: markRaw(SceneItemList),
    Scenes: markRaw(SceneList),
    StudioView: markRaw(StudioView),
    AudioMixer: markRaw(AudioMixer),
    IrlControl: markRaw(IrlControl)
  }

  const loadLayout = async (config: ResolvedLayoutConfig) => {
    layoutConfig.value = config
    await layout.value.loadGLLayout(defaultLayoutConfig)
  }

  const onLoadLayout = async (goldenLayout) => {
    layout.value = await useWaitForRef<typeof AppGoldenLayout>(goldenLayout)

    const str = localStorage.getItem('gl_config')
    if (!str) {
      await loadLayout(defaultLayoutConfig)
      return
    }

    const config = JSON.parse(str as string) as LayoutConfig
    config.header = {
      ...config.header,
      maximise: false,
      popout: false
    }
    console.log(config)
    await loadLayout(config)
  }

  const addComponent = async (componentType: string, title: string) => {
    await layout.value.addGLComponent(componentType, title)
    console.log(await layout.value.getLayoutConfig())
  }

  /**
   * Recursively checks if a componentType exists in the given layout config.
   *
   * @param config The LayoutConfig to search through.
   * @param targetType The component type to look for.
   * @returns True if found, false otherwise.
   */
  function hasComponentType(config: LayoutConfig, targetType: string): boolean {
    const rootContent = config.root?.content
    if (!rootContent || !Array.isArray(rootContent)) {
      return false
    }

    const searchContent = (items: ItemConfig[]): boolean => {
      for (const item of items) {
        if (item.type === 'component') {
          const componentItem = item as ComponentItemConfig
          if (componentItem.componentType === targetType) {
            return true
          }
        }

        if (item.content && item.content.length > 0) {
          if (searchContent(item.content)) {
            return true
          }
        }
      }

      return false
    }

    return searchContent(rootContent)
  }

  setInterval(async () => {
    if (!layout.value) return
    const config = await layout.value.getLayoutConfig()
    loadedComponentTypes.value = Object.keys(componentTypes)
      .filter(x => hasComponentType(config, x))
  }, 1000)

  return {
    onLoadLayout,
    addComponent,
    componentTypes,
    loadedComponentTypes
  }
})
