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
import {computed, ref, watch, onMounted, reactive} from 'vue';
import {useDebounceFn} from "@vueuse/core";
import { useFormStoreFactory } from "./form.store";

export default {
  name: 'fohn-control',
  props: {
    caption: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    onChanges: {
      type: Array,
      default: () => [],
    },
    formStoreId: {
      type: String,
      default: '__form_generic',
    },
    htmlInputAttrs: {
      type: Object,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { caption, hint, formStoreId } = props;
    const inputAttrs = reactive(props.htmlInputAttrs);
    const container = ref(null);

    // Create store and subscribed to control changes.
    const formStore = useFormStoreFactory(formStoreId)();
    formStore.$subscribe( (mutation, state) => {
      inputAttrs.value = state.controls.get(inputAttrs.name).value;
    });

    // onChanges is an array of object {fn: function to execute, debounceValue: debounce time}.
    const onChangeHandlers = props.onChanges;

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
      if (formStore.errors.has(inputAttrs.name)) {
        return formStore.errors.get(inputAttrs.name).msg;
      }

      return '';
    });

    const toggleType = (newType) => {
      inputAttrs.type = (inputAttrs.type === newType) ? props.htmlInputAttrs.type : newType;
    };

    // Check for input value changes.
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
