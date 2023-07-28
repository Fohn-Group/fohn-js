<script>

import {useTabsStoreFactory} from "./tabs.store";
import {onMounted, ref} from "vue";

export default {
  name: 'fohn-tabs',
  props: {
    storeId: String,
    activeTabIdx: {
      type: Number,
      default: 0,
    },
    tabsList: {
      type: Array,
      default: () => [],
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const {storeId, tabsList} = props;
    const container = ref(null);
    const currentIndex = ref(0);
    const tabsStore = useTabsStoreFactory(storeId)();

    const activate = (idx) => {
      tabsStore.activate(idx);
      currentIndex.value = idx;
    }

    onMounted(() => {
      tabsList.forEach((tab, idx) => {
        tabsStore.registerTab(idx, tab);
      });

      activate(props.activeTabIdx);

    });

    return {container, tabsList, currentIndex, activate}
  },
}
</script>

<template>
  <div ref="container" v-bind="$attrs">
    <slot :tabsList="tabsList" :currentIndex="currentIndex" :activate="activate">tabs</slot>
  </div>
</template>
