<script>

import { computed, onMounted, ref } from 'vue';
import { useExtendedNode, useStringKey } from './composable/tree';
import apiService from '../../services/api.service';

export default {
  name: 'fohn-tree',
  props: {
    nodes: {
      type: Array,
      default: () => [],
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
    const selectionMode = props.ptProps.selectionMode || 'none';

    const extendedNodes = props.useExtendedNodes ? useExtendedNode(useStringKey(props.nodes), props.options) : useStringKey(props.nodes);

    const selectNode = (node) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({ __nodeKey: node.key, current: currentSelection.value, value: selectedKey.value }),
      };

      if (props.options?.selectUrl) {
        const { data, onFetchFinally } = apiService.fetchAsResponse(props.options.selectUrl, options);
        onFetchFinally(() => {
          const js = data.value?.jsRendered;
          if (js) {
            apiService.evalResponse(js);
          }
        });
      }
    };

    const unSelectNode = (node) => {
      // selectedKey.value = useUnSelectMode(props.ptProps.selectionMode, node, selectedKey.value);
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
