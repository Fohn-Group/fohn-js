<template>
  <div v-bind="$attrs" v-resize:500="method.setNavigationMode" v-esc="method.closeNavigation" >
    <slot :title="title"
          :icons="icons"
          :groups="groups"
          :navigationCss="navigationCss"
          :isOpen="isOpen"
          :inMobileMode="inMobileMode"
          :fn="method" >
      Navigation
    </slot>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useNavigationStoreFactory } from './navigation.store';

export default {
  name: 'fohn-navigation',
  props: {
    navigation: {
      type: Object,
    },
    breakPoint: {
      type: String,
      default: 'lg',
    },
    menuWidth: {
      type: String,
      like: Number,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: 52,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { title, groups, icons } = props.navigation;
    const { menuWidth, breakPoint } = props;
    const method = {};
    const isOpen = ref(false);
    const inMobileMode = ref(false);
    const navigationStore = useNavigationStoreFactory('Navigation')();
    const transitionReady = ref(false);
    const breakPointValue = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };

    const setMode = (width) => {
      navigationStore.mode = width > breakPointValue[breakPoint] - 1 ? 'desktop' : 'mobile';
    };

    onMounted(() => {
      setMode(window.innerWidth);
      inMobileMode.value = navigationStore.inMobileMode;
    });

    // set proper navigation mode when window resize.
    // call by v-resize directive.
    method.setNavigationMode = ({ width, height }) => {
      setMode(width);
    };

    // subscribe to store mutation.
    navigationStore.$subscribe((mutation, state) => {
      isOpen.value = navigationStore.isOpen;
      inMobileMode.value = navigationStore.inMobileMode;
      // set transition on first mutation.
      transitionReady.value = true;
    });

    method.closeNavigation = () => {
      navigationStore.closeNavigation();
    };

    // set navigation css Tailwind class
    const navigationCss = computed(() => {
      const widthCss = {
        52: { width: 'w-52', translateMinus: '-translate-x-52' },
        56: { width: 'w-56', translateMinus: '-translate-x-56' },
        60: { width: 'w-60', translateMinus: '-translate-x-60' },
        64: { width: 'w-64', translateMinus: '-translate-x-64' },
      };
      const { width } = widthCss[menuWidth];
      const minusTranslate = widthCss[menuWidth].translateMinus;

      return {
        [width]: true,
        transition: transitionReady.value,
        transform: true,
        'translate-x-0': !inMobileMode.value || (inMobileMode.value && isOpen.value),
        [minusTranslate]: inMobileMode.value && !isOpen.value,
      };
    });

    return {
      title,
      icons,
      groups,
      navigationCss,
      isOpen,
      inMobileMode,
      method,
    };
  },
};
</script>

<style scoped>
</style>
