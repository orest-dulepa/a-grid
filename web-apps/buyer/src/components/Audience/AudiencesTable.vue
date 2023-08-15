<template>
  <base-spinner v-if="showSpinner" class="search-models-chart__spinner" />
  <div v-else class="table-wrap">
    <div class="audience-head">
      <h2 class="audience-title">
        Audiences
        <div class="selected-count">{{ countOfAudiences }}</div>
      </h2>
      <search-input
        ref="search"
        placeholder="Search by type, owner or name"
        @search="setSearchString"
      />
    </div>
    <div class="table-content">
      <div class="table-content__item">
        <div class="table-audience">
          <div class="table-head custom-head">
            <sort-columns
              @filter="setFilters"
              @sort="sortArray"
              :model="tableData"
              :columns="columns"
            />
          </div>
          <div>
            <div
              class="grid-table-columns table-row"
              v-for="item in sortedAudiences"
              v-bind:key="item"
            >
              <div class="row-item">
                <p>{{ item.type }}</p>
              </div>
              <div class="row-item">
                <p>{{ item.owner }}</p>
              </div>
              <div class="row-item name">
                <router-link :to="`/audiences/${item.id}`">
                  <arrow-right class="arrow" />
                  <tooltip :primary-text="item.name" for-table>
                    <p class="status-button">{{ item.name }}</p>
                  </tooltip>
                </router-link>
              </div>
              <div class="row-item">
                <hide-table-row-value
                  :isHidden="isAudienceStatusPaused(item.id)"
                >
                  {{ item?.stats?.uniqueUsers }}
                </hide-table-row-value>
              </div>
              <div class="row-item">
                <hide-table-row-value
                  :isHidden="isAudienceStatusPaused(item.id)"
                >
                  {{ item?.stats?.pageViews }}
                </hide-table-row-value>
              </div>
              <div class="row-item">
                <hide-table-row-value
                  :isHidden="isAudienceStatusPaused(item.id)"
                >
                  {{ item?.stats?.spend }}
                </hide-table-row-value>
              </div>
              <div class="row-item">
                <status-block :id="item.id"></status-block>
              </div>
            </div>
          </div>
          <pagination-block
            v-if="filteredItems.length > itemsOnPage"
            :itemsPages="pagesCounter"
            :choised-page.sync="currentPage"
            @page-change="savePage"
          />
        </div>
      </div>
    </div>
    <div
      v-if="filteredItems.length < itemsOnPage && searchString.length"
      class="table-search__info"
    >
      <div class="table-search__text">
        We’ve found {{ filteredItems.length }} audiences.
      </div>
      <button @click="resetSearch" class="table-search__link">
        Reset search
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed, ComputedRef, watch } from 'vue';
import PaginationBlock from './UI/PaginationBlock.vue';
import SearchInput from './UI/SearchInput.vue';
import SortColumns from './UI/SortColumns.vue';
import StatusBlock from './UI/StatusBlock.vue';
import { GetterTypes } from '@/store/getters';
import { NAMESPACE as ANALYTICS_NAMESPACE } from '@/store/modules/analytics';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import {
  AudienceType,
  AppAudienceDefinition,
  AudiencesTableRow,
} from '@/store/types';
import { viewNestedValue, deduplicateArray } from '../../utils';
import BaseSpinner from './UI/BaseSpinner.vue';
import {
  capitalizeFirstLetter,
  getFormattedNumber,
  formatCurrency,
} from '@/utils/filters';
import { useStore } from 'vuex';
import ArrowRight from '@/components/UI/Icons/ArrowRight.vue';
import Tooltip from '@/components/UI/Tooltip.vue';
import HideTableRowValue from './UI/HideTableRowValue.vue';
import { AudienceStatus } from '@/store/types';

export enum FilterType {
  OWNER = 'owner',
  TYPE = 'type',
  STATUS = 'status',
}

export type Filter = {
  value: string;
  checked: boolean;
  name: string;
  type: FilterType;
};

type Column = {
  label: string;
  path: string[];
  filters?: Filter[];
  defaultSort?: boolean;
};

