<template>
  <div class="deals-item">
    <div class="deal-icon" />
    <div class="content">
      <div class="deal-title">
        AGrid - MiQ (Xandr) - Equifax - Product - Scale
      </div>
      <div class="deal-id">DEAL ID: 8786753542421</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DealsItem',
};
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';

.deals-item {
  display: flex;
  padding: 32px 0;
  border-top: 1px solid $grey-10;

  &:last-child {
    padding-bottom: 0;
  }

  .deal-icon {
    width: 20px;
    height: 20px;
    margin: -3px 14px 0 0;
    background-image: url('@/components/Audience/UI/icons/deal.png');
  }

  .content {
    .deal-title {
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: -0.02em;
      color: black;
    }

    .deal-id {
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 1px;
      color: $dark-grey-1;
    }
  }
}
</style>
