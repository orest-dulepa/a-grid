<template>
  <form
    class="search"
    :class="{ 'search-active': !isPlaceholderShown }"
    @submit.prevent="$emit('submit')"
  >
    <magnifying-glass class="search-icon" />
    <transition name="fade-left">
      <span
        v-if="isPlaceholderShown"
        class="search-placeholder"
        @click="showInput"
      >
        {{ placeholder }}
      </span>
    </transition>
    <transition name="fade">
      <input
        v-if="!isPlaceholderShown"
        ref="searchInput"
        class="search-input"
        type="text"
        v-model.trim="search"
        :placeholder="placeholder"
        @input="$emit('search', search)"
        @blur="showPlaceholder"
      />
    </transition>
    <search-enter class="search-enter__icon" />
    <a class="clear-input" @click="clearSearch">
      <xmark />
    </a>
  </form>
</template>

<script>
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import Xmark from './icons/Xmark.vue';
import SearchEnter from './icons/SearchEnter.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  props: {
    placeholder: { type: String },
  },
  components: {
    SearchEnter,
    MagnifyingGlass,
    Xmark,
  },
  data() {
    return {
      isPlaceholderShown: true,
      search: '',
    };
  },
  methods: {
    clearSearch() {
      this.search = '';
      this.$emit('search', this.search);
      this.showPlaceholder();
    },
    showPlaceholder() {
      if (this.search.length !== 0) return;
      this.isPlaceholderShown = true;
    },
    showInput() {
      this.isPlaceholderShown = false;

      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';

$background-search: $color-6;
.search {
  display: flex;
  flex-direction: row;
  font-size: 24px;
  border-radius: 6px;
  padding: 0 20px;
  height: 48px;
  align-items: center;
  transition: 0.3s linear;
  background-color: $background-search;
  width: 416px;
  z-index: 1;
}

.search-icon {
  order: 1;
  color: $dark-grey-1;
  padding: 14px 0 16px 0;
}

.search-placeholder {
  cursor: text;
  width: 100%;
  line-height: 14px;
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
  width: 16px;
  padding-right: 2px;
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
  width: 10px;
  height: 10px;
  opacity: 0;
  transition: opacity 0.3s linear;
  padding-right: 4px;
}

.search .search-input:focus ~ .clear-input svg,
.search .search-input:hover ~ .clear-input svg,
.search-active .clear-input svg {
  color: $dark-grey-1;
  opacity: 1;
  display: block;
}

.search .search-input:focus ~ .clear-input:hover svg,
.search .clear-input:hover svg {
  cursor: pointer;
  opacity: 1;
}

.search-input {
  width: 100%;
  padding: 0;
}

.search-placeholder,
.search-input::placeholder {
  font-size: 14px;
  color: $grey-6;
}
.search-input:active,
.search-input:focus {
  color: $clr-typo-titles;
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
  margin: 0 0 0 12px;
}
</style>
