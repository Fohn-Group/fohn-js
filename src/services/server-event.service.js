import apiService from './api.service';
import { utils } from '../utils';
/**
 * Handle server event request.
 *
 */
class ServerEventService {
  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (!this.instance) {
      this.instance = this;
      this.serverEvent = new Map();
    }
  }

  start(id, params = {}) {
    if (typeof (EventSource) === 'undefined') {
      console.error('ServerEvent is not supported on this browser.');
      return;
    }

    if (this.serverEvent.has(id)) {
      return;
    }

    this.serverEvent.set(id, {
      id: id,
      uri: params.uri,
      options: params.options,
      source: new EventSource(params.uri),
    });

    this.serverEvent.get(id).source.onmessage = ({ data }) => {
      this.handleResponse(data);
    };

    this.serverEvent.get(id).source.onerror = (e) => {
      if (e.eventPhase === EventSource.CLOSED) {
        this.stop(id);
      }
    };

    this.serverEvent.get(id).source.addEventListener('fohn_sse_action', ({ data }) => {
      this.handleResponse(data);
    }, false);

    if (params.closeBeforeUnload) {
      window.addEventListener('beforeunload', (event) => {
        this.stop(id);
      });
    }
  }

  handleResponse(data) {
    const {success, jsRendered } = utils().json().parse(data);
    if (success && jsRendered) {
      apiService.evalResponse(jsRendered);
    }
  }

  stop(id) {
    if (this.serverEvent.has(id)) {
      this.serverEvent.get(id).source.close();
      this.serverEvent.delete(id);
    }
  }
}

const serverEventService = new ServerEventService();
Object.freeze(serverEventService);

export default serverEventService;
