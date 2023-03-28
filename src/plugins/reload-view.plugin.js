import BasePlugin from './base.plugin';
import apiService from '../services/api.service';
import { utils } from '../utils';

/**
 * Replace an element html content following an ajax request.
 */
export default class ReloadView extends BasePlugin {
  main() {
    if (!this.settings.uri) {
      console.error('Trying to replace an element html without an url.');
      return;
    }

    const { uri, payload, afterSuccess, loadContext, fetchOptions }  = this.settings;
    let $el = this.$el;
    
    const url = utils().url().appendParams(uri, payload);

    fetchOptions.method = 'GET';

    if (loadContext) {
      $el = jQuery(loadContext);
    }
    
    this.sendRequest($el, url, fetchOptions)
      .then(({ success, id, html, jsRendered }) => {
        if (success && id && html) {
          const result = jQuery('#' + id).replaceWith(html);
          if (!result.length) {
            throw ('Unable to replace element with id: ' + id)
          }
        }
        if (success && jsRendered) {
          apiService.evalResponse(jsRendered, this.$el);
        }
        if (afterSuccess) {
          apiService.evalResponse(afterSuccess, this.$el);
        }
      }).catch((e) => {
        console.error(e);
      });
  }
}

ReloadView.DEFAULTS = {
  uri: null,
  payload: {},
  afterSuccess: null,
  fetchOptions: {},
  loadContext: null,
};
