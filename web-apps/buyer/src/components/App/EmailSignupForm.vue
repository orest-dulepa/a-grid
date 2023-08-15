<template>
  <div class="auth-container">
    <h2>
      {{ firstUser ? 'Be the first to sign up' : `Sign up for ${orgName}` }}
    </h2>
    <p v-if="firstUser">You are the first to sign up from your organization</p>
    <p v-else>
      Create your own account inside <b>{{ orgName }}</b> organization
    </p>
    <form
      @submit.prevent="signUpClick"
      :class="{ filled: isFilled }"
      novalidate
    >
      <form-field :error="isInvalidEmail ? error : {}">
        <input
          disabled
          :class="{ invalid: isInvalidEmail }"
          v-model="email"
          type="email"
          required
          placeholder="E-mail address"
        />
      </form-field>
      <form-field
        :error="isInvalidName ? { message: 'Name cannot be empty' } : {}"
      >
        <input
          :class="{ invalid: isInvalidName }"
          v-model="fullName"
          required
          placeholder="Full Name"
          @keyup="validateName"
          @blur="validateName"
        />
      </form-field>
      <form-field :error="isWrongPassword ? error : {}">
        <input
          :class="{ invalid: isWrongPassword }"
          v-model="password"
          type="password"
          required
          minlength="8"
          placeholder="Password"
        />
      </form-field>
      <div class="submit">
        <button :disabled="isButtonDisabled">
          {{
            isLoading ? 'Loading...' : firstUser ? 'Continue' : 'Sign up now'
          }}
        </button>
        <button class="submit-go-back-btn" transparent>
          <router-link to="signup">Go back</router-link>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import { signUp } from '@/store/api';
import {
  FirebaseAuthError,
  FirebaseAuthEmailInvalid,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';
import { GetterTypes } from '@/store/getters';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import FormField from '@/components/UI/form/FormField.vue';

export default defineComponent({
  name: 'EmailSignupForm',
  components: {
    FormField,
  },
  props: {
    firstUser: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const user = store.getters[`auth/${GetterTypes.GET_USER_OBJECT}`];
    if (user) router.push({ name: 'Login' });

    const { email, orgName } = store.getters[
      `auth/${GetterTypes.GET_SIGNUP_INFO}`
    ];

    if (!email) router.push({ name: 'Signup' });

    const fullName: Ref<string> = ref('');
    const password: Ref<string> = ref('');
    const error: Ref<FirebaseAuthError | null> = ref(null);
    const isInvalidName: Ref<boolean> = ref(false);
    const isLoading: Ref<boolean> = ref(false);

    const isFilled = computed(
      () => !!email && !!fullName.value && password.value.length >= 8
    );

    const isInvalidEmail = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthEmailInvalid.code
    );

    const validateName = () => {
      isInvalidName.value = fullName.value.length === 0;
    };

    const isButtonDisabled = computed(
      () => !isFilled.value || isLoading.value || isInvalidName.value
    );

    const signUpClick = async () => {
      error.value = null;
      isLoading.value = true;

      const result = await signUp(
        email,
        password.value,
        fullName.value,
        orgName
      );

      isLoading.value = false;
      if (result.type === 'error') {
        error.value = FirebaseErrorHandler.process(result);
      } else {
        await store.dispatch(ActionTypes.SET_USER);
        if (props.firstUser) await router.push({ name: 'CreateOrganization' });
        else await router.push({ name: 'Home' });
      }
    };

    return {
      email,
      orgName,
      password,
      fullName,
      error,
      isLoading,
      signUpClick,
      isFilled,
      isInvalidEmail,
      isInvalidName,
      validateName,
      isButtonDisabled,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/form';
@import '@/styles/auth';

form {
  margin-top: 24px;

  .submit {
    display: flex;
    flex-direction: column;
  }

  button {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    &.submit-go-back-btn {
      margin: 0 auto;
    }
  }
}

.sub-text {
  margin: -10px 0 40px 0;
}

.form-field .form-field-info {
  color: $clr-primary-blue;

  &.form-field-info-forgot {
    width: 67px;
  }

  .form-error {
    width: 340px;
  }

  &.form-error__with_link {
    flex-direction: row;
    width: 330px;
    align-items: center;

    span {
      border-right: 1px solid $grey-2;
      padding-right: 28px;
    }

    a {
      padding-left: 28px;
    }

    a:visited {
      color: $clr-primary-blue;
    }
  }
}

.general-error {
  text-align: center;
  color: $clr-notify-alert;
}
</style>