const defaultColumns: Column[] = [
  {
    label: 'Type',
    path: ['type'],
    filters: [
      { value: 'IAB', checked: false, name: 'IAB', type: FilterType.TYPE },
      { value: 'BUYER', checked: false, name: 'Buyer', type: FilterType.TYPE },
    ],
  },
  {
    label: 'Owner',
    path: ['owner'],
    filters: [],
  },
  { label: 'Name', path: ['name'], defaultSort: true },
  {
    label: 'Uniques users',
    path: ['stats', 'uniqueUsers'],
  },
  {
    label: 'Page views',
    path: ['stats', 'pageViews'],
  },
  { label: 'Spend', path: ['spend', 'value'] },
  {
    label: 'Status',
    path: ['status'],
    filters: [
      {
        type: FilterType.STATUS,
        value: 'ready',
        checked: false,
        name: 'Ready',
      },
      {
        type: FilterType.STATUS,
        value: 'live',
        checked: false,
        name: 'Live',
      },
      {
        type: FilterType.STATUS,
        value: 'training',
        checked: false,
        name: 'Training',
      },
      {
        type: FilterType.STATUS,
        value: 'paused',
        checked: false,
        name: 'Paused',
      },
    ],
  },
];

export default defineComponent({
  name: 'AudiencesTable',
  components: {
    Tooltip,
    ArrowRight,
    StatusBlock,
    SortColumns,
    SearchInput,
    PaginationBlock,
    BaseSpinner,
    HideTableRowValue,
  },
  setup() {
    const store = useStore();

    const search: Ref<(HTMLElement & { clearSearch: () => void }) | null> = ref(
      null
    );
    const columns: Ref<Column[]> = ref(defaultColumns);
    const itemsOnPage: Ref<number> = ref(20);
    const currentPage: Ref<number> = ref(1);
    const filters: Ref<{ [x: string]: string[] }> = ref({});
    const sortDirection = ref('');
    const sortParams: Ref<string[]> = ref([]);
    const searchString: Ref<string> = ref('');
    const sortedAudiences: Ref<AudiencesTableRow[]> = ref([]);

    const tableData: ComputedRef<AudiencesTableRow[]> = computed(
      () =>
        store.getters[
          `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_AUDIENCES_TABLE_RAW_DATA}`
        ]
    );

    const showSpinner = computed(
      () =>
        !store.getters[
          `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_IS_AUDIENCES_LOADED}`
        ] ||
        !store.getters[
          `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_IS_ANALYTICS_LOADED}`
        ]
    );

    const countOfAudiences = computed(() => sortedAudiences.value.length);

    const pagesCounter = computed(() => {
      let counter = sortedAudiences.value.length / itemsOnPage.value;
      return counter % 1 == 1 ? counter : Math.ceil(counter);
    });

    const filteredItems: ComputedRef<AudiencesTableRow[]> = computed(() => {
      const _filters = columns.value
        .reduce(
          (acc, column) => (column.filters ? [...acc, ...column.filters] : acc),
          [] as Filter[]
        )
        .reduce(
          (acc, v) =>
            v.checked ? { ...acc, [v.type]: [...acc[v.type], v.value] } : acc,
          {
            [FilterType.TYPE]: [],
            [FilterType.OWNER]: [],
            [FilterType.STATUS]: [],
          } as { [x: string]: string[] }
        );

      return tableData.value
        .filter(
          (item) =>
            (item.name
              .toLowerCase()
              .includes(searchString.value.toLowerCase()) ||
              item.owner
                .toLowerCase()
                .includes(searchString.value.toLowerCase()) ||
              item.type
                .toLowerCase()
                .includes(searchString.value.toLowerCase())) &&
            (!_filters[FilterType.TYPE].length ||
              _filters[FilterType.TYPE].includes(item.type)) &&
            (!_filters[FilterType.OWNER].length ||
              _filters[FilterType.OWNER].includes(item.owner)) &&
            (!_filters[FilterType.STATUS].length ||
              _filters[FilterType.STATUS].includes(item.status))
        )
        .map((item: AudiencesTableRow) => ({
          ...item,
          owner: capitalizeFirstLetter(item.owner),
          type: capitalizeFirstLetter(
            item.type === AudienceType.BUYER
              ? item.type.toLowerCase()
              : item.type
          ),
          name: capitalizeFirstLetter(item.name),
          stats: {
            uniqueUsers: getFormattedNumber(item.uniqueUsers),
            pageViews: getFormattedNumber(item.pageViews),
            spend: formatCurrency(item.spend),
          },
        }));
    });

    const getSortedAudiences = (
      audiences: AudiencesTableRow[]
    ): AudiencesTableRow[] => {
      const _filteredItems = audiences;
      _filteredItems.sort((a, b) => {
        const fst = viewNestedValue(0, sortParams.value, a as any);
        const snd = viewNestedValue(0, sortParams.value, b as any);
        const sortValue = fst > snd ? 1 : -1;
        return sortDirection.value === 'asc' ? sortValue : sortValue * -1;
      });
      return _filteredItems;
    };

    const setPageItems = (): void => {
      const firstItem = (currentPage.value - 1) * itemsOnPage.value;
      const lastItem = currentPage.value * itemsOnPage.value;
      sortedAudiences.value = getSortedAudiences(filteredItems.value).slice(
        firstItem,
        lastItem
      );
    };

    const getFormattedNumberStat = (stat: number): string => {
      if (stat > 1e6) return `${stat / 1e6}M`;
      else if (stat > 1e4) return `${stat / 1e4}K`;
      else return `${stat}`;
    };

    const resetSearch = (): void => {
      searchString.value = '';
      search.value?.clearSearch();
      setPageItems();
    };

    const savePage = (page: number) => {
      currentPage.value = page;
    };

    const setFilters = () => {
      currentPage.value = 1;
      setPageItems();
    };

    const setSearchString = (value: string) => {
      searchString.value = value;
      setPageItems();
    };

    const sortArray = (
      direction: string,
      params: (keyof AppAudienceDefinition)[]
    ) => {
      sortDirection.value = direction;
      sortParams.value = params;
      setPageItems();
    };

    const isAudienceStatusPaused = (id: string): boolean => {
      return (
        store.getters[
          `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_STATUS}`
        ](id) === AudienceStatus.PAUSED
      );
    };

    // add dynamic column filters to column filter array
    watch(tableData, (newData: AudiencesTableRow[]) => {
      deduplicateArray(newData.map((v) => v.owner)).forEach((elem) => {
        columns.value[1].filters?.push({
          value: elem,
          checked: false,
          name: elem,
          type: FilterType.OWNER,
        });
      });
    });

    watch(
      columns,
      (_, prevValue) => {
        prevValue && setPageItems();
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      getFormattedNumberStat,
      filteredItems,
      resetSearch,
      savePage,
      setFilters,
      setSearchString,
      sortArray,
      search,
      tableData,
      showSpinner,
      columns,
      itemsOnPage,
      currentPage,
      filters,
      sortDirection,
      sortParams,
      searchString,
      sortedAudiences,
      countOfAudiences,
      pagesCounter,
      isAudienceStatusPaused,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/typography';

.audience-title {
  color: $clr-typo-titles;
  font-size: $h2-small_font-size;
  line-height: $h2-small_line-height;
  margin-bottom: 40px;
  display: flex;
  align-items: center;

  .selected-count {
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #dcdce2;
    color: #8c8c8c;
    font-weight: 500;
    font-size: 11px;
    line-height: 14px;
    margin-left: 12px;
    padding: 3px 7px;
  }
}

.audience-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-search__link {
  z-index: 10;
  cursor: pointer;
}

.arrow {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  margin-right: 12px;
  background-color: $color-6;
  border-radius: 4px;
  padding: 4px;
  color: $dark-grey-1;
}

.table-row {
  cursor: pointer;

  &:hover {
    background-color: $grey-11;

    .row-item:nth-child(1) {
      border-left: 2px solid $electric-blue;
    }

    .row-item.name p {
      color: $electric-blue;
    }

    .arrow {
      background-color: $light-blue;
      color: $electric-blue;
    }
  }
}

.row-item {
  border-left: 2px solid transparent;

  a {
    display: flex;
    align-items: center;
    color: black;
    text-decoration: none;
  }
}
</style>
