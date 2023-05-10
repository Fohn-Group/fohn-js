import { defineStore } from 'pinia';
import vueService from "../../services/vue.service";

export const useNavigationStoreFactory = (id) => {
  const store = defineStore(id, {
    state: () => ({
      mode: null,
      status: null,
    }),
    getters: {
      isOpen: (state) => state.status === 'open',
      inMobileMode: (state) => state.mode === 'mobile',
    },
    actions: {
      openNavigation() {
        if (this.mode === 'mobile') {
          this.status = 'open';
        }
      },
      closeNavigation() {
        if (this.mode === 'mobile') {
          this.status = 'close';
        }
      },
    },
  });

  fohn.vueService.addStore(id, store);

  return store;
}


