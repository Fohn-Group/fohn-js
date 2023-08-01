import { createApp } from "vue";
import Toast, { useToast } from "vue-toastification";
import UiToast from '../components/toast.component.vue';
import {utils} from "../utils";

/**
 * Singleton class
 * Service that display notification using Vue-Toastification packages.
 * Create Toast using our own component.
 * Any Vue-Toastification options may be used.
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
    }
  }

  /**
   * Create Toast App using Toast vue-toastification.
   *
   * @param toastContainerSelector
   * @returns {{}}
   */
  enableToastNotification(toastContainerSelector) {
    const toastApp = createApp({
      name: 'fohn-toast-app',
      props: {
        toastService: this.instance,
      },
      template: '<div></div>',
      data() {return {} },
      mounted() {
        // make sure toastApp is ready to go.
        setTimeout(() => {
          this.toastService.markAsReady();
          this.toastService.flush();
        }, 200);
      }
    }, {toastService: this.instance});
    toastApp.use(Toast, {container: document.querySelector(toastContainerSelector)});
    toastApp.mount(toastContainerSelector);
  }

  markAsReady() {
    this.service.isReady = true;
  }

  /**
   * Add notifier to queue.
   * @param notifier
   */
  addQueue(notifier) {
    this.service.queue.push(notifier);
  }

  /**
   * Flush queue and display all notifier set in queue.
   */
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
  notify(title, message = '', options = {}, sanitize = true) {

    const htmlContent = sanitize ? utils().text().sanitize(message) : message;

    if (!this.service.isReady) {
      this.addQueue({title: title, message: htmlContent, options: options});
      return;
    }

    const content = {
      component: UiToast,
      props: {
        title: title,
        message: htmlContent,
      }
    };

    useToast()(content, options);
  }
}

const toastService = new ToastService();
Object.freeze(toastService);

export default toastService;
