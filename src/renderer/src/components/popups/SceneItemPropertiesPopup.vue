<template>
  <AppPopup>
    <div class="text-xl font-bold truncate">
      Properties of '{{ props.sceneItem.sourceName }}'
    </div>

    <form
      class="grid gap-2.5"
      @submit.prevent="saveSceneItemProperties"
    >
      <div class="min-h-[100px] max-h-[400px] overflow-y-auto mt-4">
        <div v-if="loading" class="text-center">
          <i class="fas fa-spinner-third animate-spin text-zinc-500 text-3xl mt-4"></i>
          <div class="text-zinc-400">
            Loading properties...
          </div>
        </div>
        <div v-else-if="formInputs.length === 0" class="text-center">
          <i class="fas fa-warning text-zinc-500 text-3xl mt-4"></i>
          <div class="text-zinc-400">
            No properties available for this source
          </div>
        </div>
        <div class="grid gap-2.5">
          <template v-for="input in formInputs" :key="input.name">
            <AppInput
              :id="input.name"
              :type="input.type"
              :name="input.name"
              :label="input.label"
              :options="input.options"
              :model-value="getInputValue(input)"
              @update:model-value="value => setInputValue(input, value)"
            />
          </template>
        </div>
      </div>
      <div class="flex justify-between mt-3">
        <div class="flex-1">
          <AppButton
            variant="outline"
            class="px-8"
            :loading="loading"
            :disabled="formInputs.length === 0"
            @click="resetSceneItemProperties"
          >
            Defaults
          </AppButton>
        </div>
        <div class="flex-none flex gap-2">
          <AppButton
            variant="secondary"
            class="px-8"
            @click="close"
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            variant="solid"
            class="px-8"
            :disabled="formInputs.length === 0"
            @click="saveSceneItemProperties"
          >
            OK
          </AppButton>
        </div>
      </div>
    </form>
  </AppPopup>
</template>

<script setup lang="ts">
import AppPopup from '../molecules/AppPopup.vue'
import {SceneItem} from "../../store/app";
import {useObs} from "../../composables/useObs";
import {onMounted, ref} from "vue";
import {FormInput, FormInputOption, useFormInputs} from "../../composables/useFormInputs";
import AppInput from "../atoms/AppInput.vue";
import AppButton from '../atoms/AppButton.vue'
import {usePopupStore} from "../../store/popup";

const {obs} = useObs()
const { close } = usePopupStore()

const props = defineProps<{
  sceneItem: SceneItem,
}>()

const loading = ref(true)
const formInputs = ref<FormInput[]>([])
const inputSettings = ref<{
  [key: string]: any
}>({})
const defaultInputSettings = ref<{
  [key: string]: any
}>({})

const getSceneItemProperties = async () => {
  const responseA = await obs.call('GetInputSettings', {
    inputName: props.sceneItem.sourceName,
  })

  const responseB = await obs.call('GetInputDefaultSettings', {
    inputKind: responseA.inputKind,
  })

  const inputs = useFormInputs(responseA.inputKind)
  for (const input of inputs) {
    if (input.type === 'select' && input.options === undefined) {
      const response = await obs.call('GetInputPropertiesListPropertyItems', {
        inputName: props.sceneItem.sourceName,
        propertyName: input.name,
      })

      input.options = response.propertyItems.map(item => {
        return {
          value: item.itemValue,
          text: item.itemName,
          enabled: item.itemEnabled,
        } as FormInputOption
      })
    }
  }

  inputSettings.value = responseA.inputSettings
  defaultInputSettings.value = responseB.defaultInputSettings
  formInputs.value = inputs
  loading.value = false
}

const getInputValue = (input: FormInput) => {
  return inputSettings.value[input.name] ?? defaultInputSettings.value[input.name]
}

const setInputValue = (input: FormInput, value: any) => {
  // cast checkbox, number, and boolean values to their respective types
  if (input.type === 'checkbox') {
    value = value === 'true' || value === true
  } else if (input.type === 'number') {
    value = parseFloat(value)
  }

  inputSettings.value = {
    ...inputSettings.value,
    [input.name]: value,
  }
}

const resetSceneItemProperties = () => {
  inputSettings.value = defaultInputSettings.value
}

const saveSceneItemProperties = async () => {
  await obs.call('SetInputSettings', {
    inputName: props.sceneItem.sourceName,
    inputSettings: inputSettings.value,
    overlay: false,
  })

  close()
}

onMounted(async () => {
  await getSceneItemProperties()
})
</script>
