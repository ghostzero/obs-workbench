<template>
  <i v-if="props.item.sourceType === 'OBS_SOURCE_TYPE_SCENE'" class="fas fa-fw fa-list"></i>
  <i v-else-if="props.item.inputKind === ''" class="fas fa-fw fa-question"></i>
  <i v-else-if="props.item.inputKind === 'ffmpeg_source'" class="fas fa-fw fa-play"></i>
  <i v-else-if="props.item.inputKind === 'wasapi_input_capture'" class="fas fa-fw fa-microphone"></i>
  <i v-else-if="props.item.inputKind === 'wasapi_output_capture'" class="fas fa-fw fa-volume"></i>
  <i v-else-if="props.item.inputKind === 'game_capture'" class="fas fa-fw fa-gamepad-modern"></i>
  <i v-else-if="props.item.inputKind === 'dshow_input'" class="fas fa-fw fa-camera"></i>
  <i v-else-if="props.item.inputKind === 'color_source_v3'" class="fas fa-fw fa-paintbrush"></i>
  <i v-else-if="props.item.inputKind === 'browser_source'" class="fas fa-fw fa-globe-asia"></i>
  <i v-else-if="props.item.inputKind === 'image_source'" class="fas fa-fw fa-image"></i>
  <i v-else-if="props.item.inputKind === 'text_ft2_source_v2'" class="fas fa-fw fa-text"></i>
  <i v-else class="fas fa-fw fa-question" :title="props.item.sourceType"></i>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { SceneItem } from '../../store/app'

const props = defineProps({
  item: {
    type: Object as PropType<SceneItem>,
    required: true,
  }
})
</script>
