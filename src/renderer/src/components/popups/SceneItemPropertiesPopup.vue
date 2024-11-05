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
        <div class="grid grid-cols-6 gap-2.5">
          <template v-for="input in formInputs" :key="input.propertyName">
            <AppInput
              :id="input.propertyName"
              :type="input.type as any"
              :property-name="input.propertyName"
              :label="input.label"
              :options="input.options"
              :model-value="getInputValue(input)"
              :class="input.colspan ? `col-span-${input.colspan}` : `col-span-6`"
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
          <template
            v-for="button in formButtons"
          >
            <AppButton
              :variant="button.variant"
              class="px-8"
              @click="pressInputPropertiesButton(button)"
            >
              {{ button.text }}
            </AppButton>
          </template>
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
import { FormButton, FormInput, FormInputOption, useFormInputs } from '../../composables/useFormInputs'
import AppInput from "../atoms/AppInput.vue";
import AppButton from '../atoms/AppButton.vue'
import {usePopupStore} from "../../store/popup";
import { useNotificationStore } from '../../store/notification'

const {obs} = useObs()
const { close } = usePopupStore()
const { success, exception } = useNotificationStore()

const props = defineProps<{
  sceneItem: SceneItem,
}>()

const loading = ref(true)
const formInputs = ref<FormInput[]>([])
const formButtons = ref<FormButton[]>([])
const inputSettings = ref<{
  [key: string]: any
}>({})
const defaultInputSettings = ref<{
  [key: string]: any
}>({})

const pressInputPropertiesButton = async (formButton: FormButton) => {
  try {
    await obs.call('PressInputPropertiesButton', {
      inputName: props.sceneItem.sourceName,
      propertyName: formButton.propertyName,
    })
    success({
      title: 'Success',
      message: `Button '${formButton.text}' was pressed`,
      type: 'success'
    })
  } catch (e) {
    exception(e)
  }
}

const getSceneItemProperties = async () => {
  const responseA = await obs.call('GetInputSettings', {
    inputName: props.sceneItem.sourceName,
  })

  const responseB = await obs.call('GetInputDefaultSettings', {
    inputKind: responseA.inputKind,
  })

  const {formInputs: inputs, formButtons: buttons} = useFormInputs(responseA.inputKind)
  for (const input of inputs) {
    if (input.type === 'select' && input.options === undefined) {
      const response = await obs.call('GetInputPropertiesListPropertyItems', {
        inputName: props.sceneItem.sourceName,
        propertyName: input.propertyName,
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
  formButtons.value = buttons
  loading.value = false
}

const getInputValue = (input: FormInput) => {
  return inputSettings.value[input.propertyName] ?? defaultInputSettings.value[input.propertyName]
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
    [input.propertyName]: value,
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
