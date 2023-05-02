/* eslint no-alert: "off" */

import BasePlugin from './base.plugin';
import apiService from '../services/api.service';
import dataService from '../services/data.service';

/**
 * Send an ajax request and process response.
 */
export default class CallbackRequest extends BasePlugin {
  main() {
    if (!this.settings.uri) {
      console.error('Trying to execute callback without an url.');
      return;
    }

    const { uri, confirm, storeName, payload, fetchOptions } = this.settings;
    let response;
    let store = {};

    fetchOptions.method = 'POST';

    if (storeName) {
      // get store object.
      store = dataService.getStoreData(storeName);
    }
    fetchOptions.body = JSON.stringify(Object.assign(payload, store));

    // Allow user to confirm if available.
    if (confirm) {
      // todo open a vue modal confirmation.
      if (window.confirm(confirm)) {
        response = this.sendRequest(this.$el, uri, fetchOptions);
      }
    } else if (!this.$el.hasClass('loading')) {
      response = this.sendRequest(this.$el, uri, fetchOptions);
    }

    response.then((resp) => {
      if (resp?.success && resp?.jsRendered) {
        apiService.evalResponse(resp.jsRendered, this.$el);
      }
    });
  }
}

CallbackRequest.DEFAULTS = {
  uri: null,
  payload: {},
  confirm: null,
  fetchOptions: {},
  storeName: null,
};
