<script>

import {useTabsStoreFactory} from "./tabs.store";
import {onMounted, ref} from "vue";
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
    const {tabs} = storeToRefs(tabsStore);

    tabsStore.$subscribe((mutation, state) => {
      currentIndex.value = state.currentIdx;
    });

    props.tabsList.forEach((tab) => {
      tabsStore.registerTab(tab);
    });

    const activate = (idx) => {
      tabsStore.activate(idx);
    }

    onMounted(() => {
      activate(props.activeTabIdx);
    });

    return {container, tabs, currentIndex, activate}
  },
}
</script>

<template>
  <div ref="container" v-bind="$attrs">
    <slot :tabs="tabs" :currentIndex="currentIndex" :activate="activate">tabs</slot>
  </div>
</template>
