<script>

import { computed, onMounted, ref } from 'vue';
import { useExtendedNode, usePostData, useStringKey } from './composable/tree';

export default {
  name: 'fohn-tree',
  props: {
    // the nodes to be display.
    nodes: {
      type: Array,
      default: () => [],
    },
    // The raw value for TreeNode selection.
    nodeValue: {
      type: Object,
    },
    // Callback url. When a tree node is select or unselect.
    callbackUrl: String,
    // Node options like collapse and expanded icons.
    extendedNodeOptions: {
      type: Object,
    },
    useExtendedNodes: {
      type: Boolean,
      default: true,
    },
    // PassThrough Prime TreeNode Props
    ptProps: {
      type: Object,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const ptProps = props.ptProps;
    const selectedKey = ref(props.nodeValue);
    const selectionMode = props.ptProps.selectionMode || 'single';

    const extendedNodes = props.useExtendedNodes ? useExtendedNode(useStringKey(props.nodes), props.extendedNodeOptions) : useStringKey(props.nodes);

    const selectNode = (node) => {
      if (props.callbackUrl) {
        usePostData(props.callbackUrl, 'select', node.key, currentSelection.value, selectedKey.value);
      }
    };

    const unSelectNode = (node) => {
      if (props.callbackUrl) {
        usePostData(props.callbackUrl, 'unselect', node.key, currentSelection.value, selectedKey.value);
      }
    };

    const updateSelection = (node) => {
      selectedKey.value = node;
    };

    const currentSelection = computed(() => {
      if (selectionMode === 'single' || selectionMode === 'multiple') {
        return Object.keys(selectedKey.value);
      }
      else if (selectionMode === 'checkbox') {
        const selection = [];
        for (const [key, value] of Object.entries(selectedKey.value)) {
          if (value.checked) {
            selection.push(key);
          }
        }
        return selection;
      }
      return [];
    });

    onMounted(() => {

    });

    return {
      extendedNodes,
      selectNode,
      unSelectNode,
      selectedKey,
      updateSelection,
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
    :updateSelection="updateSelection"
    :ptProps="ptProps"
    v-bind="$attrs">
  </slot>
</template>

<style scoped>

</style>
