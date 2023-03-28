import { createApp } from "vue";
import Toast, { useToast } from "vue-toastification";
import UiToast from '../components/toast.component.vue';

/**
 * Singleton class
 * Wrapper object for vue-toastification package.
 * Create Toast using our own component while using vue-toastification package options.
 *
 */

class ToastService {
  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (!this.instance) {
      this.instance = this;
      this.service = {
        isReady: false,
        queue: [],
      }
      // Create Toast app on document load.
      window.addEventListener("load", () => {
        const toastApp = createApp({
          template: '<div></div>',
          data() {return {}},
          mounted() {
            // make sure toastApp is ready to go.
            setTimeout(() => {
              fohn.toastService.markAsReady();
              fohn.toastService.flush();
            }, 100);
          }
        });
        toastApp.use(Toast, {container: document.querySelector('#fohn-toast')});
        toastApp.mount('#fohn-toast');
      });
    }
  }

  markAsReady() {
    this.service.isReady = true;
  }

  addQueue(notifier) {
    this.service.queue.push(notifier);
  }

  flush() {
    this.service.queue.forEach((notifier) => {
      this.notify(notifier.title, notifier.message, notifier.options);
    });
    this.service.queue = [];
  }

  /**
   *
   * Display toast using our own component.
   *
   */
  notify(title, message, options = {}) {
    if (!this.service.isReady) {
      this.addQueue({title: title, message: message, options: options});
      return;
    }

    const content = {
      component: UiToast,
      props: {
        title: title,
        message: message || '',
      }
    };

    useToast()(content, options);
  }
}

const toastService = new ToastService();
Object.freeze(toastService);

export default toastService;
