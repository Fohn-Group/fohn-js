import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('NavigationStore', {
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
