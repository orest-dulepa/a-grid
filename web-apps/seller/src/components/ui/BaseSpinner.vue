<template>
  <div>
    <div class="spinner" :class="{ white: isWhite }">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <div>Loading, please wait</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BaseSpinner extends Vue {
  @Prop({ type: Boolean, default: false }) isWhite!: boolean;
}
</script>

<style lang="scss" scoped>
.spinner {
  margin: 100px auto 16px;
  width: 70px;
  height: 8px;
  line-height: 0;
  text-align: center;
}

.spinner > div {
  width: 10px;
  height: 10px;
  background-color: #2962ff;
  margin: 0 4px;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner.white > div {
  background-color: $white;
}

.spinner + div {
  font-family: Inter;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #666666;
}

.spinner.white + div {
  color: rgba($white, 0.8);
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
