import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";


export default [
  {
    languageOptions: {
      globals: {
        fohn: 'readable',
        $: 'readable',
        jQuery: 'readable',
        flatpickr: 'readable',
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      'vue/no-dupe-keys': ['off']
    },
  },
];
