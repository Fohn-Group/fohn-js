<template>
    <div ref="spinnerEl" :style="containerStyle" :class="containerClass">
      <div :style="spinnerStyle" :class="spinnerClass"></div>
      <div :style="textStyle" class="text-center" v-if="spinMsg.length > 0">{{spinMsg}}</div>
    </div>
</template>

<script>
import {
  computed, toRefs, ref, watch,
} from 'vue';

export default {
  props: {
    spin: {
      type: Boolean,
      default: false,
    },
    spinFor: {
      type: String,
      default: '',
    },
    spinForClass: {
      type: String,
      default: 'opacity-25',
    },
    size: {
      // either a number (pixel width/height) or 'tiny', 'small',
      // 'medium', 'large', 'huge', 'massive' for common sizes
      default: 32,
    },
    lineSize: {
      type: Number,
      default: 3,
    },
    lineBgColor: {
      type: String,
      default: '#eee',
    },
    lineFgColor: {
      type: String,
      default: '#2196f3', // match .blue color to Material Design's 'Blue 500' color
    },
    speed: {
      type: Number,
      default: 0.8,
    },
    spacing: {
      type: Number,
      default: 4,
    },
    message: {
      type: String,
      default: '',
    },
    fontSize: {
      type: Number,
      default: 13,
    },
    textFgColor: {
      type: String,
      default: '#555',
    },
  },
  setup: function (props) {
    const { size, message, spin } = toRefs(props);
    const spinnerEl = ref(null);
    const position = ref({ top: 0, right: 0 });

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getLineSize(sizeValue) {
      switch (sizeValue) {
      case 'tiny': return 1;
      case 'small': return 2;
      case 'medium': return 3;
      case 'large': return 3;
      case 'big': return 4;
      case 'huge': return 4;
      case 'massive': return 5;
      default: return isNumber(props.lineSize) ? props.lineSize : 4;
      }
    }

    function getSizePx(sizeValue) {
      switch (sizeValue) {
      case 'tiny': return 12;
      case 'small': return 16;
      case 'medium': return 32;
      case 'large': return 48;
      case 'big': return 64;
      case 'huge': return 96;
      case 'massive': return 128;
      default: return isNumber(sizeValue) ? sizeValue : 32;
      }
    }

    function textMarginTop(sizeValue) {
      switch (sizeValue) {
      case 'tiny':
      case 'small':
      case 'medium':
      case 'large':
      case 'big':
      case 'huge':
      case 'massive':
        return Math.min(Math.max(Math.ceil(getSizePx(sizeValue) / 8), 3), 12);
      default:
        return isNumber(props.spacing) ? props.spacing : 4;
      }
    }

    function textFontSize(sizeValue) {
      switch (sizeValue) {
      case 'tiny':
      case 'small':
      case 'medium':
      case 'large':
      case 'big':
      case 'huge':
      case 'massive':
        return Math.min(Math.max(Math.ceil(getSizePx(sizeValue) * 0.4), 11), 32);
      default: return isNumber(this.fontSize) ? this.fontSize : 13;
      }
    }

    /**
       * Set spinner container position based on parent element.
       * @param el HtmlElement
       */
    function setContainerPosition(el) {
      const parent = el.parentElement;

      position.value.right = (parent.clientWidth / 2) - (el.offsetWidth / 2);
      position.value.top = (parent.clientHeight / 2) - (el.offsetHeight / 2);
    }

    /**
       * Spinner style Computed property.
       * @type {ComputedRef<{"border-radius": string, border: string, "border-top": string, width: string, height: string}>}
       */
    const spinnerStyle = computed(() => ({
      'border-radius': '100%',
      border: getLineSize(size.value) + 'px solid ' + props.lineBgColor,
      'border-top': getLineSize(size.value) + 'px solid ' + props.lineFgColor,
      width: getSizePx(size.value) + 'px',
      height: getSizePx(size.value) + 'px',
    }));

    /**
       * Text style computed property.
       * @type {ComputedRef<{color: String, "font-size": string, "margin-top": string, "text-align": string}>}
       */
    const textStyle = computed(() => ({
      'margin-top': textMarginTop(size.value) + 'px',
      color: props.textFgColor,
      'font-size': textFontSize(size.value) + 'px',
      'text-align': 'center',
    }));

    /**
       * Container style computed property.
       * @type {ComputedRef<{"z-index": number, top: string, left: string, position: string}>}
       */
    const containerStyle = computed(() => ({
    }));

    /**
       * Container class computed property.
       * @type {ComputedRef<unknown>}
       */
    const containerClass = computed(() => {
      if (spin.value) {
        return [];
      }
      return ['invisible'];
    });

    /**
       * Spinner class computed property.
       * @type {ComputedRef<unknown>}
       */
    const spinnerClass = computed(() => {
      if (spin.value) {
        return ['animate-spin'];
      }
      return [];
    });

    /**
       * Spinner ref element watcher.
       * When spinner get mount and spinnerEl changes
       * this will call setContainerPosition.
       */
    watch(spinnerEl, (el) => {
      setContainerPosition(el);
    });

    /**
       * Spin props watcher.
       * Will make spinFor props selector opaque if available.
       * The class name set in spinForClass is applied to the element
       * selected using spinFor selector.
       */
    watch(spin, (spinning) => {
      if (spinning && props.spinFor) {
        spinnerEl.value.parentElement.querySelector(props.spinFor).classList.add(props.spinForClass);
      } else if (!spinning && props.spinFor) {
        spinnerEl.value.parentElement.querySelector(props.spinFor).classList.remove(props.spinForClass);
      }
    });

    return {
      spinnerStyle: spinnerStyle,
      containerStyle: containerStyle,
      containerClass: containerClass,
      spinnerClass: spinnerClass,
      textStyle: textStyle,
      spinMsg: message,
      spinnerEl: spinnerEl,
    };
  },
};
</script>

<style>
</style>
