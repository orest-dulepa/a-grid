<template>
  <div>
    <div
      @click="isOpen = !isOpen"
      class="dropdown"
      :class="{ 'dropdown-opened': isOpen }"
    >
      <div class="dropdown-text">{{ user?.fullName || 'User Name' }}</div>
      <div class="dropdown-icon"></div>
      <transition name="fade-down">
        <div v-if="isOpen" class="dropdown-menu">
          <div class="dropdown-item">
            {{ user?.orgName || 'Organization' }}
            <br />
            <span class="website-link">{{
              user?.orgWebsite || 'website.io'
            }}</span>
          </div>

          <router-link class="dropdown-link" to="/account">Account</router-link>

          <div @click="logoutUser" class="dropdown-logout">
            <LogOut />
            <a>Log out</a>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="isOpen" @click="isOpen = false" class="clickaway" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ActionTypes } from '@/store/actions';
import { GetterTypes } from '@/store/getters';
import { authHelper } from '@/store/modules/auth';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LogOut from '@/assets/sign-out.svg';

export default defineComponent({
  name: 'AccountDropDown',
  components: {
    LogOut,
  },
  setup() {
    const isOpen = ref(false);
    const router = useRouter();
    const store = useStore();

    const logoutUser = async () => {
      await store.dispatch(ActionTypes.SIGN_OUT);
      await router.replace('/login');
    };

    return {
      isOpen,
      logoutUser,
    };
  },
  computed: {
    ...authHelper.mapGetters({
      user: GetterTypes.GET_USER_OBJECT,
    }),
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/variables';

.dropdown {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;

  &:hover,
  &.dropdown-opened {
    .dropdown-text {
      transition: $tt-default;
      color: $electric-blue;
    }

    .dropdown-icon {
      background-image: url('@/assets/dropdown-blue.svg');
    }
  }

  &-text {
    color: $dark-blue;
  }

  &-icon {
    margin-left: 8px;
    width: 12px;
    height: 12px;
    background-image: url('@/assets/dropdown.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    transition: $tt-default;
  }

  &-menu {
    display: none;
    width: 157px;
    position: absolute;
    border-radius: 10px;
    background-color: $white;
    box-shadow: 0 4px 28px rgba(0, 0, 0, 0.15);
    line-height: 16px;

    .dropdown-item {
      display: flex;
      flex-flow: column;
      padding: 12px 16px;
      color: $black;
      background-color: $clr-app-background;
      border-radius: 10px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;

      .website-link {
        margin: 2px;
        color: $dark-grey-1;
      }
    }

    .dropdown-link {
      color: $black;
      text-decoration: none;
      padding: 16px;
      &:hover {
        transition: $tt-default;
        color: rgba(0, 0, 0, 0.7);
      }
    }

    .dropdown-logout {
      padding: 20px 16px;
      border-top: 1px solid $grey-10;

      a {
        color: $black;
        margin-left: 8px;

        &:hover {
          transition: $tt-default;
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }

  .dropdown-menu {
    display: flex;
    flex-direction: column;
    padding: 4px;
    box-sizing: border-box;
    top: 32px;
    right: 0;
  }

  &.dropdown-opened {
    .dropdown-icon {
      transform: rotate(180deg);
    }
  }
}

.clickaway {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition: all $tt-default ease;
  transform-origin: top center;
}

.fade-down-enter-from {
  transform: scaleY(0.9) scaleX(0.9);
  opacity: 0.5;
}

.fade-down-leave-to,
.fade-down-enter {
  transform: scaleY(0.9) scaleX(0.9);
  opacity: 0;
}
</style>
