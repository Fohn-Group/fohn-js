<script>

import {useTabsStoreFactory} from "./tabs.store";
import {computed, onMounted, ref} from "vue";

export default {
  name: 'fohn-tab',
  props: {
    tabStoreId: String,
    name: String,
    initKeyFn: {
      type: String,
      default: 'init',
    },
    showKeyFn: {
      type: String,
      default: 'show',
    },
    hideKeyFn: {
      type: String,
      default: 'hide',
    },
    /** An array of [{key: fn}] **/
    onActiveHandlers: {
      type: Array,
      default: () => [],
    }
  },
  setup: function (props, { attrs, slots, emit }) {
    const {name, onActiveHandlers, initKeyFn, showKeyFn, hideKeyFn} = props;
    const tabContent = ref(null);
    const tabsStore = useTabsStoreFactory(props.tabStoreId)();

    tabsStore.$subscribe((mutation, state) => {
      if (state.activeTab === name) {
        executeHandlers(getHandlersForKey(onActiveHandlers, showKeyFn));
      }
      if (state.previousTab === name) {
        executeHandlers(getHandlersForKey(onActiveHandlers, hideKeyFn));
      }

    });

    const isActive = computed( () => name === tabsStore.activeTabName);
    const isDisabled = computed(() => tabsStore.getTab(name).disabled === true);

    onMounted(() => {
      executeHandlers(getHandlersForKey(onActiveHandlers, initKeyFn))
    });

    return {tabContent, isActive, isDisabled};
  },
}

/**
 * Return handlers function for specific keys into an array.
 * @param fnHandlers
 * @param key
 * @returns []
 */
function getHandlersForKey(fnHandlers, key) {
  return fnHandlers.reduce((acc, handler) => {
    const fn = handler[key] || null;
    if (fn) {
      acc.push(fn);
    }
    return acc;
  }, []);
}

/**
 * Execute handlers function.
 * @param handlers
 */
function executeHandlers(handlers) {
  handlers.forEach((fn) => fn());
}
</script>

<template>
  <div ref="tabContent" v-bind="$attrs">
    <slot :isActive="isActive" :isDisabled="isDisabled">tab content</slot>
  </div>
</template>
