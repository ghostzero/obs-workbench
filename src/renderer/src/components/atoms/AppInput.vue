<template>
  <div>
    <label :for="props.id" class="block text-sm font-medium leading-6 text-white">{{ props.label }}</label>
    <div class="mt-2">
      <input
          :id="props.id" :name="props.name" :type="props.type"
          :autocomplete="props.name" :required="props.required"
          class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          :value="props.modelValue"
          @input="$emit('update:modelValue', handleInput($event))"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const $emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: false,
    default: '',
  },
  type: {
    type: String,
    required: false,
    default: 'text',
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  return target.value
}

</script>