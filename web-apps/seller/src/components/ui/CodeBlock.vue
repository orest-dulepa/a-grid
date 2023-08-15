<template>
  <div class="signup-section-code">
    <div ref="script" class="code">
      <pre v-if="!$slots.default">
        <code v-if="asScript">&lt;script&gt;</code>
        <code v-for="(line, index) in codeLines"
              :key="index"
              :class="{ indent: asScript }">{{ line }}</code>
        <code v-if="asScript">&lt;/script&gt;</code>
      </pre>
      <slot />
    </div>

    <button v-if="isCopied" class="button copied" v-on:click="copyScript">
      <checkmark />
      <span> Copied! </span>
    </button>
    <button v-else class="button" v-on:click="copyScript">
      <doc-on-doc />
      <span>Copy to clipboard</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Checkmark from '@/components/ui/icons/Checkmark.svg?inline';
import DocOnDoc from '@/components/ui/icons/DocOnDoc.vue';
import { selectElementContents, sleep } from '@/utils';

@Component({
  components: {
    DocOnDoc,
    Checkmark,
  },
})
export default class CopyCode extends Vue {
  @Prop({ type: String, default: '' }) code!: string;
  @Prop({ type: Boolean, default: true }) asScript!: boolean;
  isCopied = false;

  trimWhitespaceLines(code: string): string {
    return code.replace(/^ *\n/g, '').replace(/\n *$/, '');
  }

  get codeLines(): string[] {
    return this.trimWhitespaceLines(this.code).split('\n');
  }

  async copyScript(): Promise<void> {
    const selection = selectElementContents(this.$refs.script as HTMLElement);
    if (selection) {
      document.execCommand('copy');
      selection.removeAllRanges();
      this.isCopied = true;
      await sleep(2000);
      this.isCopied = false;
    }
  }
}
</script>

<style lang="scss">
$code-block-grey: #b5b5b5;
$code-block-grey-rgba: rgba(118, 118, 118, 0.3);

.code pre {
  display: flex;
  flex-direction: column;

  padding-left: 97px;
  padding-top: 32px;
  padding-bottom: 32px;
  margin-bottom: 0;

  white-space: pre-wrap;
  color: white;
  border-radius: 20px 20px 0 0;
  line-height: 2;

  &:before {
    counter-reset: listing;
  }
  code {
    counter-increment: listing;
  }
  code.indent::before {
    border-right: 1px solid $code-block-grey-rgba;
  }
  code::before {
    content: counter(listing);
    display: inline-block;
    width: 2em; /* to fit two-digit numbers */
    padding-left: 0;
    padding-right: 32px;
    margin-left: 0;
    text-align: right;
    color: $code-block-grey;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}

.signup-section-code {
  width: 1216px;
  background: linear-gradient(317.76deg, #2a3860 35.94%, #394873 100%);
  border-radius: 20px;
  margin-top: 48px;
  font-size: 14px;
  line-height: 12px;

  .button {
    background-color: #253052;
    color: white;

    font-size: 16px;
    font-weight: 400;
    line-height: 16px;

    border-radius: 0 0 20px 20px;
    border: none;

    width: 100%;
    padding: 16px 24px;
  }

  .button svg {
    width: 16px;
    height: 16px;
    padding: 2px;
    margin-right: 10px;
    box-sizing: border-box;
  }

  .button:hover {
    cursor: pointer;
    color: $electric-blue;
  }

  .button:hover,
  .copied {
    border-radius: 0 0 17px 17px;
    background-color: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04);
  }

  .button:focus {
    outline: none;
  }

  .button.copied,
  .button.copied:hover {
    color: $dark-blue;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 500;
  }

  .highlight-blue {
    background-color: $electric-blue;
    border-radius: 6px;
    height: 24px;
    padding: 0 8px;
    display: inline-flex;
    align-items: center;
  }
}
</style>
