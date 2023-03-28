import jQuery from 'jQuery';
import apiService from "../services/api.service";

/**
 * Base implementation of jQuery plugin in Agile Toolkit.
 *
 */

export default class BasePlugin {
  /**
     * Default plugin constructor
     * @param element
     * @param options
     * @returns {BasePlugin}
     */
  constructor(element, options) {
    this.$el = jQuery(element);
    this.settings = options;
    this.main();
  }

  /**
     * The main plugin method. This is the method call by default
     * when invoking the plugin on a jQuery element.
     * $(selector).pluginName({});
     * The plugin should normally override this class.
     */
  main() {}

  /**
     * Call a plugin method via the initializer function.
     * Simply call the method like: jQuery(selector).pluginName('method', [arg1, arg2])
     *
     * @param fn : string representing the method name to execute.
     * @param args : array of arguments need for the method to execute.
     * @returns {*}
     */
  call(fn, args) {
    return this[fn](...args);
  }

  /**
   * Send ajax request.
   *
   * @param $el
   * @param uri
   * @param options
   * @returns {Promise<void>}
   */
  async sendRequest($el, uri, options) {
    $el.addClass('loading');
    const response = await apiService.fetchAsResult(uri, options);
    $el.removeClass('loading');

    return response;
  }
}
