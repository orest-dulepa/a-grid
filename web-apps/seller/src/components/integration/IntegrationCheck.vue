<template>
  <container is-large="true">
    <transition name="fade">
      <base-overlay v-if="isShowSuccess" :is-fixed="true">
        <div class="integration-success">
          <div class="multi-icons">
            <span class="multi-icons__checkmark"><checkmark /></span>
            <div class="multi-icons__circle">
              <div class="multi-icons__circle-border"></div>
            </div>
          </div>
          <h1 class="heading-1 heading-1__max">All Done.</h1>
          <p>Creating your dashboard.</p>
          <p>You will be redirected in a moment.</p>
        </div>
      </base-overlay>
    </transition>
    <div class="integration-todo" :class="{ 'integration-page': isIntegrationPage }">
      <div class="integration-header">
        <h1 class="heading-2" :class="{ 'heading-2__max': !isIntegrationPage }">
          <span v-if="isIntegrationPage">Integration</span>
          <span v-else>Integrate AGrid</span>
        </h1>
        <base-button
          v-if="!isIntegrationPage"
          :theme="BUTTON_THEMES.white"
          :size="BUTTON_SIZES.medium"
          v-on:click="goToDashboard"
          outline
        >
          <span>Skip for now</span>
        </base-button>
      </div>

      <div class="todo-list">
        <ol>
          <li>
            <div class="circle">1</div>
            <a @click="scrollToRef('integrationScript')">Install the AGrid script</a>
          </li>
          <li>
            <div class="circle">2</div>
            <a @click="scrollToRef('integrationAppNexus')"> Pass AGrid audiences to Prebid </a>
          </li>
        </ol>
      </div>

      <box class="verify-installation" :class="{ 'verify-installation--grey': !isIntegrationPage }">
        <div ref="integrationVerify" class="verify-installation__row">
          <p><arrow-clockwise />Enter your site URL to verify correct installation</p>
        </div>
        <div class="verify-installation__row">
          <input
            ref="website"
            class="input"
            v-model="website"
            type="text"
            :placeholder="orgWebsite"
          />
          <base-button v-on:click="checkMyCode">
            <span>Verify installation</span>
          </base-button>

          <div
            v-if="codeIsChecked && isEdgekitScriptInstalled && isEdgekitAudiencesInstalled"
            class="text-status installed"
            key="1"
          >
            <checkmark />
            <span>Script is running</span>
          </div>
          <div v-else-if="codeIsChecked && isEdgekitScriptInstalled" class="column" key="2">
            <div class="text-status installed">
              <checkmark />
              <span>Script is running</span>
            </div>
            <div class="text-status not-installed">
              <xmark />
              <span>Deals are not set up</span><arrow-right />
            </div>
          </div>
          <div v-else-if="codeIsChecked" class="text-status not-installed" key="3">
            <xmark />
            <span>Not installed</span>
          </div>
        </div>
      </box>
    </div>

    <hr />

    <div ref="integrationScript" class="integration-section">
      <div class="integration-section-header">
        <div class="todo-list todo-list__dark">
          <ol>
            <li>
              <div class="circle circle__dark">1</div>
              <span> Install the script</span>
            </li>
          </ol>
        </div>
        <transition name="fade" mode="out-in" :duration="{ enter: 500, leave: 100 }">
          <div v-if="isEdgekitScriptInstalled" class="status installed" key="1">
            <checkmark />
            <span>Installed</span>
          </div>
          <div v-else-if="codeIsChecked" class="status not-installed" key="2">
            <xmark />
            <span>Not installed</span>
          </div>
          <div
            v-else-if="isLoading"
            class="status loading"
            :class="{ 'loading--grey': !isIntegrationPage }"
            key="3"
          >
            <simple-circle />
            <span>Loading...</span>
          </div>
          <div v-else key="4">
            <base-button :size="BUTTON_SIZES.medium" v-on:click="checkMyCode">
              <arrow-clockwise />
              Verify
            </base-button>
          </div>
        </transition>
      </div>

      <div class="integration-section-body">
        <p>
          Please install the following snippet in the <span class="highlight">&lt;head&gt;</span> of
          your page, preferably as high in the page as possible. Our script loads asynchronously and
          does not slow down the load of your page.
        </p>
      </div>

      <code-block :code="embedCode" />
    </div>

    <hr />

    <div class="integration-section" ref="integrationAppNexus">
      <div class="integration-section-header">
        <div class="todo-list todo-list__dark">
          <ol>
            <li>
              <div class="circle circle__dark">2</div>
              <span>Append AGrid audiences</span>
            </li>
          </ol>
        </div>
        <transition name="fade" mode="out-in" :duration="{ enter: 500, leave: 100 }">
          <div v-if="isEdgekitAudiencesInstalled" class="status installed" key="1">
            <checkmark />
            <span>Installed</span>
          </div>
          <div v-else-if="codeIsChecked" class="status not-installed" key="2">
            <xmark />
            <span>Not installed</span>
          </div>
          <div
            v-else-if="isLoading"
            class="status loading"
            :class="{ 'loading--grey': !isIntegrationPage }"
            key="3"
          >
            <simple-circle />
            <span>Loading...</span>
          </div>
          <div v-else key="4">
            <base-button :size="BUTTON_SIZES.medium" v-on:click="checkMyCode">
              <arrow-clockwise />
              Verify
            </base-button>
          </div>
        </transition>
      </div>

      <div class="integration-section-body integration-section-body__audiences-1">
        <p>
          To pass AGrid audiences to buyers, we must grab the matched audiences for the current
          user, this must occur before we setup our Prebid <span class="highlight">adUnits</span>:
        </p>
      </div>

      <code-block :code="audienceIdsCode" :as-script="false" />

      <div class="integration-section-body integration-section-body__audiences-2">
        <p>
          We can now pass the <span class="highlight">edktAudienceIds</span> into the Xandr bidder
          params when you setup your Prebid <span class="highlight">adUnits</span>:
        </p>
        <small>Note: this is an example setup, your site code will be different.</small>
      </div>

      <code-block>
        <pre>
          <code>var adUnits = [</code>
          <code>  {</code>
          <code>    code: '/19968336/header-bid-tag',</code>
          <code>    // setup omitted for brevity...</code>
          <code>    bids: [{</code>
          <code>      bidder: 'appnexus',</code>
          <code>      params: {</code>
          <code>        placementId: 13144370,</code>
          <code>        keywords: {</code>
          <code>          <span class="highlight-blue">edgekit: edktAudiences</span></code>
          <code>        }</code>
          <code>      }</code>
          <code>    }]</code>
          <code>  }</code>
          <code>];</code>
        </pre>
      </code-block>

      <div class="integration-section-body integration-section-body__audiences-3">
        <p>
          The main thing happening here is that we are adding<br />
          <span class="highlight">agrid: edktAudienceIds</span> to the
          <span class="highlight">bidder.params.keywords</span><br />
          object specifically for Xandr.
        </p>

        <div class="scroll-to-verify">
          <a @click="scrollToRef('integrationVerify')">
            <span>Verify your site </span>
            <arrow-down />
          </a>
        </div>

        <div class="view-full-guide">
          <a target="_blank" href="https://docs.agrid.io/">
            <span>View full integration guide </span>
            <arrow-right />
          </a>
        </div>
      </div>
    </div>

    <div v-if="!isIntegrationPage" class="integration-footer">
      <base-button v-on:click="goToDashboard"> Go to dashboard </base-button>

      <p class="footnote">You can do this later.</p>
    </div>
  </container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ArrowClockwise from '@/components/ui/icons/ArrowClockwise.svg?inline';
