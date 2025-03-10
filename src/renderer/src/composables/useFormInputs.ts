import {InputType} from "node:zlib";
import { ButtonVariant } from '@renderer/components/atoms/AppButton.vue'

export interface FormInputOption {
  value: string;
  text: string,
  enabled?: boolean
}

export interface FormInput {
  type: InputType;
  label: string;
  propertyName: string;
  colspan?: number;
  options?: FormInputOption[];
}

export interface FormButton {
  variant: ButtonVariant;
  text: string;
  propertyName: string;
}

export function useFormInputs(inputKind: string): FormInput[] {
  let formInputs: FormInput[];
  let formButtons: FormButton[];

  switch (inputKind) {
    case 'browser_source':
      formInputs = [
        {type: 'text', label: 'URL', propertyName: 'url'},
        {type: 'number', label: 'Width', propertyName: 'width', colspan: 2},
        {type: 'number', label: 'Height', propertyName: 'height', colspan: 2},
        {type: 'number', label: 'FPS', propertyName: 'fps', colspan: 2},
        {type: 'checkbox', label: 'Reroute Audio', propertyName: 'reroute_audio'},
        {type: 'checkbox', label: 'Restart When Active', propertyName: 'restart_when_active'},
        {type: 'checkbox', label: 'Shutdown', propertyName: 'shutdown'},
        {type: 'select', label: 'Webpage Control Level', propertyName: 'webpage_control_level'},
        {type: 'textarea', label: 'CSS', propertyName: 'css'},
      ];
      formButtons = [
        {variant: 'secondary', text: 'Refresh', propertyName: 'refreshnocache'},
      ];
      break;
    case 'color_source_v3':
      formInputs = [
        {type: 'obs-color', label: 'Color', propertyName: 'color'},
        {type: 'number', label: 'Width', propertyName: 'width'},
        {type: 'number', label: 'Height', propertyName: 'height'},
      ];
      break;
    case 'pipewire-desktop-capture-source':
      formInputs = [
        // restore_token is not supported in the UI
        {type: 'checkbox', label: 'Show Cursor', propertyName: 'show_cursor'},
      ];
      break;
    case 'text_ft2_source_v2':
      formInputs = [
        {type: 'text', label: 'Text', propertyName: 'text'},
        // todo add other fields
      ];
      break;
    case 'pulse_input_capture':
      formInputs = [
        {type: 'select', label: 'Device', propertyName: 'device_id'},
      ];
      break;
    case 'pulse_output_capture':
      formInputs = [
        {type: 'select', label: 'Device', propertyName: 'device_id'},
      ];
      break;
    default:
      // Default form inputs if input kind is not recognized
      console.log('Input kind not recognized', inputKind)
      formInputs = [];
      break;
  }

  return {
    formInputs,
    formButtons
  };
}
