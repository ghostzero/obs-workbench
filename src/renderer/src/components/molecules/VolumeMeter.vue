<template>
  <div class="w-20 flex flex-col rounded p-1">
    <div class="text-center">
      <div class="text-xs truncate">
        {{ props.volumeMeter.inputName }}
      </div>
      <div class="text-xs truncate">
        {{ props.volumeMeter.inputLevelsMul.length }}
      </div>
      <div class="text-xs truncate">
        {{ input.inputVolumeDb <= -100 ? '-inf' : input.inputVolumeDb.toFixed(1) }} dB
      </div>
    </div>
    <div class="flex-1 py-2">
      <div class="h-full flex justify-center gap-0.5">
        <template
          v-for="(inputLevels, inputLevelIndex) in props.volumeMeter.inputLevelsMul"
          :key="inputLevelIndex"
        >
          <InputLevel
            :index="inputLevelIndex"
            :input-levels="inputLevels"
          />
        </template>
        <div
          v-if="props.volumeMeter.inputLevelsMul.length > 0"
          class="audio-meter-scale flex flex-col justify-between pr-2"
        >
          <template
            v-for="i in 13"
            :key="i"
          >
            <div class="audio-meter-scale-item">
              <span class="label">{{ i > 1 ? '-' : '' }}{{ (i * 5) - 5 }}</span>
            </div>
          </template>
        </div>
        <div class="w-8 flex justify-center">
          <input
            v-model="inputLevel"
            class="volume-vertical accent-primary-500"
            type="range"
            orient="vertical"
            min="0"
            max="100"
            step="0.1"
            @input="updateInputLevel($event)"
          >
        </div>
      </div>
    </div>
    <div class="text-center">
      <i
        :class="['fas fa-fw', {
          'fa-volume-up': !input.inputMuted,
          'fa-volume-mute text-primary-500': input.inputMuted,
        }]"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import InputLevel from '../atoms/InputLevel.vue'
import { InputVolumeMeter, useAppStore } from '../../store/app'
import { computed, ref, watch } from 'vue'
import { LogSlider } from '../../utils/LogSlider'

const store = useAppStore()

const props = defineProps<{
  volumeMeter: InputVolumeMeter,
}>()

const input = computed(() => {
  return store.inputVolumes[props.volumeMeter.inputName] || {
    inputVolumeDb: 0,
    inputVolumeMul: 0,
    inputMuted: false,
  }
})

const logsl = new LogSlider({maxpos: 100, minval: 0, maxval: 100})

const inputLevel = ref(logsl.value(input.value.inputVolumeDb + 100))

watch(input, () => {
  inputLevel.value = logsl.value(input.value.inputVolumeDb + 100)
})

const updateInputLevel = (event: Event) => {
  const db = Math.max(-100, -100 + logsl.position(Math.abs(
    Number((event.target as HTMLInputElement).value)
  )))
  store.setInputVolume(props.volumeMeter.inputName, db)
}
</script>

<style scoped>
.audio-meter-scale-item {
  height: 1px;
  width: 3px;
  background-color: #fff;
  position: relative;
}

.label {
  font-size: 8px;
  color: #fff;
  position: absolute;
  top: -6px;
  left: 4px;
}

.volume-vertical {
  writing-mode: vertical-lr; direction: rtl;
  width: 3px;
}
</style>
