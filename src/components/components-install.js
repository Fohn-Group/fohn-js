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
import flatPickr from "vue-flatpickr-component";

export default {
  install: (app, options) => {
    app.component('flat-pickr', flatPickr);
    app.component('fohn-vue', Base);
    app.component('fohn-form', Form);
    app.component('fohn-control', Control);
    app.component('fohn-spinner', Spinner);
    app.component('fohn-select', Select);
    app.component('fohn-radio', Radio);
    app.component('fohn-navigation', Navigation);
    app.component('fohn-navigation-group', NavigationGroup);
    app.component('fohn-table', Table);
    app.component('fohn-header-cell', HeaderCell);
    app.component('fohn-table-row', TableRow);
    app.component('fohn-table-cell', TableCell);
    app.component('fohn-ui-exception', ExceptionModal);
    app.component('fohn-table-paginator', TablePaginator);
    app.component('fohn-dummy', Dummy);
    app.component('fohn-modal', Modal);
  },
};
