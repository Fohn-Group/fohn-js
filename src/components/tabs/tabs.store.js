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
      tabs: [], // an array of tab object i.e. {name: 'name', caption: 'Caption', disabled: false}
      activeTab: '',
      previousTab: '',
      currentIdx: 0,
    }),
    getters: {
      activeTabName: (state) => state.activeTab,
    },
    actions: {
      getTab(name) {
        return this.tabs[getTabIdxForName(this.tabs, name)];
      },
      registerTab(tab) {
        this.tabs.push(tab);
      },
      activate(idx) {
        if (!this.tabs[idx].disabled) {
          this.previousTab = this.activeTab;
          this.activeTab = this.tabs[idx].name;
          this.currentIdx = idx;
        }
      },
      activateByName(name) {
        this.activate(getTabIdxForName(this.tabs, name));
      },
      disable(idx) {
        if (!this.tabs[idx].disabled) {
          this.tabs[idx].disabled = true;
          if (this.currentIdx === idx) {
            this.activate(0);
          }
        }
      },
      disableByName(name) {
        this.disable(getTabIdxForName(this.tabs, name));
      },
      enable(idx) {
        if (this.tabs[idx].disabled) {
          this.tabs[idx].disabled = false;
        }
      },
      enableByName(name) {
        this.enable(getTabIdxForName(this.tabs, name));
      },
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
