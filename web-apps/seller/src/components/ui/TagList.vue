<template>
  <div class="ag-tags">
    <transition-group name="fade-item" tag="">
      <tag-item
        v-for="(tag, tag_index) in tagsForShow"
        :key="tag_index"
        :outlined="tag.outlined"
        @click.native="tag.onClick()"
      >
        <slot :tag="tag">
          {{ tag.label }}
        </slot>
      </tag-item>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TagItem from '@/components/ui/TagItem.vue';
import { PageKeywordRow } from '@/store/types';

interface Tag {
  label: string;
  outlined?: boolean;
  onClick?: CallableFunction;
}

@Component({
  components: {
    TagItem,
  },
})
export default class TagList extends Vue {
  @Prop({ type: Array, required: true }) tags!: PageKeywordRow[];
  initialCountToShow = 15;
  countToShow = 15;

  get tagsForShow(): Tag[] {
    const tagsForShow: Tag[] = this.tags.slice(0, this.countToShow).map((tag) => {
      return {
        label: tag.text,
      };
    });
    if (this.isShowMoreButton) {
      tagsForShow.push({
        label: `Show ${this.showCount} more`,
        outlined: true,
        onClick: this.showMore,
      });
    } else if (this.isShowLessButton) {
      tagsForShow.push({
        label: `Show less`,
        outlined: true,
        onClick: this.showLess,
      });
    }
    return tagsForShow;
  }

  get isShowMoreButton(): boolean {
    return this.tags.length - this.countToShow > 0;
  }

  get isShowLessButton(): boolean {
    return this.tags.length > this.initialCountToShow && this.tags.length - this.countToShow <= 0;
  }

  get showCount(): number {
    return this.tags.length - this.countToShow;
  }

  showMore(): void {
    this.countToShow = this.tags.length;
  }

  showLess(): void {
    this.countToShow = this.initialCountToShow;
  }
}
</script>

<style lang="scss" scoped>
.ag-tag {
  display: inline-block;
  opacity: 1;
  transition: all 0.5s;
}

.fade-item-enter {
  opacity: 0;
}

.fade-item-enter-active,
.fade-item-leave-active {
  transition: all 0.5s;
}

.fade-item-leave-to,
.fade-item-leave-active {
  display: none;
}

.ag-tags div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  // TODO: change to column-gap after browsers support.
  margin-left: -4px;
  margin-right: -4px;
  margin-bottom: 8px;
}
</style>
