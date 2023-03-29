import debounce from 'lodash.debounce';

/**
 * Focus on an element.
 */
const focus = {
  inserted: function (el) {
    el.focus();
  },
};

/**
 * Add global window resize event listener.
 * You can add an argument for the debounce time value. ex: v-resize:500
 * will set debounce time to 500ms instead of the default time of 650ms
 * The function attached to the directive will be call with width and height value.
 * ex v-resize:500="setElement"
 *
 *  function setElement(width, height) {}
 */
const resize = {
  created: (el, binding, vnode, preNode) => {
    // callback function to call from directive v-resize="callback"
    el._onResizeCallback = binding.value;
    const delay = binding.arg ? binding.arg : 650;
    window.addEventListener('resize', debounce(() => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      el._onResizeCallback({ width, height });
    }), delay);
  },
  unmounted: (el, binding) => {
    // If the element that has v-resize is removed, then
    document.removeEventListener('resize', el._onResizeCallback);
    delete el._onResizeCallback;
  },
}

/**
 *
 * Add global keydown event listener for Escape key.
 * The function attached to the directive will be called when escape key is pressed.
 * ex: v-esc="closeNavigation"
 */
const esc = {
  created: (el, binding) => {
    el._keydownEscCallback = binding.value;
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        el._keydownEscCallback();
      }
    });
  },
  unmounted: (el, binding) => {
    document.removeEventListener('keydown', el._keydownEscCallback);
    delete el._keydownEscCallback;
  },
};


export { focus, resize, esc };
