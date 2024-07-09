<script>

import { onMounted, ref } from 'vue';
import { useExtendedNode } from './composable/tree';

export default {
  name: 'fohn-tree',
  props: {
    nodes: {
      type: Array,
    },
    options: {
      type: Object,
    },
    useExtendedNodes: {
      type: Boolean,
      default: true,
    },
    // PassThrough Tree Props
    ptProps: {
      type: Object,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const ptProps = props.ptProps;
    const selectedKey = ref({});
    const extendedNodes = props.useExtendedNodes ? useExtendedNode(props.nodes, props.options) : props.nodes;

    const selectNode = (node) => {
      selectedKey.value[node.key] = true;
    };

    const unSelectNode = (node) => {
      selectedKey.value[node.key] = false;
    };

    onMounted(() => {
    });

    return {
      extendedNodes,
      selectNode,
      unSelectNode,
      selectedKey,
      ptProps,
    };
  },
};
</script>

<template>
  <slot
    :nodes="extendedNodes"
    :selectNode="selectNode"
    :unSelectNode="unSelectNode"
    :selectedKey="selectedKey"
    :ptProps="ptProps"
    v-bind="$attrs">
  </slot>
</template>

<style scoped>

</style>
