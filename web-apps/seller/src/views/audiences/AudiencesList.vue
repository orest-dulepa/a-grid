<template>
  <div class="container audiences-list-container">
    <template v-if="stats">
      <section class="section">
        <div class="audiences-list-header">
          <h1 class="heading-2">
            Audiences
            <div class="selected-count">{{ statsCount }}</div>
          </h1>
          <search-input placeholder="Search by type, owner or name" :search="search" />
        </div>
        <transition name="scale">
          <div>
            <div class="box audiences-header">
              <div class="ag-columns audiences-header-row">
                <div class="ag-column ag-column__no-padding">
                  <sort-columns
                    @filter="saveFilters"
                    @sort="sortArray"
                    :model="stats"
                    :columns="columns"
                  />
                </div>
              </div>
            </div>
            <div class="audiences-list-table">
              <error-overlay
                v-if="!isLoadedSuccessfully"
                label="Couldn’t load the audiences"
                :with-background="false"
              />
              <transition-group name="scale-item" tag="div" v-if="isLoadedSuccessfully">
                <div
                  v-for="(stat, index) in statsPaginated"
                  class="box audiences-list"
                  :key="uniqueKeyByIndex(index, stat.audienceId)"
                >
                  <!--         TODO: This will be used in future, currently disabled           -->
                  <toggle-empty v-bind:is-active="false">
                    <template #header>
                      <div class="ag-columns audience-row">
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">{{ stat.type }}</span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">{{ stat.owner | capitalizeFirstLetter }}</span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">{{ stat.name }}</span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">{{ stat.uniques | formatNumber }}</span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">
                            {{ stat.pageViews | formatNumber }}
                          </span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <span class="stats-values">
                            $ {{ stat.revenue.value | formatNumber }}
                          </span>
                        </div>
                        <div class="ag-column ag-column__no-padding table-elem row-item">
                          <status-block
                            :item="stat"
                            :disabled="!isStatsActive"
                            @paused="setStatus(stat, 'paused')"
                            @ready="setStatus(stat, 'ready')"
                            @live="setStatus(stat, 'live')"
                          />
                        </div>
                      </div>
                    </template>

                    <!--         TODO: This will be used in future, currently disabled           -->
                    <template #content>
                      <div class="ag-columns audience-expanded-row">
                        <div class="ag-column">
                          <p>
                            Users who have read one of the following 10 keywords 3 times in the past
                            month
                          </p>
                          <tag-list :tags="stat.keywords" />
                        </div>
                      </div>
                    </template>
                  </toggle-empty>
                </div>
              </transition-group>
              <div
                v-else
                class="box audiences-list audiences-list--empty"
                v-for="index in 6"
                :key="index"
              ></div>
            </div>
          </div>
        </transition>
      </section>

      <transition name="scale">
        <section v-if="search.term" class="section search-info">
          <div class="search-reset">
            <p>We’ve found {{ statsAfterSearch.length }} audiences.</p>
            <a @click="resetSearch" rel="nofollow">Reset search</a>
          </div>
        </section>
      </transition>

      <section v-if="statsAfterSearch.length > perPage" class="section pagination-section">
        <base-pagination
          :currentPage="page"
          :perPage="perPage"
          :numEntries="statsAfterSearch.length"
          @on-page-change="setPage"
        ></base-pagination>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SearchInput from '@/components/ui/SearchInput.vue';
