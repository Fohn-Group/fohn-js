import { defineStore } from 'pinia';
import {utils} from "../../utils";
import apiService from "../../services/api.service";
import vueService from "../../services/vue.service";

/**
 * Return a Pinia store definition function.
 *
 * Usage: const modalStore = useFactoryModalStore(myId)();
 *
 *
 *
 * @param id
 * @returns {StoreDefinition<*, {totalItems: null, itemsPerPage: null, currentQuery: string, currentPage: number}, {}, {fetchItems(*): (UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}>|(UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}
 */
export const useModalStoreFactory = (id) => {
  const store = defineStore(id, {
    state: () => ({
      callbackPayload: {},
      contentUrl: '',
      callbacks: {},
      title: '',
      status: 'close',
      isLoading: false,
      contentId: null,
      containerEl : null,
      message: '',
    }),
    getters: {
    },
    actions: {
      async fetchHtml(fetchUrl, args = {}) {
        const url = utils().url().appendParams(fetchUrl, args);
        this.isLoading = true;
        const options = {
          method: 'GET',
        }

        const { success, id, html, jsRendered } = await apiService.fetchAsResult(url, options);
        if (success && id && html) {
          const modalContent = document.getElementById(id);
          if (modalContent) {
            modalContent.innerHTML = html;
          } else {
            console.error('Cannot find modal content.');
          }
          this.contentId = id;
        }
        if (success && jsRendered) {
          apiService.evalResponse(jsRendered, this.$el);
        }
        this.isLoading = false;
      },
      /**
       * Open modal with options.
       *
       * @param options
       */
      openModal(options = {}) {
        const {message, args = {}, payload = {}} = options;
        this.message = message;
        this.callbackPayload = payload;
        this.status = 'open';
        if (this.contentUrl) {
          this.fetchHtml(this.contentUrl, args);
        }
      },
      closeModal() {
        this.status = 'close';
        if (this.contentUrl && this.contentId) {
          document.getElementById(this.contentId).innerHTML = '';
        }
      },
      setTitle(title) {
        this.title = title;
      },
      onCallback(event, name, args) {
        const options = {
          method: 'POST',
          body: JSON.stringify(this.callbackPayload),
        };

        event.target.classList.add('loading');
        const url = utils().url().appendParams(this.callbacks[name], args);

        const {data, onFetchFinally, onFetchResponse} = apiService.fetchAsResponse(url, options);
        onFetchResponse( () => {
          const {success, jsRendered } = data.value;
          if (success && jsRendered) {
            apiService.evalResponse(jsRendered, this.$el);
          }
        });

        onFetchFinally( () => {
          event.target.classList.remove('loading');
        });
      },
    },
  });

  vueService.addStore(id, store);

  return store;
}
