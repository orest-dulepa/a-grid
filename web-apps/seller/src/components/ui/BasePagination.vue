<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a
      class="pagination-previous"
      v-bind:class="{ disabled: isPreviousDisabled }"
      @click="toPage(previous)"
    >
      <chevron-left />
    </a>
    <a class="pagination-next" v-bind:class="{ disabled: isNextDisabled }" @click="toPage(next)">
      <chevron-right />
    </a>
    <ul class="pagination-list">
      <li v-for="page in pages" :key="page">
        <a class="pagination-link" :class="{ active: isActivePage(page) }" @click="toPage(page)">
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import ChevronLeft from '@/components/ui/icons/ChevronLeft.vue';
import ChevronRight from '@/components/ui/icons/ChevronRight.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    ChevronLeft,
    ChevronRight,
  },
})
export default class BasePagination extends Vue {
  @Prop({ default: 1 }) currentPage!: number;
  @Prop({ default: 15 }) perPage!: number;
  @Prop({ default: 0 }) numEntries!: number;

  get pages(): number[] {
    return Array.from(Array(this.lastPage), (_, i) => i + 1);
  }

  get lastPage(): number {
    if (this.numEntries < this.perPage) return 1;
    return Math.ceil(this.numEntries / this.perPage);
  }

  get previous(): number {
    return this.currentPage - 1;
  }

  get next(): number {
    return this.currentPage + 1;
  }

  get isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  get isNextDisabled(): boolean {
    return this.currentPage === this.lastPage;
  }

  isActivePage(page: number): boolean {
    return this.currentPage === page;
  }

  toPage(page: number): void {
    if (page < 1 || page > this.lastPage) return;
    this.$emit('on-page-change', page);
  }
}
</script>

<style lang="scss" scoped>
$pagin-button: #eff3fe;
$pagin-button-disabled: #e7ebef;
.pagination {
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
}

.pagination-previous,
.pagination-next {
  color: $electric-blue;
  height: 32px;
  width: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
  background: $pagin-button;
  border: 1px solid rgba(44, 94, 246, 0.3);
  box-sizing: border-box;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  font-size: 16px;
  justify-content: center;

  transition: background-color 0.1s linear;
  cursor: pointer;
  &.disabled {
    border: 1px solid $pagin-button-disabled;
    background: $grey-4;
    color: $dark-grey-1;
    opacity: 0.3;
    cursor: inherit;
  }
  &:not(.disabled):hover {
    background: $electric-blue;
    color: $white;
    opacity: 0.8;
  }
}

.pagination-previous {
  order: 1;
}

.pagination-next {
  order: 3;
}

.pagination-list {
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: center;
  order: 2;
  flex-wrap: wrap;
  list-style: none;
  padding-inline-start: 0;
  display: flex;

  .pagination-link {
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
    justify-content: center;
    padding: 0 14px 7px 14px;
    text-align: center;
    color: $dark-grey-1;
    transition: color 0.1s linear;

    display: inline-flex;
    align-items: center;
    width: 10px;

    &.active {
      color: $dark-grey-4;
      border-bottom: 2px solid $electric-blue;
    }

    &:not(.active):hover {
      color: $electric-blue;
      cursor: pointer;
    }
  }
}
</style>
