<template>
  <div>
    <scalable>
      <navbar :step="step" />
      <outer-container :transparent="true">
        <signin-form />
      </outer-container>
    </scalable>
    <mobile-banner />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OuterContainer from '@/components/layout/OuterContainer.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Scalable from '@/components/layout/Scalable.vue';
import SigninForm from '@/views/signin/SigninForm.vue';
import MobileBanner from '@/components/ui/MobileBanner.vue';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    Navbar,
    SigninForm,
    OuterContainer,
    MobileBanner,
    Scalable,
  },
  computed: {
    ...authHelpers.mapGetters({
      step: GetterTypes.GET_SIGN_UP_STEP,
    }),
  },
})
export default class SigninView extends Vue {
  step!: string;
}
</script>
