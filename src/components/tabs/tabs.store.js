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
    }),
    getters: {
    },
    actions: {
      registerTab(tabName, tab) {
        this.tabs.set(tabName, tab);
      },
      activate(idx) {
        this.activeTab = this.tabs.get(idx).name;
      }
    },
  });

  vueService.addStore(id, store);

  return store;
}