import ArrowDown from '@/components/ui/icons/ArrowDown.svg?inline';
import ArrowRight from '@/components/ui/icons/ArrowRight.vue';
import Box from '@/components/layout/Box.vue';
import Checkmark from '@/components/ui/icons/Checkmark.svg?inline';
import DocOnDoc from '@/components/ui/icons/DocOnDoc.vue';
import Xmark from '@/components/ui/icons/Xmark.vue';
import CodeBlock from '@/components/ui/CodeBlock.vue';
import BaseButton, { BUTTON_THEMES, BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import Container from '@/components/layout/Container.vue';
import * as api from '@/store/api';
import router, { vueRoutes } from '@/routes';
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import { scrollToElement, sleep } from '@/utils/index';
import smoothscroll from 'smoothscroll-polyfill';
import SimpleCircle from '@/components/ui/icons/SimpleCircle.svg?inline';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';
import { MutationTypes } from '@/store/mutations';
import { UserInfo } from '@/store/types';
import { setIsIntegrationCheckSuccessful } from '@/store/api';
import store from '@/store';
import { ActionTypes } from '@/store/actions';

@Component({
  components: {
    ArrowClockwise,
    ArrowDown,
    ArrowRight,
    BaseButton,
    BaseOverlay,
    Box,
    Checkmark,
    CodeBlock,
    Container,
    DocOnDoc,
    SimpleCircle,
    Xmark,
  },
  methods: {
    ...authHelpers.mapMutations({ goToNextStep: MutationTypes.GO_TO_NEXT_SIGN_UP_STEP }),
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
  },
})
export default class SignupEmbedCode extends Vue {
  @Prop({ type: Boolean, default: false }) isIntegrationPage!: boolean;
  @Prop({ type: Boolean, default: false }) isShowSuccess!: boolean;

  goToNextStep!: () => void;
  isLoading = false;
  codeIsChecked = false;
  isEdgekitScriptInstalled = false;
  isEdgekitAudiencesInstalled = false;
  apiKey = 'API_KEY';
  publisherId = 'PUBLISHER_ID';
  BUTTON_THEMES = BUTTON_THEMES;
  BUTTON_SIZES = BUTTON_SIZES;
  error: string | null = null;
  snapshotListener: (() => void) | null = null;
  vueRoutes = vueRoutes;
  user?: UserInfo;
  website = '';

  get embedCode(): string {
    return `
  (function() {
    var edktInitializor = window.edktInitializor = window.edktInitializor || {};
    if (!edktInitializor.invoked) {
      edktInitializor.invoked = true;
      edktInitializor.accountId = '${this.accountId}';
      edktInitializor.publisherId = '${this.publisherId}';
      edktInitializor.apiKey = '${this.apiKey}';
      edktInitializor.load = function(e) {
        var p = e ? e : 'sdk';
        var n = document.createElement('script');
        n.type = 'text/javascript';
        n.async = true;
        n.src = 'https://cdn.edkt.io/' + p + '/edgekit.min.js';
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(n, a);
      };
      edktInitializor.load();
    }
  })();`;
  }

  get audienceIdsCode(): string {
    return `
var edktAudiences;
try {
  edktAudienceIds = JSON.parse(localStorage.getItem('edkt_matched_audience_ids') || '[]')
    .slice(0, 100)
    .map(String);
}
catch (e) {
  edktAudiences = [];
}
`;
  }

  async created(): Promise<void> {
    const result = await api.getPublisher();
    if (result.type === 'success' && result.data) {
      this.apiKey = result.data.apiKey;
      this.publisherId = result.data.publisherId;
    }

    smoothscroll.polyfill();
  }

  beforeDestroy(): void {
    if (this.snapshotListener) this.snapshotListener();
  }

  scrollToRef(ref: string): void {
    const el = this.$refs[ref];
    if (el instanceof Element) scrollToElement(el);
  }

  async goToDashboard(): Promise<void> {
    this.goToNextStep();
    await sleep(3000);
    router.push(vueRoutes.dashboard.path);
  }

  async checkMyCode(): Promise<void> {
    this.error = null;
    this.isLoading = true;

    const url = this.website ? this.website : this.orgWebsite;
    const resultEmbedCodeCheck = await api.checkIntegration(url);
    this.isLoading = false;
    this.codeIsChecked = true;
    if (resultEmbedCodeCheck.type === 'success' && resultEmbedCodeCheck.data !== undefined) {
      this.isEdgekitScriptInstalled = resultEmbedCodeCheck.data.cdnScriptAdded;
      this.isEdgekitAudiencesInstalled = resultEmbedCodeCheck.data.preBidAudiencesAdded;

      if (this.isEdgekitScriptInstalled && this.isEdgekitAudiencesInstalled) {
        await setIsIntegrationCheckSuccessful(true);
        await store.dispatch(ActionTypes.CLEAR_AUDIENCE_STATS, true);
        await store.dispatch(ActionTypes.SET_INTEGRATION_COMPLETE_SUCCESS, true);
        await store.dispatch(ActionTypes.SET_AUDIENCE_STATS, true);
        router.push(vueRoutes.dashboard.path);
      }
    }
    await sleep(3000);
    this.codeIsChecked = false;
  }

  get accountId(): string {
    if (!this.user) {
      return 'ACCOUNT_ID';
    }
    return this.user.accountId;
  }

  get orgWebsite(): string {
    if (!this.user) {
      return '';
    }
    return this.user.orgWebsite;
  }
}
</script>

<style lang="scss" scoped>
$integration-light-blue: #eaeffd;
$diameter: 128px;

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.3;
}

