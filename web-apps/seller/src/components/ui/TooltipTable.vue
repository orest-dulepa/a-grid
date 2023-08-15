<template>
  <div class="tooltip-box">
    <slot />
    <div class="tooltip">
      <span class="text">{{ tooltip }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'TooltipTable',
})
export default class AudiencesList extends Vue {
  @Prop({ type: String, required: true }) tooltip: string | undefined;
}
</script>

<style>
.tooltip-box {
  position: relative;
  display: flex;
}

.status-block__indicator .indicator:hover + .tooltip {
  visibility: visible;
}

.tooltip {
  color: #ffffff;
  text-align: center;
  padding: 12px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;

  width: 133px;
  left: -15px;
  top: 21px;
  margin-left: -60px;

  visibility: hidden;
  transition: opacity 0.3s;

  position: absolute;
  z-index: 1;
  background: rgba(23, 23, 23, 0.9);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.text::after {
  content: ' ';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(23, 23, 23, 0.9) transparent;
}
</style>
