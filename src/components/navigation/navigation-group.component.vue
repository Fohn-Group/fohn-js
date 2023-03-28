<template>
  <div v-bind="$attrs">
    <slot
        :items="items"
        :isActive="isActive"
        :isOpen="isOpen"
        :stateIcon="stateIcon"
        :groupUrl="groupUrl"
        :groupName="groupName"
        :groupIcon="groupIcon"
        :hasItems="hasItems"
        :fn="method">
      navigation group
    </slot>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { utils } from '../../utils';

export default {
  name: 'fohn-navigation-group',
  props: {
    group: {
      type: Object,
    },
    icons: {
      type: Object,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { items, url:groupUrl, name: groupName, icon: groupIcon } = props.group;
    const { close: closeIcon, open: openIcon } = props.icons;

    const method = {};

    const isActive = ref(utils().url().matchLocation(groupUrl));
    // if any item url match location then group isActive.
    items.forEach((item) => {
      isActive.value = isActive.value || utils().url().matchLocation(item.url);
    });

    const isOpen = ref(isActive.value);

    // display proper group icon according to state.
    const stateIcon = computed(() => (isOpen.value ? openIcon : closeIcon));
    // toggle group display.
    method.toggleGroup = () => {
      isOpen.value = !isOpen.value;
    };

    const hasItems = computed( () => items.length > 0);

    method.isActiveUrl = (url) => utils().url().matchLocation(url);

    return {
      groupUrl,
      groupName,
      groupIcon,
      items,
      isActive,
      isOpen,
      stateIcon,
      hasItems,
      method,
    };
  },
};
</script>

<style scoped>
</style>
