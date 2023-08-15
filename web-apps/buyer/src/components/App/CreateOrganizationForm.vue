<template>
  <div class="auth-container">
    <h1 class="heading-2 heading-2__max">
      <span>Create organization</span>
    </h1>
    <p>Create your organization account to get started with AGrid</p>
    <form
      @submit.prevent="createOrganizationClick"
      :class="{ filled: isFilled }"
      novalidate
    >
      <div class="form-field">
        <type-switch
          :selectedType="accountType"
          @selectAccountType="selectAccountType"
        />
      </div>
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="orgName"
          required
          placeholder="Organization name"
        />
      </div>
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="orgWebsite"
          required
          placeholder="Organization website"
        />
      </div>
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="orgEmailDomain"
          required
          disabled
          placeholder="Organization Email Domain"
        />
      </div>
      <div class="form-field">
        <select-platform
          :accountType="accountType"
          :platformOptions="platformOptions"
          @togglePlatform="togglePlatform"
        />
      </div>
      <div class="form-field" v-if="isOtherSelected">
        <input
          class="input input_auth"
          v-model="platformOther"
          required
          placeholder="Please specify your platform"
        />
      </div>
      <div class="submit form__elem-wide">
        <button
          type="submit"
          class="auth-btn"
          :class="{ disabled: isButtonDisabled }"
        >
          {{ isLoading ? 'Loading...' : 'Create organization' }}
        </button>
        <button
          class="auth-btn transparent"
          :class="{ disabled: isButtonDisabled }"
        >
          <router-link to="login">Go back</router-link>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import { createOrganization } from '@/store/api';
import { FirebaseAuthError } from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';
import { GetterTypes } from '@/store/getters';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SelectPlatform from './UI/SelectPlatform.vue';
import TypeSwitch from './UI/TypeSwitch.vue';
import { AccountType } from '@/types';

export default defineComponent({
  name: 'CreateOrganizationForm',
  components: {
    SelectPlatform,
    TypeSwitch,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const { orgEmailDomain } = store.getters[
      `auth/${GetterTypes.GET_SIGNUP_INFO}`
    ];

    if (!orgEmailDomain) router.push({ name: 'Signup' });

    const orgName: Ref<string> = ref('');
    const orgWebsite: Ref<string> = ref('');
    const platformOther: Ref<string> = ref('');
    const accountType: Ref<AccountType> = ref('buyer');
    const error: Ref<FirebaseAuthError | null> = ref(null);
    const isLoading: Ref<boolean> = ref(false);

    const isButtonDisabled = computed(() => !isFilled.value || isLoading.value);

    const platformOptions: Ref<{ value: string; checked: boolean }[]> = ref([
      { value: 'Xandr', checked: false },
      { value: 'DV360', checked: false },
      { value: 'TTD', checked: false },
      { value: 'Beeswax', checked: false },
      { value: 'Other', checked: false },
    ]);

    const togglePlatform = (idx: number) => {
      platformOptions.value[idx].checked = !platformOptions.value[idx].checked;
    };

    const selectedOptions = computed(() =>
      platformOptions.value
        .filter((platform) => platform.checked)
        .map((platform) => platform.value)
    );

    const isOtherSelected = computed(() =>
      selectedOptions.value.includes('Other')
    );

    const isFilled = computed(
      () =>
        !!orgName.value &&
        !!orgEmailDomain &&
        !!orgWebsite.value &&
        selectedOptions.value.length > 0 &&
        (isOtherSelected.value ? !!platformOther.value : true)
    );

    const createOrganizationClick = async () => {
      error.value = null;
      isLoading.value = true;

      const platforms = isOtherSelected.value
        ? selectedOptions.value
            .filter((platform) => platform !== 'Other')
            .concat([platformOther.value])
        : selectedOptions.value;

      const result = await createOrganization({
        orgEmailDomain,
        orgName: orgName.value,
        orgWebsite: orgWebsite.value,
        accountType: accountType.value,
        platforms,
      });

      if (result.type === 'error') {
        isLoading.value = false;
        error.value = FirebaseErrorHandler.process(result);
      } else {
        await store.dispatch(ActionTypes.SET_USER);
        isLoading.value = false;
        await router.push({ name: 'Home' });
      }
    };

    const selectAccountType = (type: AccountType): void => {
      accountType.value = type;
    };

    return {
      platformOptions,
      platformOther,
      isOtherSelected,
      togglePlatform,
      orgName,
      orgEmailDomain: `@${orgEmailDomain}`,
      orgWebsite,
      error,
      isLoading,
      createOrganizationClick,
      isFilled,
      isButtonDisabled,
      selectAccountType,
      accountType,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';
@import 'src/styles/form';
@import 'src/styles/auth';

.heading-2 {
  margin-bottom: 28px;
  font-size: 45px;
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
