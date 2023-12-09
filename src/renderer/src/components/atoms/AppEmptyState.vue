<template>
  <div class="flex h-full flex-col items-center justify-center gap-2 text-center">
    <i :class="[`fal fa-fw fa-${props.icon.name} text-5xl text-zinc-500`]" />
    <h3 class="mt-2 text-sm font-semibold text-zinc-200">
      {{ props.title }}
    </h3>
    <div class="mt-1 text-sm text-zinc-500">
      <div v-html="markdown.render(props.description)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt();

const props = defineProps({
  icon: {
    type: Object as PropType<{ name: string }>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>
