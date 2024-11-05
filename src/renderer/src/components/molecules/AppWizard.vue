<template>
  <div class="grid gap-4">
    <slot
      :current-step="currentStep"
      name="steps"
    />
    <!-- wizard steps in bulls -->
    <div>
      <div class="border-b border-zinc-700" />
    </div>
    <div class="flex gap-2 justify-center text-xs">
      <template
        v-for="(step, index) in props.steps"
      >
        <div
          :class="{
            'text-zinc-600': (index+1) !== currentStep,
            'text-zinc-300': (index+1) === currentStep,
          }"
        >
          <i class="fas fa-circle" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array as PropType<{
      title: string,
    }[]>,
    default: 1
  }
})

const currentStep = ref(1)

const nextStep = () => {
  if (currentStep.value < props.steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const finishWizard = () => {
  alert('Wizard completed!')
}
</script>
