let onResizeCallback;

export default {
  created: (el, binding, vnode, preNode) => {
    const onResizeCallback = binding.value;
    window.addEventListener('resize', () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      onResizeCallback({width, height});
    });
  },
  unmounted: () => {
    // If the element that has v-resize is removed, then
    document.removeEventListener('resize', onResizeCallback);
    onResizeCallback = null;
  },
};
