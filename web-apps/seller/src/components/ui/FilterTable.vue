<template>
  <div class="filter">
    <span @click.stop="$emit('open-dropdown', id)" class="filter-icon">
      <template v-if="!filterCounter">
        <transition name="fade" mode="out-in">
          <filter-icon v-if="id !== openedDropdown" class="filter-svg"></filter-icon>
          <filter-icon-active v-else class="filter-svg"></filter-icon-active>
        </transition>
      </template>
      <template v-else>
        <div class="selected-count">{{ filterCounter }}</div>
      </template>
    </span>
    <transition name="fade-down">
      <div class="filter-dropdown" v-if="id === openedDropdown">
        <div class="list-item" v-for="item in filters" :key="item.value">
          <div class="custom-checkbox" :class="{ 'checkbox-active': item.checked }"></div>
          <input
            @click.self="$emit('select-filter')"
            v-model="item.checked"
            :ref="item.value"
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FilterIcon from '@/components/ui/icons/FilterIcon.vue';
import FilterIconActive from '@/components/ui/icons/FilterIconActive.vue';
import { FilterItem } from '@/store/types';

@Component({
  components: {
    FilterIconActive,
    FilterIcon,
  },
})
export default class FilterTable extends Vue {
  @Prop({ type: Array, required: true }) filters!: FilterItem[];
  @Prop({ type: Boolean, default: false }) last: boolean | undefined;
  @Prop({ type: Number }) id!: number;
  @Prop({ type: Number }) openedDropdown!: number;

  get filterCounter(): number {
    return this.filters.reduce((acc: number, v: FilterItem) => {
      return acc + Number(v.checked);
    }, 0);
  }
}
</script>

<style lang="scss" scoped>
.fade-down-enter-active {
  transition: all 0.2s ease;
  transform-origin: top center;
}

.fade-down-enter {
  transform: scaleY(0.7);
}

.fade-down-enter-to {
  transform: scaleY(1);
}

.filter {
  position: relative;
  height: 16px;
  cursor: pointer;

  .selected-count {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $electric-blue;
    color: #ffffff;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }

  &-dropdown {
    cursor: default;
    position: absolute;
    z-index: 1;
    width: 158px;
    left: -99px;
    top: 33px;
    background: $white;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-radius: 0 0 10px 10px;
    padding: 20px;
    box-sizing: border-box;

    .list-item {
      position: relative;
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .input {
        opacity: 0;
        width: 20px;
        height: 20px;
        border: none;
        margin: 0;
        cursor: pointer;
      }

      .list-label {
        cursor: pointer;
      }

      .custom-checkbox {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid #c5c5cf;
        box-sizing: border-box;
        border-radius: 6px;

        &.checkbox-active {
          background-color: $electric-blue;
          background-image: url('../../components/ui/icons/check-filter.svg');
          background-size: 12px 12px;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }
}
</style>
