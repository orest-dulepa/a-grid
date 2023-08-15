<template>
  <div class="form-field">
    <div class="field-container">
      <slot></slot>
    </div>

    <div v-if="isError" class="field-errors">
      <div
        class="field-error"
        v-for="(value, idx) in parseErrors(propError)"
        :key="'form-field-' + idx"
      >
        {{ value.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import { IResponseError } from '@/types';

export type FormFieldError = IResponseError<undefined>;

export default defineComponent({
  props: {
    error: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    const { error: propError } = toRefs(props);

    const isError = computed(() => !!Object.keys(propError.value).length);

    const parseErrors = (
      err: FormFieldError | FormFieldError[]
    ): FormFieldError[] => {
      const arr = Array.isArray(err) ? err : [err];

      if (Array.isArray(arr[0].message)) {
        return arr[0].message.map((value) => ({ message: value }));
      }

      return arr;
    };

    return {
      propError,
      parseErrors,
      isError,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.form-field {
  margin-bottom: 12px;

  .field-container {
    position: relative;
  }

  .field-errors {
    margin-top: 10px;
  }

  .field-error {
    font-weight: 500;
    text-align: left;
    color: $error;
    font-size: 14px;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
