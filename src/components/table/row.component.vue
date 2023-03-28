<template>
    <slot :row="row" v-bind="$attrs">row</slot>
</template>

<script>
export default {
  name: 'fohn-table-row',
  props: {
    row: Object,
  },
  emits: {},
  setup: function (props, { attrs, slots, emit }) {
    const { row } = props;
    const method = {};

    method.getRowClass = (idx) => ({
      'bg-gray-200': idx % 2,
    });

    return { row };
  },
};
</script>

<style scoped>

</style>
