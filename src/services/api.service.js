import { createFetch } from '@vueuse/core';
import vueService from "./vue.service";
import fohn from "../fohn-ui";

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
            options.headers['Content-Type'] = 'application/json';
            options.headers['x-csfr-token'] = document.head.querySelector('meta[name=csfr-token]')?.content;

            return { options }
          },
          onFetchError( ctx) {
            if (ctx.response.status >= 300 && ctx.response.status <= 499) {
              fohn.utils().browser().redirect(ctx.data?.url || '/');
            } else {
              apiService.handleServerError(ctx.error.message, ctx.data?.exceptionHtml);
            }

            return ctx;
          }
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

    return this.useApiFetch(url, options).json();
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
    const { data } = await this.useApiFetch(url, options).json();

    return data.value;
  }

  handleServerError(error, html) {
    console.warn(error);
    vueService.tryDisplayException('fohn-exception-dialog', html  || 'Server Error: Check console output for more information.');
  }
}

const apiService = new ApiService();
Object.freeze(apiService);

export default apiService;
