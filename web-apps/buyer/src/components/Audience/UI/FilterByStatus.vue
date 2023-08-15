<template>
  <div class="filter-wrap" :class="{ opened: openedList }">
    <div @click.stop="openedList = !openedList" class="filter">
      <div v-if="!filters.length" class="filter-icon"></div>
      <div v-else class="filter-icon__count">{{ filters.length }}</div>
      <div class="filter-text" :class="{ 'text-active': filters.length }">
        Filter by status
      </div>
      <div class="filter-arrow"></div>
    </div>
    <div v-click-outside="closeFilterList" class="filter-list">
      <div class="list-item">
        <div
          class="custom-checkbox"
          :class="{ 'checkbox-active': filters.includes('training') }"
        ></div>
        <input
          v-model="filters"
          class="input"
          type="checkbox"
          id="training"
          value="training"
        />
        <label for="training" class="list-label">Training</label>
      </div>
      <div class="list-item">
        <div
          class="custom-checkbox"
          :class="{ 'checkbox-active': filters.includes('ready') }"
        ></div>
        <input
          v-model="filters"
          class="input"
          type="checkbox"
          id="deploy"
          value="ready"
        />
        <label for="deploy" class="list-label">Available for deploy</label>
      </div>
      <div class="list-item">
        <div
          class="custom-checkbox"
          :class="{
            'checkbox-active': filters.includes('live'),
          }"
        ></div>
        <input
          v-model="filters"
          class="input"
          type="checkbox"
          id="live"
          value="live"
        />
        <label for="live" class="list-label">live</label>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterByStatus',
  data() {
    return {
      filters: [],
      openedList: false,
    };
  },
  methods: {
    closeFilterList() {
      this.openedList ? (this.openedList = false) : null;
    },
  },
  watch: {
    filters() {
      this.$emit('filter-change', this.filters);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/typography';
@import '@/styles/colors';
@import '@/styles/shadows';

.filter-wrap {
  position: absolute;
  top: -45px;
  right: 27px;
  cursor: pointer;
  &.opened {
    .filter-list {
      display: block;
    }

    .filter-arrow {
      transform: none;
    }

    .filter-text {
      color: $clr-typo-titles;
    }
    .filter-icon {
      background-image: url('/src/assets/filter-bars.svg');
    }
  }

  .filter-list {
    display: none;
    box-sizing: border-box;
    padding: 20px;
    position: absolute;
    z-index: 3;
    top: 33px;
    right: 0;
    width: 240px;
    height: 120px;
    background: $white;
    box-shadow: $shadow-3;
    border-radius: 10px;

    &.opened {
      display: block;
    }

    .list-item {
      margin-bottom: 10px;
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      .input {
        opacity: 0;
        width: 20px;
        height: 20px;
        border: none;
        margin: 0;
      }

      .custom-checkbox {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid $color-3;
        box-sizing: border-box;
        border-radius: 6px;
        &.checkbox-active {
          background-color: $clr-primary-blue;
          background-image: url('/src/assets/checked.svg');
          background-size: 12px 12px;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }

    .list-label {
      font-size: $h3-reg_font-size;
      line-height: 14px;
      font-weight: 500;
      margin-left: 11px;
      cursor: pointer;
    }
  }
}

.filter {
  display: flex;
  align-items: center;
  transition: 0.2s;

  &-text {
    color: $grey-7;
    font-size: $h3-reg_font-size;
    font-weight: 500;
    &.text-active {
      color: $clr-typo-titles;
    }
  }

  &-icon {
    width: 16px;
    height: 16px;
    background-image: url('/src/assets/bars-grey.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-right: 12px;

    &__count {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: $clr-primary-blue;
      color: $white;
      font-size: 11px;
      line-height: 18px;
      margin-right: 12px;
      text-align: center;
    }
  }

  &-arrow {
    width: 14px;
    height: 14px;
    background-image: url('/src/assets/filter-arrow.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-left: 8px;
    transform: rotate(180deg);
    transition: 0.2ms;
  }
}
</style>
