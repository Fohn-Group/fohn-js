import { createFetch } from '@vueuse/core';
import vueService from "./vue.service";

/**
 * Singleton class
 */

class ApiService {
  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (!this.instance) {
      this.instance = this;
      // useFetch instance.
      this.useApiFetch = createFetch({
        options: {
          beforeFetch({ options }) {
            options.headers['x-custom-header'] = '__fohn-ajax-request';
            return { options }
          },
        },
      });
    }
  }

  /**
     * Execute js code under window context.
     *
     * @param code // javascript to be eval.
     * @param context // 'this' context where code is evaluate.
     */
  evalResponse(code, context = window) {
    // eslint-disable-next-line
    new Function('$', `"use strict"; ${code}`).call(context, jQuery);
  }

  /**
   * Send server request using useFetch.
   * Setup request in order for Ui::Service exception handler to send
   * the exception rendered as html and display it in a Modal window
   * using Vue component 'fohn-exception-dialog'
   *
   * Usually use by Vue component.
   *
   * Return a useFetch response.
   *
   * @param url
   * @param options
   * @returns {UseFetchReturn<any> & PromiseLike<UseFetchReturn<any>>}
   */
  fetchAsResponse(url, options) {

    const response  = this.useApiFetch(url, options).json();

    response.onFetchError((error) => {
      this.handleServerError(error, response.data?.value?.exceptionHtml);
    });

    return response;
  }

  /**
   * Send server request using useFetch.
   * Setup request in order for Ui::Service exception handler to send
   * the exception rendered as html and display it in a Modal window
   * using Vue component 'fohn-exception-dialog'
   *
   * Usually use by jQuery plugin.
   *
   * Return useFetch data.value as Promise.
   *
   * Use as
   *
   * @param url
   * @param options
   * @returns {Promise<T>}
   */
  async fetchAsResult(url, options) {
    const { error, data } = await this.useApiFetch(url, options).json();

    if (error.value) {
      this.handleServerError(error.value, data.value?.exceptionHtml);
    }

    return data.value;
  }

  handleServerError(error, html) {
    console.error(error.message);
    vueService.tryDisplayException('fohn-exception-dialog', html  || 'Server Error: Check console output for more information.');
  }
}

const apiService = new ApiService();
Object.freeze(apiService);

export default apiService;
