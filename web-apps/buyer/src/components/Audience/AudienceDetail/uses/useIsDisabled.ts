import { computed, ComputedRef } from 'vue';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';
import { NAMESPACE as AUTH_NAMESPACE } from '@/store/modules/auth';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const useIsDisabled: () => { isDisabled: ComputedRef<boolean> } = () => {
  const store = useStore();
  const route = useRoute();

  const audienceOwner = computed(() =>
    store.getters[`${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_OWNER}`](
      route.params.id
    )
  );

  const user = computed(
    () => store.getters[`${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`]
  );

  const isDisabled = computed(
    () => audienceOwner.value !== user.value.accountId
  );

  return {
    isDisabled,
  };
};

export default useIsDisabled;