.button {
  font-size: 16px;
  line-height: 16px;
}

.circle {
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background-color: #2c5ef6;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  &.circle__dark {
    background-color: $dark-grey-4;
    color: white;
  }
}

hr {
  height: 1px;
  border: none;
  margin: 80px 0;
  width: 1024px;
  background-color: #e0e0e0;
}

.ag-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.integration-todo {
  width: 1024px;
}

.todo-list {
  padding-top: 3px;

  ol {
    padding: 0;
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 24px;
    color: #2c5ef6;
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  a:hover {
    cursor: pointer;
  }

  &.todo-list__dark {
    li {
      color: $dark-grey-4;
      font-size: 32px;
      font-weight: bold;
    }
  }
}

.view-full-guide {
  font-size: 22px;
  line-height: 36px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: $dark-grey-4;

  a {
    color: $dark-grey-4;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: max-content;
    transition: color 0.1s linear;
  }

  a:hover {
    color: $electric-blue;
  }

  svg {
    width: 32px;
    height: 32px;
    padding: 2px;
    box-sizing: border-box;
    margin-left: 12px;
  }
}

.scroll-to-verify {
  margin-bottom: 24px;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 36px;
  color: $electric-blue;
  cursor: pointer;

  a:hover {
    opacity: 0.9;
  }
  svg {
    transform: rotate(180deg);
  }
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.integration-section {
  .integration-section-header {
    padding: 0 96.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .todo-list {
      padding: 0;

      ol,
      li {
        margin: 0;
      }
    }

    .button {
      padding: 16px 24px;
    }
  }

  .integration-section-body {
    padding-top: 24px;
    padding-left: 96.5px;
    padding-right: 96.5px;
    font-size: 22px;
    line-height: 36px;
    width: 780px;
    letter-spacing: -0.3px;

    p {
      margin: 0;
      color: #333333;
    }

    &.integration-section-body__audiences-1 {
      padding-top: 16px;
    }

    &.integration-section-body__audiences-2 {
      display: flex;
      flex-direction: column;
      padding-top: 64px;
      width: 694px;

      p {
        font-size: 22px;
        line-height: 36px;
        margin-bottom: 16px;
      }

      small {
        font-size: 16px;
        line-height: 18px;
        color: #666666;
      }
    }

    &.integration-section-body__audiences-3 {
      padding-top: 64px;
      width: 694px;

      p {
        letter-spacing: normal;
        margin-bottom: 48px;
      }
    }
  }
}

.highlight {
  background-color: $integration-light-blue;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  padding: 0 5px;
}

.status {
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  padding: 16px 24px;
  line-height: 16px;

  &.installed,
  &.not-installed {
    display: flex;
    align-items: center;
  }

  &.installed {
    background-color: $success;
    color: white;

    svg {
      width: 16px;
      height: 16px;
      margin-right: 12px;
    }
  }

  &.loading {
    background-color: $white;
    color: $success;
    padding: 16.5px 24px;

    &.loading--grey {
      background-color: $dark-grey-7;
    }

    svg {
      width: 10px;
      height: 10px;
      margin-right: 12px;
      box-sizing: border-box;
      color: $success;
    }
  }

  &.not-installed {
    background-color: #aeaeae;
    color: white;

    padding: 15px 24px;

    svg {
      width: 18px;
      height: 18px;
      padding: 2px;
      margin-right: 12px;
      box-sizing: border-box;
    }
  }
}

.integration-todo,
.integration-section {
  svg {
    width: 16px;
    height: 20px;
    overflow: visible;

    margin-right: 12px;
  }
  svg:last-child {
    margin-left: 8px;
  }
}

.integration-footer {
  width: 1024px;
  margin-top: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  text-align: center;

  .button {
    font-size: 18px;
    font-weight: 500;
    height: 64px;
  }

  .footnote {
    font-size: 16px;
    line-height: 16px;
    margin-top: 24px;
    color: #666666;
  }
}
.integration-success {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 100%;
  background: linear-gradient(
    122.14deg,
    $electric-chart-main-color-gradient 0%,
    $electric-blue 69.29%
  );

  .heading-1 {
    margin: 24px;
    color: $white;
  }

  p {
    margin: 0;
    color: rgba($white, 0.8);
    font-style: normal;
    font-weight: normal;
    font-size: 22px;
    line-height: 34px;
  }

  .multi-icons {
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    margin: 24px;

    .multi-icons__checkmark {
      position: absolute;
      color: $white;

      svg {
        height: 40px;
        width: 40px;
      }
    }

    $background-gradient: to right bottom, rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) $diameter / 2, rgba(255, 255, 255, 0);

    .multi-icons__circle {
      border-radius: 50%;
      height: $diameter;
      width: $diameter;
      padding: 10px;
      background: linear-gradient($background-gradient);

      .multi-icons__circle-border {
        height: $diameter;
        width: $diameter;
        border-radius: 50%;
        background: $electric-blue;
      }
    }
  }
}

.verify-installation {
  margin-top: 64px;

  &.verify-installation--grey {
    box-shadow: initial;
    background: $dark-grey-7;
  }

  .verify-installation__row {
    display: flex;
    flex-direction: row;
    justify-content: start;

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    p {
      margin: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;

      svg {
        margin-right: 10px;
        width: 16px;
        height: 17px;
        overflow: visible;
      }
    }

    .input {
      margin-right: 20px;
    }

    .button {
      padding: 15px 32px;
      margin-right: 56px;
    }
  }
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text-status {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;

  display: flex;
  align-items: center;

  &.not-installed {
    color: $dark-grey-1;
  }
  &.installed {
    color: $success;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
