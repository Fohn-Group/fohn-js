<template>
  <slot :config="flatpickr" :fn="method" :modelValue="modelValue">fohn-date component</slot>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'fohn-date',
  props: {
    method: Object,
    modelValue: String,
    flatpickr: Object,
  },
  setup: function (props, { attrs, slots, emit }) {
    const { flatpickr, method } = props;
    const modelValue = ref(props.modelValue);

    method.onChange = (s, d, t) => {
      modelValue.value = d;
    };

    return { flatpickr, modelValue, method };
  },
};
</script>
