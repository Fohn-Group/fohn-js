import { defineStore } from 'pinia';
import vueService from "../../services/vue.service";

/**
 * Return a Pinia store definition function.
 *
 * Usage: const tabsStore = useFactoryTabStore(myId)();
 *
 *
 *
 * @param id
 * @returns {StoreDefinition<*, {totalItems: null, itemsPerPage: null, currentQuery: string, currentPage: number}, {}, {fetchItems(*): (UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}>|(UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}
 */
export const useTabsStoreFactory = (id) => {
  const store = defineStore(id, {
    state: () => ({
      tabs: new Map(),
      activeTab: '',
      previousTab: '',
      currentIdx: 0,
    }),
    getters: {
      activeTabName: (state) => state.activeTab,
      tabsList: (state) => state.tabs,
      isTabDisable: (state) => {
        const disables = Array.from(state.tabs.values()).filter((tab) => !tab.enable);

        return (name) => disables.filter(tab => tab.name === name).length > 0;
      },
    },
    actions: {
      registerTab(tabIdx, tab) {
        if (!tab?.enable) {
          tab.enable = true;
        }
        this.tabs.set(tabIdx, tab);
      },
      activate(idx) {
        this.previousTab = this.activeTab;
        this.activeTab = this.tabs.get(idx).name;
        this.currentIdx = idx;
      },
      activateByName(name) {
        this.activate(getTabIdxForName(this.tabs, name));
      },
      disable(idx) {
        this.tabs.get(idx).enable = false;
      },
      disableByName(name) {
        this.disable(getTabIdxForName(this.tabs, name));
      }
    },
  });

  function getTabIdxForName(tabs, name) {
    let tabIdx = 0;
    tabs.forEach((tab, idx) => {
      if (tab.name === name) {
        tabIdx = idx;
      }
    });

    return tabIdx;
  }

  vueService.addStore(id, store);

  return store;
}
