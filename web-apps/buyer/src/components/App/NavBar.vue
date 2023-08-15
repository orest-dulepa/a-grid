<template>
  <nav class="navbar" :class="{ white: !authPaths.includes($route.path) }">
    <div class="navbar-logo">
      <Logo />
      <div v-if="user" class="navbar-divider"></div>
      <navbar-button v-if="user" to="/overview">Overview</navbar-button>
      <navbar-button v-if="user" to="/audiences">Audiences</navbar-button>
    </div>
    <div class="navbar-account" v-if="isDashboard">
      <nav-bar-drop-down />
    </div>
    <div class="navbar-signup" v-else>
      <span
        >New user?
        <router-link to="signup">Sign Up</router-link>
      </span>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import NavBarDropDown from './AccountDropDown.vue';
import { useRoute } from 'vue-router';
import NavbarButton from './NavbarButton.vue';
import Logo from '@/assets/logo.svg';
import { useStore } from 'vuex';
import { authPaths } from '@/router/router';
import { NAMESPACE as AUTH_NAMESPACE } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

export default defineComponent({
  name: 'NavBar',
  components: { NavBarDropDown, NavbarButton, Logo },
  setup() {
    const store = useStore();

    const user = computed(() => {
      return store.getters[`${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`];
    });

    const route = useRoute();
    const isDashboard = computed(
      () =>
        ![
          '/login',
          '/signup',
          '/email-signup',
          '/first-user-signup',
          '/create-organization',
        ].includes(route.path)
    );
    return {
      isDashboard,
      user,
      authPaths,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/typography';

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 32px;
  box-sizing: border-box;
  height: var(--global-navbar-height);

  &.white {
    background-color: $white;
  }

  &-logo {
    display: flex;
  }

  &-divider {
    height: 32px;
    width: 1px;
    margin: 0 32px;
    border-right: 1px solid $grey-2;
  }

  &-account {
    font-size: $p-reg_font-size;
    line-height: $link-reg_line-height;
    font-weight: 500;
    color: $dark-grey-1;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &-signup {
    font-size: $p-reg_font-size;
    line-height: $link-reg_line-height;
    font-weight: 500;
    color: $dark-grey-1;
    display: flex;
    align-items: center;
    cursor: pointer;

    a {
      color: $electric-blue;
      text-decoration: none;
    }
  }
}
</style>
