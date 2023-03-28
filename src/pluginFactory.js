import jQuery from 'jQuery';
import reloadView from './plugins/reload-view.plugin';
import CallbackRequest from './plugins/callback-request.plugin';

/**
 * Generate a jQuery plugin
 * @param name [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as jQuery.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin);
 *
 * credit : https://gist.github.com/monkeymonk/c08cb040431f89f99928132ca221d647
 *
 */
function pluginFactory(name, className, shortHand = false, nameSpace = null) {
  if (!nameSpace) {
    console.error('Missing namespace for pluginFactory.');
    return;
  }
  // Add namespace to jQuery global space.
  if (!jQuery[nameSpace]) {
    jQuery[nameSpace] = {};
  }

  const pluginName = nameSpace + name;
  const dataName = `__jQuery{pluginName}`;

  // add plugin to namespace.
  jQuery[nameSpace][name] = className;

  // register plugin to jQuery fn prototype.
  jQuery.fn[pluginName] = function (option = {}, args = []) {
    // Check if we are calling a plugin specific function: jQuery(element).plugin('function',[arg1, arg2]);
    if (typeof option === 'string') {
      if (this.data(dataName) && typeof this.data(dataName)[option] === 'function') {
        return this.data(dataName).call(option, args);
      }
      // return if trying to call a plugin method prior to instantiate it.
      return;
    }

    return this.each(function () {
      const options = jQuery.extend({}, className.DEFAULTS, typeof option === 'object' && option);
      // create plugin using the constructor function store in namespace object
      // and add a reference of it to this jQuery object data.
      jQuery(this).data(dataName, new jQuery[nameSpace][name](this, options));
    });
  };

  // - Short hand
  if (shortHand) {
    jQuery[pluginName] = (options) => jQuery({})[pluginName](options);
  }
}

/**
 * Create jQuery plugins.
 */
function createPlugin(nameSpace) {
  const plugins = [
    { name: 'ReloadView', plugin: reloadView, sh: false },
    { name: 'CallbackRequest', plugin: CallbackRequest, sh: false },
  ];

  plugins.forEach((plugin) => {
    pluginFactory(plugin.name, plugin.plugin, plugin.sh, nameSpace);
  });
}

export { createPlugin, pluginFactory };
