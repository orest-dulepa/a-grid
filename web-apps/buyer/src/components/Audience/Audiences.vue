<template>
  <div class="audience">
    <div class="audience-content">
      <div class="audience-table">
        <div class="table">
          <audiences-table @openModal="openModal" />
          <deploy-modal
            @closeModal="closeModal"
            :showModal="showModal"
            :modal-data="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AudiencesTable from './AudiencesTable.vue';
import DeployModal from './UI/DeployModal.vue';

export default defineComponent({
  name: 'Audiences',
  components: { DeployModal, AudiencesTable },
  data() {
    return {
      showModal: false,
      item: {},
    };
  },
  methods: {
    openModal(item: Record<string, unknown>) {
      this.showModal = true;
      this.item = item;
    },
    closeModal() {
      this.showModal = false;
      this.item = {};
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/typography';
@import '@/styles/colors';
@import '@/styles/shadows';

$row-height: 47px;
$table-bs: 0px 4px 8px rgba(0, 0, 0, 0.02);
$table-border: 1px solid $grey-10;

.audience {
  max-width: 1200px;
  margin: 56px auto 0;
  &-title {
    color: $clr-typo-titles;
    font-size: $h2-small_font-size;
    line-height: $h2-small_line-height;
    margin-bottom: 40px;
  }

  &-content {
    max-width: 1200px;
  }
}

.table {
  &-tabs {
    display: flex;
    width: fit-content;
    background: $color-1;
    box-shadow: $shadow-0;
    border-radius: 10px 10px 0 0;
  }

  &-tab {
    cursor: pointer;
    display: flex;
    font-size: $h3-reg_font-size;
    line-height: $h3-reg_line-height;
    text-decoration: none;
    color: $grey-7;
    font-weight: 500;
    padding: 24px 32px;
    box-shadow: $shadow-0;
    border-radius: 10px 10px 0 0;

    &.tab-active {
      background-color: $white;
      color: $clr-typo-titles;

      .tab-counter {
        color: $clr-primary-blue;
        background: $clr-primary-light-blue;
      }
    }

    .tab-counter {
      width: 31px;
      height: 20px;
      text-align: center;
      color: $grey-7;
      background: $color-2;
      border-radius: 30px;
      font-size: 11px;
      line-height: 20px;
      margin-left: 8px;
    }
  }

  &-content {
    position: relative;
    background-color: $white;
    border-radius: 6px;
    border: $table-border;
  }
  &-audience {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
  }
  &-row {
    align-items: center;
    &:not(:last-child) {
      border-bottom: $table-border;
    }
    div.row-item {
      height: $row-height;
      display: flex;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 14px;
      align-items: center;
      &:not(:last-child) {
        padding: 0 20px;
        border-right: 1px solid $grey-1;
      }
      .row-name {
        font-weight: 500;
      }
    }
  }
  &-head {
    box-shadow: $table-bs;
    border-bottom: $table-border;
    height: $row-height;
    p {
      text-transform: uppercase;
      color: $grey-7;
      font-size: 11px;
      line-height: 14px;
      padding-top: 13px;
      padding-bottom: 13px;
      font-weight: 500;
      margin: 0;
    }
  }
  &-search {
    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: $p-reg_font-size;
      line-height: $p-reg_line-height;
      margin-top: 64px;
    }
    &__link {
      color: $clr-primary-blue;
      border: none;
      outline: none;
      background: none;
    }
    &__text {
      color: $dark-grey-1;
    }
  }
}
</style>
