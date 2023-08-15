<template>
  <div>
    <scalable>
      <sign-in-form />
    </scalable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SignInForm from '@/components/App/SigninForm.vue';
import Scalable from '@/layouts/Scalable.vue';

export default defineComponent({
  name: 'Login',
  components: { SignInForm, Scalable },
});
</script>
