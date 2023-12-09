<template>
  <div class="relative inline-block text-left">
    <a
      ref="ignoreElRef"
      href="#"
      class="flex group items-center gap-3 p-1.5 rounded -m-1.5 hover:bg-white/10"
      @click.prevent="open = !open"
    >
      <div
        v-if="props.icon"
      >
        <i :class="['fal fa-fw', `fa-${props.icon.name}`]" />
      </div>
      <div
        v-if="props.letter"
        :class="['w-6 h-6 rounded flex justify-center items-center', props.letter.color]"
      >
        {{ props.letter.text }}
      </div>
      <div>
        <slot />
      </div>
      <i class="fal fa-fw fa-chevron-down text-xs" />
    </a>

    <div
      v-if="open"
      class="absolute left-0 z-50 mt-2 w-[280px] origin-top-right rounded-md bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <OnClickOutside
        :options="{ ignore: [ignoreElRef] }"
        @trigger="open = false"
      >
        <div
          class="py-1"
          role="none"
        >
          <template
            v-for="item in props.menuItems"
            :key="item.id"
          >
            <a
              id="menu-item-0"
              href="#"
              :class="['text-zinc-100 flex gap-3 items-center px-4 py-2 text-sm hover:bg-zinc-600', {
                'bg-zinc-600': props.selected === item.id
              }]"
              role="menuitem"
              tabindex="-1"
              @click.prevent="() => select(item.id)"
            >
              <div v-if="item.letter">
                <div
                  :class="['w-6 h-6 rounded flex justify-center items-center', item.letter.color]"
                >
                  {{ item.letter.text }}
                </div>
              </div>
              <div class="flex items-center">
                <i
                  v-if="props.icon"
                  :class="['fal fa-fw mr-1', `fa-${item.icon.name}`]"
                />
                <div>
                  <div>{{ item.label }}</div>
                  <div class="text-white/50 text-xs">{{ item.subtitle }}</div>
                </div>
              </div>
            </a>
          </template>
        </div>
      </OnClickOutside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import { OnClickOutside } from '@vueuse/components'

const emit = defineEmits(['select'])

const ignoreElRef = ref()

const props = defineProps({
  letter: {
    type: Object as PropType<{ text: string, color: string }> | undefined,
    default: undefined,
    required: false
  },
  icon: {
    type: Object as PropType<{ name: string }>,
    default: undefined,
    required: false
  },
  menuItems: {
    type: Array as PropType<{
      id: string,
      label: string,
      icon?: { name: string },
      subtitle?: string
      letter?: { text: string, color: string }
    }[]>,
    default: () => []
  },
  selected: {
    type: String,
    default: undefined,
    required: false
  }
})

const open = ref(false)

const select = (id: string) => {
  emit('select', id)
  open.value = false
}
</script>
