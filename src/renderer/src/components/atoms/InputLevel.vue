<template>
  <div class="audio-meter">
    <div class="audio-level red" style="height: 100%;"></div>
    <div class="audio-level yellow" style="height: 85%;"></div>
    <div class="audio-level green" style="height: 67%;"></div>

    <div class="audio-level active red" :style="{
      height: `${Math.min(levelB, 100)}%`
    }"></div>
    <div class="audio-level active yellow" :style="{
      height: `${Math.min(levelB, 85)}%`
    }"></div>
    <div class="audio-level active green" :style="{
      height: `${Math.min(levelB, 67)}%`
    }"></div>

    <div class="audio-level avg" :style="{
      bottom: `${levelA}%`
    }"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  inputLevels: number[]
}>()

const levelA = ref(0)
const levelB = ref(0)
const targetLevelA = ref(0)
const targetLevelB = ref(0)
const lerpSpeed = 0.1

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t
}

onMounted(() => {
  const interval = setInterval(() => {
    levelA.value = lerp(levelA.value, targetLevelA.value, lerpSpeed)
    levelB.value = lerp(levelB.value, targetLevelB.value, lerpSpeed)
  }, 1000 / 60)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

const db = (mul: number) => {
  return Math.abs(20.0 * Math.log10(mul))
}

watch(() => props.inputLevels, () => {
  targetLevelB.value = (60 - db(props.inputLevels[1])) / 60 * 100
  targetLevelA.value = (60 - db(props.inputLevels[0])) / 60 * 100
})
</script>

<style scoped>
.audio-meter {
  height: 100%;
  width: 3px;
  background-color: #000;
  overflow: hidden;
  position: relative;
}

.audio-level {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
}

.red {
  background-color: #702735;
}

.yellow {
  background-color: #705b1c;
}

.green {
  background-color: #427018;
}

.red.active {
  background-color: #bd2f49;
}

.yellow.active {
  background-color: #bd9009;
}

.green.active {
  background-color: #73bd31;
}

.avg {
  background-color: #000;
  height: 3px;
}
</style>