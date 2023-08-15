<template>
  <div>
    <scalable>
      <create-organization-form />
    </scalable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CreateOrganizationForm from '../components/App/CreateOrganizationForm.vue';
import Scalable from '../layouts/Scalable.vue';

export default defineComponent({
  name: 'CreateOrganization',
  components: { CreateOrganizationForm, Scalable },
});
</script>
