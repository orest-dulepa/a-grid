<template>
  <div class="container">
    <template v-if="crawls">
      <container>
        <div class="features-list-header">
          <h1 class="heading-2">Recent page crawls</h1>
          <base-notify :show="isUrlFlaggedNotificationShown">
            Thanks, we’ve been notified.
          </base-notify>
        </div>

        <div v-if="showEmptyList" class="features-list">
          <base-overlay v-if="!showCrawledFeatures">
            <div class="features-list__not-validated">
              <span><clock /></span>
              <div class="features-list__not-validated-text">
                <h3>Crawl results will be available within 24 hrs</h3>
                <p>
                  AGrid is sucessfully configured on your site. We are launching the feature
                  extractor.
                </p>
              </div>
            </div>
          </base-overlay>
          <error-overlay
            v-else-if="!isLoadedSuccessfully"
            :with-background="false"
            label="Couldn’t load the page crawls"
          />
          <div
            v-for="index in timesShowEmptyBox"
            class="features-list__box features-list__box_empty"
            :key="index"
          ></div>
        </div>

        <div v-if="showPageCrawls" class="features-list">
          <div v-for="(page, index) in crawls" class="features-list__box" :key="index">
            <div class="features-list__row">
              <div class="features-list__column features-list__column_colspan_4">
                <p class="heading-3">{{ page.pageTitle }}</p>
                <p class="paragraph-small" target="_blank" :href="page.url">{{ page.url }}</p>
              </div>
              <div class="features-list__column features-list__column_right">
                <span class="hours-ago">{{ formatTimestamp(page.timestamp) }}</span>
              </div>
              <div class="features-list__column features-list__column_right">
                <a v-on:click="flagUrl(page)">
                  <flag-popover :notified="isUrlFlagged(page.url)" />
                </a>
              </div>
            </div>

            <div v-if="page.pageKeywords.length" class="features-list__row">
              <tag-list :tags="page.pageKeywords" />
            </div>
          </div>
        </div>
      </container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import FlagPopover from '@/components/ui/FlagPopover.vue';
import BaseNotify from '@/components/ui/BaseNotify.vue';
import TagList from '@/components/ui/TagList.vue';
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import Clock from '@/components/ui/icons/Clock.vue';
import { flagUrl } from '@/store/api';
import { sleep, dayInMilliseconds, hourInMilliseconds, minuteInMilliseconds } from '@/utils';
import { PageCrawlsRow } from '@/store/types';
import ErrorOverlay from '@/components/ui/ErrorOverlay.vue';

@Component({
  components: {
    BaseNotify,
    BaseOverlay,
    Clock,
    Container,
    ErrorOverlay,
    TagList,
    FlagPopover,
  },
})
export default class FeaturesPageList extends Vue {
  @Prop({ type: Array, required: true }) crawls!: PageCrawlsRow[];
  @Prop({ type: Boolean, required: true }) isLoadedSuccessfully!: boolean;
  @Prop({ type: Boolean, required: true }) showCrawledFeatures!: boolean;
  @Prop({ type: Boolean, required: true }) isIntegrationCheckSuccessful!: boolean;
  isUrlFlaggedNotificationShown = false;
  timesShowEmptyBox = 2;
  flaggedUrls: Record<string, boolean> = {};

  formatTimestamp(timestamp: number): string {
    let timeAgo = Date.now() - timestamp;

    if (timeAgo < 0) {
      timeAgo = 0;
    }

    if (timeAgo > dayInMilliseconds) return `${Math.floor(timeAgo / dayInMilliseconds)} days ago`;

    if (timeAgo > hourInMilliseconds) return `${Math.floor(timeAgo / hourInMilliseconds)} hrs ago`;

    return `${Math.floor(timeAgo / minuteInMilliseconds)} mins ago`;
  }

  isUrlFlagged(url: string): boolean {
    return this.flaggedUrls[url];
  }

  async flagUrl(page: PageCrawlsRow): Promise<void> {
    if (this.isUrlFlagged(page.url)) return;
    await flagUrl(page.url);
    this.showUrlFlaggedNotification();
    this.flaggedUrls[page.url] = true;
  }

  async showUrlFlaggedNotification(): Promise<void> {
    const urlFlaggedNotificationDuration = 5000;
    this.isUrlFlaggedNotificationShown = true;
    await sleep(urlFlaggedNotificationDuration);
    this.isUrlFlaggedNotificationShown = false;
  }

  get showEmptyList(): boolean {
    return (
      !this.isIntegrationCheckSuccessful || !this.showCrawledFeatures || !this.isLoadedSuccessfully
    );
  }

  get showPageCrawls(): boolean {
    return !this.showEmptyList && this.crawls.length !== 0;
  }
}
</script>

<style lang="scss" scoped>
$font-light: #828282;

.features-list-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.title {
  font-size: 24px;
}

.subtitle {
  font-size: 16px;
  color: $font-light;
}

.tag {
  margin: 4px;
}

.features-list {
  position: relative;
  margin-top: 40px;

  .features-list__not-validated {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    padding: 12px;

    span {
      width: 48px;
      height: 48px;
      color: $electric-blue;

      svg {
        padding: 2px;
      }
    }

    .features-list__not-validated-text {
      text-align: center;
      margin: 6px 0;
      width: 31%;

      h1,
      h2,
      h3,
      p {
        margin: 10px 0;
      }
      p {
        opacity: 0.8;
      }
    }
  }

  .features-list__box {
    background-color: $white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    padding: 24px;
    margin: 24px 0;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }

    &.features-list__box_empty {
      height: 192px;
      background-color: $empty-box-color;
      box-shadow: none;
    }

    .features-list__row {
      align-items: start;
      justify-content: space-between;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }

    .features-list__column {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    .features-list__column.features-list__column_right {
      align-items: flex-end;
      margin-top: 4px;
    }

    .features-list__column:last-child {
      flex: inherit;
      width: 16px;
      margin-left: 20px;
    }

    .features-list__column_colspan_4 {
      flex: 4;
    }

    .paragraph-small {
      margin-top: 6px;
      margin-bottom: 20px;
    }

    .hours-ago {
      font-size: 14px;
      line-height: 14px;
      color: $dark-grey-1;
    }
  }
}
</style>
