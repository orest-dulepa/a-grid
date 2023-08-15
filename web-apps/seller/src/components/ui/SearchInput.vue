<template>
  <form
    class="search"
    :class="{ 'search-active': !isPlaceholderShown }"
    @submit.prevent="$emit('submit')"
  >
    <magnifying-glass class="search-icon" />
    <span v-if="isPlaceholderShown" class="search-placeholder" @click="showInput">
      {{ placeholder }}
    </span>
    <input
      v-if="!isPlaceholderShown"
      ref="searchInput"
      class="search-input"
      type="text"
      v-model="search.term"
      :placeholder="placeholder"
      @change="$emit('change')"
      @blur="showPlaceholder"
    />

    <search-enter class="search-enter__icon" />
    <a class="clear-input" @click="clearSearch">
      <xmark />
    </a>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import MagnifyingGlass from '@/components/ui/icons/MagnifyingGlass.vue';
import Xmark from '@/components/ui/icons/Xmark.vue';
import SearchEnter from '@/components/ui/icons/SearchEnter.vue';

@Component({
  components: {
    SearchEnter,
    MagnifyingGlass,
    Xmark,
  },
})
export default class SearchInput extends Vue {
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: Object, required: true }) search!: { term: string };
  @Ref('searchInput') readonly searchInput!: HTMLInputElement;

  isPlaceholderShown = true;

  clearSearch(): void {
    this.search.term = '';
    this.showPlaceholder();
  }

  showInput(): void {
    this.isPlaceholderShown = false;

    this.$nextTick(() => {
      (this.$refs.searchInput as HTMLInputElement).focus();
    });
  }

  showPlaceholder(): void {
    if (this.search.term.length !== 0) return;
    this.isPlaceholderShown = true;
  }
}
</script>

<style lang="scss" scoped>
$placeholder: #9b9b9b;
$background-search: #eaeaed;
.search {
  display: flex;
  flex-direction: row;
  font-size: 24px;
  color: $dark-grey-4;
  border-radius: 6px;
  padding: 14px 20px;
  align-items: center;
  transition: 0.3s linear;
  background-color: $background-search;
  width: 416px;
  height: 20px;
}

.search-icon {
  order: 1;
  color: $dark-grey-1;
}

.search-placeholder {
  width: 100%;
  transition: all 0.2s;
  order: 2;
}

.search-input {
  transition: all 0.2s;
  order: 2;
}

.fade-enter {
  opacity: 0;
  transform: translate(20px, 0);
}

.fade-left-enter {
  opacity: 0;
  transform: translate(-20px, 0);
}

.fade-left-leave-to,
.fade-left-leave-active,
.fade-leave-to,
.fade-leave-active {
  display: none;
}

.clear-input {
  order: 4;
}

.search-enter__icon {
  path {
    fill: $dark-grey-1;
  }

  order: 3;
}

.search .search-input:valid {
  opacity: 1;
}

.search .search-placeholder ~ .clear-input svg {
  display: none;
}

.search-active .search-enter__icon {
  display: none;
}

.search .clear-input svg {
  width: 14px;
  height: 14px;
  fill: $dark-grey-1;
  opacity: 0;
  transition: opacity 0.3s linear;
}

.search .search-input:focus ~ .clear-input svg,
.search .search-input:hover ~ .clear-input svg,
.search-active .clear-input svg {
  color: $dark-grey-1;
  opacity: 0.5;
  display: block;
}

.search .search-input:focus ~ .clear-input:hover svg,
.search .clear-input:hover svg {
  cursor: pointer;
  opacity: 1;
}

.search-input {
  width: 100%;
}

.search-input,
.search-placeholder,
.search-input:hover,
.search-placeholder:hover,
.search-input:active,
.search-input:focus,
.search-input::placeholder {
  font-size: 14px;
  line-height: 14px;
  color: $placeholder;
}

.search-input,
.search-placeholder,
.search-input:hover,
.search-input:active,
.search-input:focus {
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  margin: 0 0 0 16px;
}
</style>
