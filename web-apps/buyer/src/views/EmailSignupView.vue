<template>
  <div>
    <scalable>
      <email-signup-form :firstUser="isFirstUser" />
    </scalable>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import EmailSignupForm from '@/components/App/EmailSignupForm.vue';
import Scalable from '@/layouts/Scalable.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'EmailSignup',
  components: { EmailSignupForm, Scalable },
  setup() {
    const route = useRoute();
    const isFirstUser = computed(() => route.path === '/first-user-signup');
    return {
      isFirstUser,
    };
  },
});
</script>
