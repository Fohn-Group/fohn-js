<template>
    <slot :name="slotName" :cell="cell" v-bind="$attrs">cell</slot>
</template>

<script>

export default {
  name: 'fohn-table-cell',
  props: {
    cell: Object,
  },
  emits: {},
  setup: function (props, { attrs, slots, emit }) {
    const { cell } = props;
    const slotName = cell.name;

    return { slotName, cell, attrs };
  },
};
</script>

<style scoped>

</style>
