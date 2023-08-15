<template>
  <div class="password-strenght">
    <div class="bar">
      <hr :class="{ active: isPassAtLeastWeak }" />
      <hr :class="{ active: isPassAtLeastOkay }" />
      <hr :class="{ active: isPassStrong }" />
    </div>
    <div v-if="isPassAtLeastWeak" class="password-type">{{ passwordStrength }} password</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { isPassAtLeastOkay } from '@/utils';

@Component
export default class PasswordStrength extends Vue {
  @Prop({ type: String, required: true }) password!: string;

  get isPassAtLeastWeak(): boolean {
    return this.password.length > 0;
  }

  get isPassAtLeastOkay(): boolean {
    return isPassAtLeastOkay(this.password);
  }

  get isPassStrong(): boolean {
    return this.password.length > 10;
  }

  get passwordStrength(): string {
    if (this.isPassStrong) return 'Strong';
    if (this.isPassAtLeastOkay) return 'Okay';
    if (this.isPassAtLeastWeak) return 'Weak';
    return '';
  }
}
</script>

<style lang="scss" scoped>
$inactive-bar-color: #e2e2e2;

.password-strenght {
  display: flex;
  align-items: center;
  height: 18px;
  margin-bottom: 5px;
}
.bar {
  width: 512px;
  max-width: 100%;
  display: flex;
  align-items: center;
}
hr {
  height: 4px;
  width: 166px;
  background-color: $inactive-bar-color;
  border-radius: 40px;
  border: none;
  margin: 0 3.5px;
}
.active {
  background-color: $electric-blue;
}
.password-type {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: $dark-grey-4;
  margin-left: 48px;
}
</style>
