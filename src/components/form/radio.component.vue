
<script>

export default {
  name: 'fohn-radio',
  props: {
    items: Array,
    inputName: String,
    inputId: {
      type: String,
      default: 'radioId',
    },
    modelValue: [String, Number],
  },
  emits: ['update:modelValue'],
  setup: function (props, { attrs, slots, emit }) {
    const { items, modelValue, inputName, inputId } = props;

    const setCtrlValue = (key) => {
      emit('update:modelValue', key);
    };

    return { items, modelValue, setCtrlValue, inputName, inputId };
  },
};
</script>

<template>
  <slot
      :items="items"
      :value="modelValue"
      :setCtrlValue="setCtrlValue"
      :inputName="inputName"
      :inputId="inputId"
      v-bind="$attrs"></slot>
</template>
