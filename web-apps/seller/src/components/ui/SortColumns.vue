<template>
  <div class="ag-columns" ref="agColumns">
    <div v-for="(column, index) in columns" :key="index" class="ag-column">
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
          @select-filter="$emit('filter', column.filters)"
          @open-dropdown="setOpenedDropdown"
          :id="index"
          :openedDropdown="openedFilterDropdown"
          :last="index + 1 === columns.length"
          :filters="column.filters"
        />
      </sort-item>
      <div v-if="openedFilterDropdown !== null" class="clickaway" @click="clickaway" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SortItem from '@/components/ui/SortItem.vue';
import { SortItem as SortItemType } from '@/store/types';
import FilterTable from '@/components/ui/FilterTable.vue';

type SortColumnItem = {
  label: string;
  param: string;
  defaultSort?: string;
  filters: [];
};

@Component({
  components: {
    FilterTable,
    SortItem,
  },
})
export default class SortColumns extends Vue {
  @Prop({ type: Array, required: true }) model!: SortItemType[];
  @Prop({ type: Array, required: true }) columns!: SortColumnItem[];
  @Prop({ type: Boolean, default: false }) filter: boolean | undefined;
  $refs!: {
    agColumns: HTMLElement;
  };

  openedFilterDropdown: null | number = null;
  sort = { sort: '', sortBy: [''] };

  setOpenedDropdown(id: number | null): void {
    if (this.openedFilterDropdown === id) {
      this.openedFilterDropdown = null;
      return;
    }
    this.openedFilterDropdown = id;
  }

  clickaway(): void {
    this.openedFilterDropdown = null;
  }

  sortArray(direction: 'asc' | 'desc', path: string[]): void {
    this.sort.sortBy = path;
    this.sort.sort = direction;
    this.$emit('sort', direction, path);
  }
}
</script>

<style lang="scss" scoped>
$sort-border: #f6f6f6;
.ag-columns {
  z-index: 1;
  display: grid;
  grid-template-columns: 13% 13% 25% 12% 12% 12% 13%;
  align-items: center;
  height: 100%;

  .ag-column {
    display: flex;
    padding: 0 20px;

    &:not(:last-child) {
      border-right: 1px solid $sort-border;
    }

    height: 100%;
    box-sizing: border-box;
  }
}

.clickaway {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 0;
}
</style>
