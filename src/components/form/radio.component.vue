
<script>

export default {
  name: 'fohn-radio',
  props: {
    items: Array,
    modelValue: [String, Number],
  },
  emits: ['update:modelValue'],
  setup: function (props, { attrs, slots, emit }) {
    const { items, modelValue } = props;

    const setCtrlValue = (key) => {
      emit('update:modelValue', key);
    };

    return { items, modelValue, setCtrlValue };
  },
};
</script>

<template>
  <slot :items="items" :value="modelValue" :setCtrlValue="setCtrlValue" v-bind="$attrs"></slot>
</template>
