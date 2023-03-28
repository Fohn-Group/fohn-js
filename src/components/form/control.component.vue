<script>
/**
 * Wrapper component for a form control.
 * Expose slot props to component inline template.
 *
 * 2022-11-18 - Modified component by moving single slot props
 * into property of inputAttrs object.
 * This allows to use v-model on input element
 * of parent template.
 * V-model will work on slot when set as an object property.
 * Before <slot :inputName="inputName", inputValue="inputValue...></slot>
 * After <slot :inputAttrs="inputAttrs"...></slot>
 * where inputAttrs = {
 *   name: "", value:"" ...
 * }
 *
 */
import { computed, ref, watch, onMounted } from 'vue';
import { useDebounceFn } from "@vueuse/core";
import { getInputAttrs } from './composable/control';
import { useFormStoreFactory } from "./form.store";

export default {
  name: 'fohn-control',
  props: {
    ctrlName: String,
    ctrlValue: [Number, String, Array, Object, Boolean],
    caption: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    onChanges: {
      type: Array,
      default: () => [],
    },
    formStoreId: {
      type: String,
      default: '',
    },
    step: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { caption, hint, formStoreId } = props;
    const container = ref(null);
    const inputAttrs = getInputAttrs(props);
    const formStore = useFormStoreFactory(formStoreId || '__form_generic')();
    // onChanges is an array of object {fn: function to execute, debounceValue: debounce time}.
    const onChangeHandlers = props.onChanges;

    formStore.$subscribe( (mutation, state) => {
      inputAttrs.value = state.controls.get(props.ctrlName).value;
    });

    /**
     * Update new input value in formStore
     * and execute onChange method handlers with new value.
     * @param val
     */
    const onValueChange = (val) => {
      debounceHandlers.forEach((handler) => {
        handler(val);
      });
      formStore.setControlValue(inputAttrs.name, val);
    };

    // hold debounce handlers functions.
    const debounceHandlers = [];
    // push each onChange handler as a debounce function into debounceHandlers.
    onChangeHandlers.forEach((handler) => {
      debounceHandlers.push(useDebounceFn(handler.fn, handler.debounceValue || 0));
    });

    /**
     * computed error message.
     * Errors are provide by form parent component via formStore.
     */
    const errorMsg = computed(() => {
      let msg = '';
      if (formStore.errors.has(inputAttrs.name)) {
        msg = formStore.errors.get(inputAttrs.name).msg;
      }

      return msg;
    });

    const toggleType = (newType) => {
      if (inputAttrs.type === newType) {
        inputAttrs.type = props.type;
      } else {
        inputAttrs.type = newType;
      }
    };

    watch(() =>  inputAttrs.value, (newValue) => {
      formStore.clearError(inputAttrs.name);
      onValueChange(newValue);
    });

    onMounted(() => {
      formStore.registerControl(  inputAttrs.name, {
        name: inputAttrs.name,
        originalValue: inputAttrs.value,
        value: inputAttrs.value,
      });
    });

    return {
      container,
      inputAttrs,
      hint,
      caption,
      toggleType,
      errorMsg,
    };
  },
};
</script>

<template>
  <div v-bind="$attrs" ref="container">
    <slot
        :inputAttrs="inputAttrs"
        :hint="hint"
        :caption="caption"
        :toggleType="toggleType"
        :errorMsg="errorMsg"
    >input slot
    </slot>
  </div>
</template>
