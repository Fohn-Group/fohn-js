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
    // method.setDate = (d) => {
    //   console.log(d);
    // }
    method.onChange = (s, d, t) => {
      modelValue.value = d;
    };

    return { flatpickr, modelValue, method };
  },
  // methods: {
  //   onDateChange: function(s,d,t,) {
  //     console.log(s, d, t);
  //   }
  // }
};
</script>
