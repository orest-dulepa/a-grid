<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router, { vueRoutes } from '@/routes';
import { verifyEmailCode } from '@/store/api';
import { auth } from '@/firebase';
import ResponseHandler from '@/utils/response-handler';

@Component
export default class Toggle extends Vue {
  async mounted(): Promise<void> {
    const { mode, oobCode } = this.$route.query;
    switch (mode) {
      case 'resetPassword':
        router.push({ path: vueRoutes.changePassword.path, query: { oobCode } });
        break;
      case 'recoverEmail':
        router.push({ path: vueRoutes.login.path });
        break;
      case 'verifyEmail': {
        const result = await verifyEmailCode(oobCode as string);
        if (ResponseHandler.checkType(result)) {
          if (!auth.currentUser) {
            router.push({ path: vueRoutes.login.path });
          } else {
            await auth.currentUser.reload();
          }
          router.push({ path: vueRoutes.dashboard.path });
        } else {
          router.push({ path: vueRoutes.login.path });
        }
        break;
      }
      default:
        router.push({ path: vueRoutes.login.path });
        break;
    }
  }
}
</script>