import BasePagination from '@/components/ui/BasePagination.vue';
import Plus from '@/components/ui/icons/Plus.vue';
import Minus from '@/components/ui/icons/Minus.vue';
import ToggleEmpty from '@/components/ui/ToggleEmpty.vue';
import TagList from '@/components/ui/TagList.vue';
import { MatchedAudiences, AudienceStatus } from '@/store/types';
import SortColumns from '@/components/ui/SortColumns.vue';
import BasePopover from '@/components/ui/BasePopover.vue';
import BaseButton, { BUTTON_THEMES, BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import router, { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import InfoIcon from '@/components/ui/icons/Info.svg?inline';
import ChevronRightIcon from '@/components/ui/icons/ChevronRight.svg?inline';
import StatusIcon from '@/components/ui/StatusIcon.vue';
import { currency, dashOnEmpty, formatNumber } from '@/utils/filters';
import ErrorOverlay from '@/components/ui/ErrorOverlay.vue';
import StatusBlock from '@/components/ui/StatusBlock.vue';
import { ActionTypes } from '@/store/actions';
import { copyDeep, viewNestedValue, deduplicateArray, capitalizeFirstLetter } from '../../utils';

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

@Component({
  components: {
    StatusBlock,
    BaseButton,
    BasePagination,
    BasePopover,
    ChevronRightIcon,
    ErrorOverlay,
    InfoIcon,
    Minus,
    Plus,
    SearchInput,
    SortColumns,
    StatusIcon,
    TagList,
    ToggleEmpty,
  },
  filters: {
    dashOnEmpty,
    formatNumber,
    capitalizeFirstLetter,
    currency,
  },
})
export default class AudiencesList extends Vue {
  @Prop({ type: Array, required: true }) stats!: MatchedAudiences[];
  @Prop({ type: Boolean, required: true }) isIntegrationCheckSuccessful!: boolean;
  @Prop({ type: Boolean, required: true }) isLoadedSuccessfully!: boolean;
  @Prop({ type: Boolean, default: false }) isStatsActive!: boolean;
  BUTTON_THEMES = BUTTON_THEMES;
  BUTTON_SIZES = BUTTON_SIZES;
  search = { term: '' };
  perPage = 15;
  page = 1;
  sortDirection = '';
  sortParams: string[] = [];
  columns: Column[] = [
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
    { label: 'Name', path: ['name'] },
    { label: 'Uniques users', path: ['uniques'], defaultSort: true },
    { label: 'Page views', path: ['pageViews'] },
    { label: 'Revenue', path: ['revenue', 'value'] },
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

  @Watch('stats', { immediate: true, deep: true })
  addDynamicFiltersToOwnersColumn(newData: MatchedAudiences[]): void {
    const owners = deduplicateArray(newData.map((v) => v.owner));
    const ownersFilters: Filter[] = owners.map((elem: string) => {
      return { value: elem, checked: false, name: elem, type: FilterType.OWNER };
    });
    this.columns[1].filters = ownersFilters;
  }

  get filtersBy(): Filter[] {
    return this.columns.reduce(
      (acc, column) => (column.filters ? [...acc, ...column.filters] : acc),
      [] as Filter[]
    );
  }

  filterStats(stats: MatchedAudiences[]): MatchedAudiences[] {
    const filterValues = this.filtersBy.reduce(
      (acc, v) => (v.checked ? { ...acc, [v.type]: [...acc[v.type], v.value] } : acc),
      {
        [FilterType.TYPE]: [],
        [FilterType.OWNER]: [],
        [FilterType.STATUS]: [],
      } as { [x: string]: string[] }
    );

    return stats.filter(
      (item) =>
        (!filterValues[FilterType.TYPE].length ||
          filterValues[FilterType.TYPE].includes(item.type)) &&
        (!filterValues[FilterType.OWNER].length ||
          filterValues[FilterType.OWNER].includes(item.owner)) &&
        (!filterValues[FilterType.STATUS].length ||
          filterValues[FilterType.STATUS].includes(item.status))
    );
  }

  uniqueKeyByIndex(index: number, id: string): string {
    return `${this.page}.${index}.${id}`;
  }

  filterSearch(stats: MatchedAudiences[]): MatchedAudiences[] {
    const searchTerm = this.search.term;
    if (searchTerm.length === 0) {
      return stats.filter((stat: MatchedAudiences) => {
        return stat.name && stat.owner && stat.type;
      });
    }

    const regExp = new RegExp(`${searchTerm}.*$`, 'i');
    return stats.filter((stat: MatchedAudiences) => {
      return (
        (stat.name && stat.name.search(regExp) !== -1) ||
        (stat.type && stat.type.search(regExp) !== -1) ||
        (stat.owner && stat.owner.search(regExp) !== -1)
      );
    });
  }

  setStatus(item: MatchedAudiences, status: AudienceStatus): void {
    this.$store.dispatch(ActionTypes.SET_AUDIENCE_STATUS, { id: item.id, status });
  }

  paginate(stats: MatchedAudiences[]): MatchedAudiences[] {
    let itemsOffset = (this.page - 1) * this.perPage;
    if (stats.length < itemsOffset) {
      this.page = 1;
      itemsOffset = 0;
    }
    return stats.slice(itemsOffset, this.page * this.perPage);
  }

  saveFilters(): void {
    this.setPage(1);
  }

  goToInstructions(): void {
    router.push({ path: ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path });
  }

  resetSearch(): void {
    this.search.term = '';
  }

  get statsAfterSearch(): MatchedAudiences[] {
    return this.filterSearch(this.stats);
  }

  get statsAfterFilter(): MatchedAudiences[] {
    return this.filterStats(this.statsAfterSearch);
  }

  get sortedItems(): MatchedAudiences[] {
    return copyDeep(this.statsAfterFilter).sort((a, b) => {
      const fst = viewNestedValue(0 as number, this.sortParams, a);
      const snd = viewNestedValue(0 as number, this.sortParams, b);
      const sortValue = fst > snd ? 1 : -1;
      return this.sortDirection === 'asc' ? sortValue : sortValue * -1;
    });
  }

  setPage(page: number): void {
    this.page = page;
  }

  sortArray(direction: string, params: string[]): void {
    this.sortDirection = direction;
    this.sortParams = params;
  }

  get statsPaginated(): MatchedAudiences[] {
    return this.paginate(this.sortedItems);
  }

  get statsCount(): number {
    return this.statsAfterFilter.length;
  }
}
</script>

<style lang="scss" scoped>
$header-grey: #fcfcfc;
$row-border: #ececec;
$row-vertical: #f6f6f6;
.audiences-list-container {
  min-height: 800px;
}

.section,
.audiences-list-table,
.search-reset {
  opacity: 1;
  transition: all 0.5s;
}

.audiences-list-table {
  position: relative;
}

.audiences-list {
  opacity: 1;
  transition: all 0.05s;
}

@mixin nth-delay($child, $delay: 0.01) {
  &:nth-child(#{$child}) {
    transition-delay: #{$child * $delay}s;
  }
}

.audiences-list:not(.scale-item-leave-active) {
  @for $i from 2 through 30 {
    @include nth-delay($i);
  }
}

.scale-item-leave-active {
  display: none;
}

.scale-enter {
  opacity: 0;
}

.scale-item-enter {
  opacity: 0;
}

.scale-item-enter-active {
  opacity: 0;
}

.scale-leave-to,
.scale-item-leave-to,
.scale-leave-active,
.scale-item-leave-active {
  display: none;
}

.section {
  &.pagination-section {
    background-color: #ffffff;
    padding: 0 20px;
    border-radius: 0 0 10px 10px;
  }

  &.search-info {
    margin-top: 64px;
  }

  .audiences-list-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .heading-2 {
      font-size: 32px;
      line-height: 34px;
      display: flex;
      align-items: center;

      .selected-count {
        width: 31px;
        height: 20px;
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
      }
    }
  }

  .audiences-header {
    margin-top: 32px;
    background-color: $header-grey;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.02);
    font-size: 14px;
    line-height: 14px;
    color: $dark-grey-1;

    .audiences-header-row {
      .ag-column.ag-column__no-padding {
        height: 100%;
      }

      border-bottom: 1px solid $row-border;
      height: 48px;
    }
  }

  .audiences-list {
    background-color: $white;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;

    &.audiences-list--empty {
      box-shadow: none;
      background-color: $empty-box-color;
      height: 48px;

      &:hover {
        box-shadow: none;
      }
    }

    .open {
      .audience-row {
        border-bottom: 1px solid $grey-8;

        .expand-icon {
          .plus-icon {
            opacity: 0;
          }

          .minus-icon {
            opacity: 1;
          }
        }
      }
    }

    .audience-row {
      display: grid;
      grid-template-columns: 13% 13% 25% 12% 12% 12% 13%;
      align-items: center;
      user-select: none;
      height: 48px;
      border-bottom: 1px solid $row-border;

      .row-item {
        height: 100%;
        display: flex;
        align-items: center;

        &:not(:last-child) {
          border-right: 1px solid $row-vertical;
        }
      }

      &.audience-row--paused,
      &.audience-row--deleted {
        color: $dark-grey-1;
      }

      .status-icon {
        height: 20px;
      }

      .expand-icon {
        position: relative;
        top: 2px;
        left: 12px;
        opacity: 0;

        .minus-icon,
        .plus-icon {
          position: absolute;
        }

        .minus-icon {
          opacity: 0;
        }
      }

      span {
        transition: color 0.2s linear;
      }

      &:hover {
        .expand-icon {
          transition: opacity 0.2s linear;
          opacity: 1;
        }

        .name {
          color: $electric-blue;
        }

        .stats-setup-popover {
          color: $black;
        }
      }

      &.audience-row--paused:hover,
      &.audience-row--deleted:hover {
        .name {
          color: rgba($dark-grey-1, 0.9);
        }
      }
    }

    .audience-expanded-row {
      p {
        font-size: 14px;
        line-height: 14px;
        color: $dark-grey-1;
      }
    }

    .stats-values {
      font-weight: normal;
      font-size: 14px;
      line-height: 14px;
    }

    .stats-empty {
      display: inline-block;
      background: $grey-4;
      border-radius: 20px;
      min-width: 53px;
      max-width: 68px;
      height: 14px;
    }

    .stats-setup-popover {
      color: $grey-5;
      display: inline-block;
      height: 15px;
      width: 15px;
      margin: 0 8px;
      transition: color 0.2s linear;

      .stats-setup-popover__content {
        margin: 0 12px;

        div {
          text-align: center;
          min-width: 162px;
          padding: 0 4px;
          font-weight: 500;
          font-size: 14px;
          line-height: 16px;
        }

        button {
          margin-top: 12px;

          svg {
            margin-left: 4px;
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }

  .search-reset {
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;

    p {
      margin: 0;
    }

    a {
      color: $dark-grey-1;
      transition: color 0.1s linear;
    }

    a:hover {
      cursor: pointer;
      color: $electric-blue;
    }
  }

  .ag-columns {
    .ag-column {
      height: 100%;
      padding: 8px 24px;
    }

    .ag-column__no-padding {
      padding: 0;

      &.table-elem {
        padding: 0 20px;
      }
    }
  }
}
</style>
