<script>

import { computed, onMounted, ref } from 'vue';
import { useExtendedNode, useFetch, useStringKey, useIsTreeFetching } from './composable/tree';

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
    // Callback url to fetch for posting selected nodes.
    postUrl: String,
    // data-ui-name of the post value btn.
    postBtnName: String,
    // Callback url to fetch when a tree node is select or unselect.
    nodeChangedUrl: String,
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
    const container = ref(null);
    const postBtnEl = ref();
    const selectedKey = ref(props.nodeValue);
    const selectionMode = props.ptProps.selectionMode || 'single';
    const isFetching = useIsTreeFetching();

    const extendedNodes = props.useExtendedNodes ? useExtendedNode(useStringKey(props.nodes), props.extendedNodeOptions) : useStringKey(props.nodes);

    const selectNode = (node) => {
      if (props.nodeChangedUrl) {
        useFetch(props.nodeChangedUrl, { __nodeAction: 'select', __nodeKey: node.key });
      }
    };

    const unSelectNode = (node) => {
      if (props.nodeChangedUrl) {
        useFetch(props.nodeChangedUrl, { __nodeAction: 'unselect', __nodeKey: node.key });
      }
    };

    const updateSelection = (node) => {
      selectedKey.value = node;
    };

    const postValue = () => {
      if (props.postUrl) {
        useFetch(props.postUrl, { __nodeKeys: currentSelection.value, __treeValue: selectedKey.value });
      }
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

    const canFetch = computed(() => currentSelection.value.length > 0);

    onMounted(() => {
      postBtnEl.value = container.value.querySelector('button[data-ui-name=' + props.postBtnName + ']');
    });

    return {
      extendedNodes,
      postValue,
      selectNode,
      unSelectNode,
      selectedKey,
      updateSelection,
      ptProps,
      container,
      isFetching,
      canFetch,
    };
  },
};
</script>

<template>
  <div ref="container">
    <slot
      :isFetching="isFetching"
      :canFetch="canFetch"
      :nodes="extendedNodes"
      :postValue="postValue"
      :selectNode="selectNode"
      :unSelectNode="unSelectNode"
      :selectedKey="selectedKey"
      :updateSelection="updateSelection"
      :ptProps="ptProps"
      v-bind="$attrs">
    </slot>
  </div>
</template>

<style scoped>

</style>
