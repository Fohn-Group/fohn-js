/**
 * Fohn-ui use some of PrimeVue component.
 *
 * Copyright (c) 2018-2024 PrimeTek
 * https://github.com/primefaces/primevue
 *
 */

import BaseTree from 'primevue/tree';
import Tree from 'primevue/tree';
import TreeNode from 'primevue/tree';

const primeComponents = [
  { name: 'BaseTree', def: BaseTree },
  { name: 'Tree', def: Tree },
  { name: 'TreeNode', def: TreeNode },
];

export default {
  install: (app, options) => {
    primeComponents.forEach((primeComponent) => {
      app.component(primeComponent.name, primeComponent.def);
    });
  },
};
