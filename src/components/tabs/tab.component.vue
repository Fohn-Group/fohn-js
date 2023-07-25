<script>

import {useTabsStoreFactory} from "./tabs.store";
import {computed, ref} from "vue";

export default {
  name: 'fohn-tab',
  props: {
    tabStoreId: String,
    name: String,
  },
  setup: function (props, { attrs, slots, emit }) {
    const {name} = props;
    const tabContent = ref(null);
    const currentActiveTab = ref('');
    const tabsStore = useTabsStoreFactory(props.tabStoreId)();

    tabsStore.$subscribe((mutation, state) => {
      currentActiveTab.value = state.activeTab;
    });

    const isActive = computed( () => name === currentActiveTab.value);

    return {tabContent, isActive}
  },
}
</script>

<template>
  <div ref="tabContent" v-bind="$attrs">
    <slot :isActive="isActive">tab content</slot>
  </div>
</template>
