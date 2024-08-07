import global from './global';
import ripple from './ripple';
import tooltip from './tooltip';
import tree from './tree';
import badgedirective from './badgedirective';

export default {
  global,
  directives: {
    badge: badgedirective,
    ripple,
    tooltip,
  },

  tree,
  toolbar,
  menubar,
};
