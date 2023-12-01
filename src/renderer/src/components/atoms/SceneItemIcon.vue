<template>
  <i v-if="props.kind === null" class="fas fa-fw fa-folder"></i>
  <i v-else-if="props.kind === ''" class="fas fa-fw fa-question"></i>
  <i v-else-if="props.kind === 'ffmpeg_source'" class="fas fa-fw fa-play"></i>
  <i v-else-if="props.kind === 'wasapi_input_capture'" class="fas fa-fw fa-microphone"></i>
  <i v-else-if="props.kind === 'game_capture'" class="fas fa-fw fa-gamepad-modern"></i>
  <i v-else-if="props.kind === 'dshow_input'" class="fas fa-fw fa-camera"></i>
  <i v-else-if="props.kind === 'color_source_v3'" class="fas fa-fw fa-paintbrush"></i>
  <i v-else-if="props.kind === 'browser_source'" class="fas fa-fw fa-globe-asia"></i>
  <i v-else-if="props.kind === 'image_source'" class="fas fa-fw fa-image"></i>
  <i v-else class="fas fa-fw fa-question" :title="props.kind"></i>
</template>

<script setup lang="ts">
const props = defineProps<{
  kind: string
}>()
</script>