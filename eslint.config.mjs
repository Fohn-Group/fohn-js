import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';

export default [
  stylistic.configs.customize({
    indent: 2,
    semi: true,
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        fohn: 'readable',
        $: 'readable',
        jQuery: 'readable',
        flatpickr: 'readable',
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      'vue/no-dupe-keys': ['off'],
    },
  },
];
