<template>
  <div>
    <scalable>
      <navbar />
      <outer-container :transparent="true">
        <forgot-password-success v-if="submitted" />
        <forgot-password-form v-else @submit="submitted = true" />
      </outer-container>
    </scalable>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OuterContainer from '@/components/layout/OuterContainer.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Scalable from '@/components/layout/Scalable.vue';
import ForgotPasswordForm from '@/views/forgotPassword/ForgotPasswordForm.vue';
import ForgotPasswordSuccess from '@/views/forgotPassword/Success.vue';

@Component({
  components: {
    ForgotPasswordForm,
    ForgotPasswordSuccess,
    Navbar,
    OuterContainer,
    Scalable,
  },
})
export default class ForgotPasswordView extends Vue {
  submitted = false;
}
</script>
