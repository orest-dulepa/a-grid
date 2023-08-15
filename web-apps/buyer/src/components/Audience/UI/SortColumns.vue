<template>
  <div class="grid-table-columns ag-columns">
    <div
      v-for="(column, index) in columns"
      :key="column.path + '-' + index"
      class="ag-column"
    >
      <sort-item
        :label="column.label"
        :sort="sort"
        :model="model"
        :path="column.path"
        :default-sort="column.defaultSort"
        @sort="sortArray"
      >
        <filter-table
          v-if="column.filters"
          @select-filter="selectFilter(column)"
          @open-dropdown="setOpenedDropdown"
          @close-dropdown="clickaway"
          :id="index"
          :openedDropdown="openedFilterDropdown"
          :last="index + 1 === columns.length"
          :filters="column.filters"
        />
      </sort-item>
      <div
        v-if="openedFilterDropdown !== null"
        class="clickaway"
        @click="clickaway"
      />
    </div>
  </div>
</template>

<script>
import SortItem from './SortItem.vue';
import FilterTable from './FilterTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SortColumn',
  props: {
    model: { type: Array, required: true },
    columns: { type: Array, required: true },
    filter: { type: Boolean, default: false },
  },
  components: {
    FilterTable,
    SortItem,
  },
  data() {
    return {
      sort: { sort: '', sortBy: '' },
      openedFilterDropdown: null,
    };
  },
  methods: {
    clickaway() {
      this.openedFilterDropdown = null;
    },
    setOpenedDropdown(id) {
      if (this.openedFilterDropdown === id) {
        this.openedFilterDropdown = null;
        return;
      }
      this.openedFilterDropdown = id;
    },
    sortArray(direction, parameters) {
      this.sort.sortBy = parameters;
      this.sort.sort = direction;
      this.$emit('sort', direction, parameters);
    },
    selectFilter(column) {
      this.$emit('filter', column.filters);
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';

$sort-border: $grey-1;
.ag-columns {
  font-size: 12px;
  align-items: center;
  height: 100%;
  font-weight: 500;
  line-height: 14px;
  .ag-column {
    position: relative;
    display: flex;
    padding: 0 20px;
    &:not(:last-child) {
      border-right: 1px solid $sort-border;
    }
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
