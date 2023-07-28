import flatPickr from "vue-flatpickr-component";
import Base from './base.component.vue';
import Form from './form/form.component.vue';
import Control from './form/control.component.vue';
import Spinner from './utils/spinner.component.vue';
import Select from './form/select.component.vue';
import Radio from './form/radio.component.vue';
import Navigation from './navigation/navigation.component.vue';
import NavigationGroup from './navigation/navigation-group.component.vue';
import Table from './table/table.component.vue';
import HeaderCell from './table/header.cell.component.vue';
import TableRow from './table/row.component.vue';
import TableCell from './table/cell.component.vue';
import ExceptionModal from './modal/exception-modal.component.vue';
import TablePaginator from './table/paginator.component.vue';
import Dummy from './dummy.component.vue';
import Modal from './modal/modal.component.vue';
import Tabs from './tabs/tabs.component.vue';
import Tab from './tabs/tab.component.vue';

const fohnComponents = [
  {name: 'flat-pickr', def:  flatPickr},
  {name: 'fohn-vue', def:  Base},
  {name: 'fohn-spinner', def:  Spinner},
  {name: 'fohn-form', def:  Form},
  {name: 'fohn-control', def:  Control},
  {name: 'fohn-select', def:  Select},
  {name: 'fohn-radio', def:  Radio},
  {name: 'fohn-navigation', def:  Navigation},
  {name: 'fohn-navigation-group', def:  NavigationGroup},
  {name: 'fohn-table', def:  Table},
  {name: 'fohn-header-cell', def:  HeaderCell},
  {name: 'fohn-table-row', def:  TableRow},
  {name: 'fohn-table-cell', def:  TableCell},
  {name: 'fohn-table-paginator', def:  TablePaginator},
  {name: 'fohn-modal', def:  Modal},
  {name: 'fohn-ui-exception', def:  ExceptionModal},
  {name: 'fohn-tab', def:  Tab},
  {name: 'fohn-tabs', def:  Tabs},
  {name: 'fohn-dummy', def:  Dummy},
]

export default {
  install: (app, options) => {
    fohnComponents.forEach((fohnComponent) => {
      app.component(fohnComponent.name, fohnComponent.def);
    })
  },
};
