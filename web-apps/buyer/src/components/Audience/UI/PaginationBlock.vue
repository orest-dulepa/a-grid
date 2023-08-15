<template>
  <div class="pagination">
    <button
      class="pagination-button prev"
      :class="{ 'button-active': currentPage > 1 }"
      @click="currentPage > 1 ? currentPage-- : null"
    >
      &#10094;
    </button>
    <div class="pagination-pages">
      <div
        v-for="page in itemsPages"
        v-bind:key="page"
        class="pagination-page"
        :class="{ 'page-active': page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </div>
    </div>
    <button
      class="pagination-button next"
      :class="{ 'button-active': currentPage < itemsPages }"
      @click="currentPage < itemsPages ? currentPage++ : null"
    >
      &#10095;
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PaginationBlock',
  props: {
    itemsPages: Number,
    choisedPage: Number,
  },
  data() {
    return {
      currentPage: this.choisedPage,
    };
  },
  mounted() {
    this.currentPage = 1;
  },
  watch: {
    currentPage() {
      this.$emit('page-change', this.currentPage);
    },
    choisedPage() {
      this.currentPage = this.choisedPage;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/colors';
@import '../../../styles/shadows';

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: solid 1px $color-4;

  &-button {
    width: 32px;
    height: 32px;
    font-size: 12px;
    line-height: 14px;
    outline: none;
    color: $color-3;
    background: $clr-app-background;
    border: 1px solid $color-4;
    box-sizing: border-box;
    border-radius: 6px;

    &.button-active {
      cursor: pointer;
      background: $white;
      box-shadow: $shadow-0;
      color: $clr-primary-blue;
      background: $color-5;
      border: 1px solid rgba(44, 94, 246, 0.3);
    }
  }

  &-pages {
    display: flex;

    .pagination-page {
      text-align: center;
      width: 32px;
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      color: $grey-7;
      cursor: pointer;

      &.page-active {
        border-bottom: 2px solid $clr-primary-blue;
        color: $clr-typo-titles;
      }
    }
  }
}
</style>
