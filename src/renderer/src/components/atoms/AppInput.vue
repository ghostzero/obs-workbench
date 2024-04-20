<template>
  <div>
    <div
      v-if="props.type !== 'checkbox'"
      class="block text-sm font-medium leading-6 text-white"
    >
      {{ props.label }}
    </div>
    <div class="mt-2 flex items-center gap-2">
      <template v-if="props.type === 'checkbox'">
        <input
          :id="props.id"
          :name="props.name"
          :type="props.type"
          :autocomplete="props.name"
          :required="props.required"
          class="block rounded border-0 text-primary-600 bg-zinc-700 py-1.5 focus:ring-0 focus:ring-offset-0 shadow-sm sm:text-sm sm:leading-6"
          :checked="props.modelValue as boolean"
          @input="$emit('update:modelValue', handleChecked($event))"
        > <label :for="props.id">{{ props.label }}</label>
      </template>
      <template v-else-if="props.type === 'textarea'">
        <textarea
          :id="props.id"
          :name="props.name"
          :autocomplete="props.name"
          :required="props.required"
          class="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          :value="props.modelValue as string"
          @input="$emit('update:modelValue', handleInput($event))"
        ></textarea>
      </template>
      <template v-else-if="props.type === 'select'">
        <select
          :id="props.id"
          :name="props.name"
          :autocomplete="props.name"
          :required="props.required"
          class="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          :value="props.modelValue"
          @input="$emit('update:modelValue', handleInput($event))"
        >
          <option
            v-for="option in props.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </template>
      <template v-else-if="props.type === 'obs-color'">
        {{ props.modelValue }}
        <input
          :id="props.id"
          :name="props.name"
          type="color"
          :autocomplete="props.name"
          :required="props.required"
          class="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          :value="fromObs(props.modelValue as number)"
          @input="$emit('update:modelValue', handleInput($event, (v) => toObs(v)))"
        >
      </template>
      <input
        v-else
        :id="props.id"
        :name="props.name"
        :type="props.type"
        :autocomplete="props.name"
        :required="props.required"
        class="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
        :value="props.modelValue"
        @input="$emit('update:modelValue', handleInput($event))"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {FormInputOption} from "../../composables/useFormInputs";

const $emit = defineEmits(['update:modelValue'])

export type InputType =
  'text'
  | 'number'
  | 'password'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'obs-color'
  | 'checkbox'
  | 'textarea'
  | 'select'

const props = defineProps({
  modelValue: {
    type: [String, Boolean, Number] as PropType<string | number | boolean>,
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
    required: false,
    default: '',
  },
  value: {
    type: String,
    required: false,
    default: '',
  },
  type: {
    type: String as PropType<InputType>,
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
  options: {
    type: Array as PropType<FormInputOption[]>,
    required: false,
    default: () => [],
  },
})

const fromObs = (value: number) => {
  return '#' + value.toString(16).padStart(8, '0')
}

const toObs = (value: string) => {
  return parseInt(value.replace('#', ''), 16)
}

const handleInput = (event: Event, transform?: (value: string) => any) => {
  const target = event.target as HTMLInputElement
  return transform ? transform(target.value) : target.value
}

const handleChecked = (event: Event) => {
  const target = event.target as HTMLInputElement
  return target.checked
}

</script>
