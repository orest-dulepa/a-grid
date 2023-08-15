<template>
  <div>
    <scalable>
      <navbar />
      <outer-container :transparent="true">
        <change-password-form />
      </outer-container>
    </scalable>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OuterContainer from '@/components/layout/OuterContainer.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Scalable from '@/components/layout/Scalable.vue';
import ChangePasswordForm from '@/views/changePassword/ChangePasswordForm.vue';

@Component({
  components: {
    ChangePasswordForm,
    Navbar,
    OuterContainer,
    Scalable,
  },
})
export default class ChangePasswordView extends Vue {}
</script>
