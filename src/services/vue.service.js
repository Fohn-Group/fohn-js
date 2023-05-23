import {createApp, defineAsyncComponent, onMounted, ref} from 'vue';
import { createPinia } from 'pinia';
import ClickOutside from '../directives/click-outside.directive';
import { focus, resize, esc } from '../directives/commons.directive';
import Components from '../components/components-install';
import jQuery from 'jQuery';

// Vue loader component to display while dynamic component is loading.
const loaderComponent = {
  name: 'fohn-vue-loader',
  template: '<div><div class="ui active centered inline loader"></div></div>',
};

// Vue error component to display when dynamic component loading fail.
const errorComponent = {
  name: 'fohn-vue-error',
  template: '<div class="bg-red-600 text-white p-6"><p>Error: Unable to load Vue component</p></div>',
};

const directives = [
  { name: 'click-outside', def: ClickOutside },
  { name: 'focus', def: focus },
  { name: 'resize', def: resize },
  { name: 'esc', def: esc },
];

// Return async component that will load on demand.
// eslint-disable-next-line
const componentFactory = (name, jsLoader) => defineAsyncComponent({
  loader: () => jsLoader().then((r) => { fohn.vueService.markComponentLoaded(name); return r; }),
  loadingComponent: loaderComponent,
  errorComponent: errorComponent,
  delay: 200,
});

/**
 * Singleton class
 * Create Vue component.
 */
class VueService {
  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (!VueService.instance) {
      this.vues = new Map();
      this.piniaStore = createPinia();
      this.stores = new Map();
      VueService.instance = this;
    }
  }

  /**
   * Will display a modal containing the exception as html if elementId exist.
   * 
   * @param elementId
   * @param exceptionHtml
   */
  tryDisplayException(elementId, exceptionHtml) {
    if (document.getElementById(elementId)) {
      if (!this.vues.has(elementId)) {
        const app = createApp( {
          template: '<div><fohn-ui-exception :html="html" :isOpen="isOpen" ></fohn-ui-exception></div>',
          data: () => ({html: exceptionHtml, isOpen: true}),
        });
        app.use(Components);

        const vm = app.mount('#' + elementId);

        this.vues.set(elementId, {
          id: elementId,
          name: 'fohn-ui-exception',
          app: app,
          vm: vm,
          isLoaded: true,
        });
      } else {
        const dialog =  this.vues.get(elementId).vm;
        dialog.html = exceptionHtml;
        dialog.isOpen = true;
      }
    }
  }

  /**
   * Create Vue app component.
   * Set default components to use with.
   * Inject default functionality.
   */
  vueAppFactory( rootData ) {
    const app = createApp({
      setup: function() {
        const root = ref(null);
        const key = ref(0);

        onMounted(() => {
          if (root.value)  {
            root.value.$el.classList.remove('invisible');
          }
        });

        const forceRerender = () => {
          key.value += 1;
        }

        return { ...rootData, root, key, forceRerender, jQuery, fohn };
      }
    });

    app.use(this.piniaStore);
    app.use(Components);
    // setup fohn custom directives.
    directives.forEach((directive) => {
      app.directive(directive.name, directive.def);
    });

    return app;
  }

  /**
   * Created a Vue app and add it to the vues array.
   * For Root component (App) to be aware that it's children component is
   * mounted, you need to use @hook:mounted="setReady"
   */
  createVueApp(elementId, componentName, rootData) {
    if (this.vues.has(elementId)) {
      this.vues.get(elementId).app.unmount();
      this.vues.get(elementId).app = null;
      this.vues.get(elementId).vm = null;
    }

    const app = this.vueAppFactory(rootData);
    const vm = app.mount(elementId);

    this.vues.set(elementId, {
      id: elementId,
      name: componentName,
      app: app,
      vm: vm,
      isLoaded: true,
    });
  }

  /**
   * Return Vue.
   *
   * @returns {Vue | VueConstructor}
   */
  getVueApp(elementId) {
    return this.vues.get(elementId).app;
  }

  /*
    * Mark a component as loaded.
    */
  markComponentLoaded(name) {
    this.vues.forEach((component) => {
      if (component.name === name) {
        component.isLoaded = true;
      }
    });
  }

  /**
     * Check if all components on page are ready and fully loaded.
     */
  areComponentsLoaded() {
    return this.vues.filter((component) => component.isLoaded === false).length === 0;
  }

  addStore(id, store) {
    this.stores.set(id, store);
  }

  getStore(id) {
    return this.stores.get(id)();
  }
}

const vueService = new VueService();
Object.freeze(vueService);

export default vueService;
