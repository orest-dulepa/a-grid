<template>
  <container>
    <main class="container">
      <div class="icon-container">
        <mail class="mail-icon" />
      </div>
      <h1 class="heading-2 heading-2__max">Check your inbox</h1>
      <p class="paragraph-large">
        We sent you a reset password link. Please be sure to check your spam folder too.
      </p>
    </main>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import Mail from '@/components/ui/icons/Mail.vue';

@Component({
  components: {
    Container,
    Mail,
  },
})
export default class ForgotPasswordSucccess extends Vue {}
</script>

<style lang="scss" scoped>
.paragraph-large {
  font-size: 22px;
  line-height: 34px;
}
.container {
  width: 512px;
  max-width: 100%;
}
.icon-container {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: $blue-light;
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mail-icon {
  width: 46px;
  height: auto;
}
.heading-2 {
  margin-bottom: 22px;
}
.paragraph-large {
  margin: 0;
}
</style>
