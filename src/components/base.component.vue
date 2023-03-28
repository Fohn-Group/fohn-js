<template>
  <slot :data="componentData" v-bind="$attrs">fallback</slot>
</template>

<script>
/**
 * Wrapper for Fohn-ui Vue component.
 */

export default {
  name: 'fohn-base',
  props: {
    data: Object,
    default: {},
  },
  setup: function (props, { attrs, slots, emit }) {
    const componentData = props.data;

    return {
      componentData,
    };
  },
};

</script>
