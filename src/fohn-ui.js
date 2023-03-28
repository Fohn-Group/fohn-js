/* eslint-disable */
/* global _FOHNVERSION_:true, __webpack_public_path__:true */
__webpack_public_path__ = window.__fohnBundlePublicPath === undefined ? '/public/' :  window.__fohnBundlePublicPath + '/';

import debounce from 'lodash.debounce';
import 'core-js/stable';
import date from 'locutus/php/datetime/date';
import { createPlugin, pluginFactory } from './pluginFactory';
import vueService from './services/vue.service';
import dataService from './services/data.service';
import apiService from "./services/api.service";
import { options, eventBus, utils, store } from './utils';
import serverEventService from "./services/server-event.service";
import toastService from "./services/toast.service";

createPlugin('fohn');

const fohn = {};

// add version function to fohn.
fohn.version = () => __VERSION__;
fohn.options = options;
fohn.eventBus = eventBus;
fohn.store = store;
fohn.utils = utils;
fohn.debounceTimeout = null;

fohn.debounce = (fn, value, immediate = false) => {
    const fohnTimeOutValue = fohn.options.get('debounceTimeout');
    return debounce(fn, fohnTimeOutValue !== null ? fohnTimeOutValue : value, immediate);
}

// Allow to register a plugin with jQuery;
fohn.registerPlugin = pluginFactory;

fohn.phpDate = date;
fohn.dataService = dataService;
fohn.vueService = vueService;
fohn.apiService = apiService;
fohn.serverEventService = serverEventService;
fohn.toastService = toastService;

/**
 * Exporting services in order to be available globally
 * or by importing it into your own module.
 *
 * Available as a global Var: fohn.uploadService.fileUpload()
 * Available as an import:
 *  import fohn from fohn4JS;
 *  fohn.uploadService.fileUpload();
 */
export default fohn;
