<template>
  <div class="filter">
    <div @click.stop="$emit('open-dropdown', id)" class="filter-icon">
      <template v-if="!filterCounter">
        <transition name="fade" mode="out-in">
          <filter-icon
            v-if="id !== openedDropdown"
            class="filter-svg"
          ></filter-icon>
          <filter-icon-active v-else class="filter-svg"></filter-icon-active>
        </transition>
      </template>
      <template v-else>
        <div class="selected-count">{{ filterCounter }}</div>
      </template>
    </div>
    <transition name="fade-down">
      <div
        v-if="id === openedDropdown"
        v-click-outside="close"
        class="filter-dropdown"
      >
        <div
          v-for="(item, idx) in filters"
          @click.self="selectFilter(idx)"
          class="list-item"
          :key="'filter-dropdown-' + id + item.value"
        >
          <div
            class="custom-checkbox"
            :class="{ 'checkbox-active': item.checked }"
          />
          <input
            v-model="item.checked"
            :ref="'filterInput' + idx"
            class="input"
            type="checkbox"
            :value="item.value"
            :id="item.value"
          />
          <label :for="item.value" class="list-label">{{ item.name }}</label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FilterIcon from './icons/FilterIcon.vue';
import FilterIconActive from './icons/FilterIconActive.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterTable',
  props: {
    filters: {
      type: Array,
      required: true,
    },
    last: { type: Boolean, default: false },
    id: { type: Number },
    openedDropdown: { type: Number },
  },
  components: {
    FilterIconActive,
    FilterIcon,
  },
  data() {
    return {
      openSubmenu: false,
    };
  },
  computed: {
    filterCounter() {
      return this.filters.reduce((acc, v) => {
        return acc + Number(v.checked);
      }, 0);
    },
  },
  methods: {
    selectFilter(idx) {
      this.$refs['filterInput' + idx].click();
      this.$emit('select-filter');
    },
    close() {
      this.$emit('close-dropdown');
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';
@import 'src/styles/shadows.scss';

.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.2s ease;
  transform-origin: top center;
}

.fade-down-enter-from {
  transform: scaleY(0.9) scaleX(0.9);
  opacity: 0.5;
}

.fade-down-leave-to,
.fade-down-enter {
  transform: scaleY(0.9) scaleX(0.9);
  opacity: 0;
}

.filter {
  height: 16px;
  cursor: pointer;

  .selected-count {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $clr-primary-blue;
    color: $white;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }

  &-dropdown {
    cursor: default;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 48px;
    width: 100%;
    background: $white;
    box-shadow: $shadow-3;
    border-radius: 0 0 10px 10px;
    padding: 20px;
    box-sizing: border-box;

    .list-item {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .list-label {
        cursor: pointer;
      }

      .input {
        opacity: 0;
        width: 20px;
        height: 20px;
        border: none;
        margin-right: 7px;
        cursor: pointer;
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
          background-image: url('./icons/check-filter.svg');
          background-size: 12px 12px;
          background-repeat: no-repeat;
          background-position: center;
          border: solid 1px transparent;
        }
      }
    }
  }

  &-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
