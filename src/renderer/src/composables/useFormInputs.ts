import {InputType} from "node:zlib";

export interface FormInputOption {
  value: string;
  text: string,
  enabled?: boolean
}

export interface FormInput {
  type: InputType;
  label: string;
  name: string;
  options?: FormInputOption[];
}

export function useFormInputs(inputKind: string): FormInput[] {
  let formInputs: FormInput[];

  switch (inputKind) {
    case 'browser_source':
      formInputs = [
        {type: 'text', label: 'URL', name: 'url'},
        {type: 'number', label: 'Width', name: 'width'},
        {type: 'number', label: 'Height', name: 'height'},
        {type: 'number', label: 'FPS', name: 'fps'},
        {type: 'checkbox', label: 'Reroute Audio', name: 'reroute_audio'},
        {type: 'checkbox', label: 'Restart When Active', name: 'restart_when_active'},
        {type: 'checkbox', label: 'Shutdown', name: 'shutdown'},
        {type: 'select', label: 'Webpage Control Level', name: 'webpage_control_level'},
        {type: 'textarea', label: 'CSS', name: 'css'},
      ];
      break;
    case 'color_source_v3':
      formInputs = [
        {type: 'obs-color', label: 'Color', name: 'color'},
        {type: 'number', label: 'Width', name: 'width'},
        {type: 'number', label: 'Height', name: 'height'},
      ];
      break;
    case 'pipewire-desktop-capture-source':
      formInputs = [
        // restore_token is not supported in the UI
        {type: 'checkbox', label: 'Show Cursor', name: 'show_cursor'},
      ];
      break;
    case 'text_ft2_source_v2':
      formInputs = [
        {type: 'text', label: 'Text', name: 'text'},
        // todo add other fields
      ];
      break;
    case 'pulse_input_capture':
      formInputs = [
        {type: 'select', label: 'Device', name: 'device_id'},
      ];
      break;
    case 'pulse_output_capture':
      formInputs = [
        {type: 'select', label: 'Device', name: 'device_id'},
      ];
      break;
    default:
      // Default form inputs if input kind is not recognized
      console.log('Input kind not recognized', inputKind)
      formInputs = [];
      break;
  }

  return formInputs;
}
