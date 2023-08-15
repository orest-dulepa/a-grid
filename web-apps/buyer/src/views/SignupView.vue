<template>
  <div>
    <scalable>
      <signup-form />
    </scalable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SignupForm from '@/components/App/SignupForm.vue';
import Scalable from '@/layouts/Scalable.vue';

export default defineComponent({
  name: 'Signup',
  components: { SignupForm, Scalable },
});
</script>
