import mitt from 'mitt';
import { useNavigationStore } from './components/navigation/navigation.store';
import { useModalStoreFactory } from "./components/modal/modal.store";
import { useFormStoreFactory } from "./components/form/form.store";
import {useTableStoreFactory} from "./components/table/table.store";

/**
 * Define global options.
 * In Js:
 *  fohn.options.set('name','value');
 * In Php:
 *  (new JsChain('fohn.options')->set('name', 'value');
 */
const options = () => {
  const props = {
    // Value for debounce time out (in ms) that will be applied globally when set using fohn.debounce.
    debounceTimeout: null,
  };
  return {
    set: (name, value) => { props[name] = value; },
    get: (name) => props[name],
  };
};

/**
 * Subscribe too and publish events.
 * listen to an event
 *   fohn.eventBus.on('foo', e => console.log('foo', e))
 * Fire an event
 *   fohn.eventBus.emit('foo', { a: 'b' })
 *
 */
const eventBus = () => {
  const bus = mitt();
  return {
    emit: (event, payload) => bus.emit(event, payload),
    on: (event, ref) => bus.on(event, ref),
    off: (event, ref) => bus.off(event, ref),
    clearAll: () => bus.all.clear(),
  };
};

/**
 * Utility in order to retrieve fohn vue component Pinia store.
 * Ex: generating an open navigation event from navigationStore
 *     fohn.store().getNavigationStore().openNavigation()
 */
const store = () => ({
  getFormStore: (formStoreId) => useFormStoreFactory(formStoreId)(),
  getTableStore: (tableStoreId) => useTableStoreFactory(tableStoreId)(),
  getModalStore: (modalStoreId) => useModalStoreFactory(modalStoreId)(),
  getNavigationStore: () => useNavigationStore(),
});

/*
* Utilities function that you can execute
* from fohn context. Usage: fohn.utils().date().parse('string');
*/
const utils = () => ({
  json: () => ({
    // try parsing string as JSON. Return parse if valid, otherwise return onError value.
    // handle big integer value when string contains 'n' char at the end.
    parse: (str, onError = null) => {
      try {
        return JSON.parse(str, (key, value) => {
          if (typeof value === 'string' && /^\d+n$/.test(value)) {
            // eslint-disable-next-line no-undef
            return BigInt(value.slice(0, -1));
          }
          return value;
        });
      } catch (e) {
        return onError;
      }
    },
    stringify: (data) => JSON.stringify(data, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }),
  }),
  date: () => ({
    // fix date parsing for different time zone if time is not supply.
    parse: (dateString) => {
      if (dateString.match(/^[0-9]{4}[/\-.][0-9]{2}[/\-.][0-9]{2}$/)) {
        dateString += ' 00:00:00';
      }
      return dateString;
    },
  }),
  url: () => ({
    matchLocation: (refUrlPath) => refUrlPath === (window.location.pathname),
    getBaseUrl: (url) => url.split('?')[0],
    getQueryParams: (urlSlug) => {
      const params = {};
      for (const [k, v] of new URLSearchParams(urlSlug.split('?')[1])) {
        params[k] = v;
      }
      return params;
    },
    addParams: (url, params) => {
      if (params) {
        const URLparams = new URLSearchParams(Object.entries(params));
        url += '?' + URLparams.toString();
      }
      return url;
    },
    appendParams: (url, params) => {
      const baseUrl = utils().url().getBaseUrl(url);
      const urlParams = utils().url().getQueryParams(url);
      return utils().url().addParams(baseUrl, {...urlParams, ...params});
    },
    removeParam: (urlSlug, paramToRemove) => {
      let baseUrl = urlSlug.split('?')[0];
      const params = new URLSearchParams(new URL(urlSlug).search);
      params.delete(paramToRemove);
      if (params.toString()) {
        baseUrl += '?' + params.toString();
      }
      return baseUrl;
    },
  }),
  browser: () => ({
    cleanHistory: (uri) => {
      window.history.replaceState({}, document.title, uri);
    },
    redirect: (url, params) => {
      window.location = utils().url().addParams(url, params);
    },
    windowOpen: (url, params = {}, target = '_blank') => {
      window.open(utils().url().addParams(url, params), target);
    }
  }),
});

export {
  options, eventBus, utils, store,
};
