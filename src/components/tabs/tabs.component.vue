<script>

import {useTabsStoreFactory} from "./tabs.store";
import {onMounted, reactive, ref} from "vue";
import {storeToRefs} from "pinia";

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
    const {storeId} = props;
    const container = ref(null);
    const currentIndex = ref(0);
    const tabsStore = useTabsStoreFactory(storeId)();
    let {tabsList} = storeToRefs(tabsStore);

    tabsStore.$subscribe((mutation, state) => {
      currentIndex.value = state.currentIdx;
    });

    props.tabsList.forEach((tab, idx) => {
      tabsStore.registerTab(idx, tab);
    });

    const activate = (idx) => {
      tabsStore.activate(idx);
    }

    onMounted(() => {
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
