<template>
  <teleport to="body" name="deploy">
    <div class="modal-overlay" v-show="modal">
      <div v-if="!live && state.status === 'ready'" class="modal">
        <div class="modal-head">
          <div class="modal-title">Deploy audience</div>
          <div class="modal-close" @click="hide()">&#10006;</div>
        </div>
        <div class="modal-content">
          <div class="modal-name__title">AUDIENCE NAME</div>
          <div class="modal-name">{{ state.name }}</div>
          <div class="modal-name__title">Select DSP</div>
          <div class="modal-dsp">
            <label class="dsp-item" :class="{ 'item-active': dsp === 'xandr' }">
              <input
                v-model="dsp"
                value="xandr"
                class="dsp-input"
                type="radio"
              />
              <div class="dsp-check"></div>
              <img src="/src/assets/xandr_press_logo.png" alt="" />
            </label>
            <label
              class="dsp-item"
              :class="{ 'item-active': dsp === 'd&v360' }"
            >
              <input
                v-model="dsp"
                value="d&v360"
                class="dsp-input"
                type="radio"
              />
              <div class="dsp-check"></div>
              <img src="/src/assets/image360.png" alt="" />
            </label>
          </div>
          <button
            @click="deployItem"
            class="modal-button"
            :class="{ 'button-active': dsp }"
          >
            <img src="/src/assets/deploy.svg" alt="" />
            Deploy
          </button>
        </div>
      </div>
      <div v-else class="modal">
        <div class="modal-head">
          <div class="modal-title">
            <div class="modal-checked"></div>
            live
          </div>
          <div class="modal-close" @click="hide()">&#10006;</div>
        </div>
        <div class="modal-content">
          <div class="modal-name__title">AUDIENCE NAME</div>
          <div class="modal-name">
            {{ state.description || state.name }}
          </div>
          <div class="modal-name__title">AUDIENCE DEAL ID</div>
          <div class="modal-name">{{ Date.now() }}</div>
          <a class="modal-link" href="#" target="_blank">Link</a>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeployModal',
  emits: ['closeModal'],
  props: ['showModal', 'modalData'],
  data() {
    return {
      modal: false,
      dsp: null,
      live: false,
      state: {},
    };
  },
  methods: {
    hide() {
      this.$emit('closeModal');
      this.modal = false;
      this.dsp = null;
      this.live = false;
    },
    deployItem() {
      this.state.status = 'live';
      this.live = true;
    },
  },
  watch: {
    showModal() {
      //disable scroll body when modal is open
      this.state = this.modalData;
      this.showModal
        ? (document.body.style.overflow = 'hidden')
        : (document.body.style.overflow = 'auto');
      this.modal = this.showModal;
    },
  },
});
</script>

<style lang="scss">
@import 'src/styles/colors.scss';
@import 'src/styles/shadows.scss';

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(7, 7, 7, 0.8);

  &.modal-opened {
    & + body {
      overflow: hidden;
    }
  }

  .modal {
    position: relative;
    z-index: 2;
    width: 400px;
    background: $white;
    box-shadow: $shadow-1;
    border-radius: 10px;
    padding: 32px;
    box-sizing: border-box;
    &-checked {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: clr-primary-light-blue;
      background-image: url('src/assets/check-blue.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 10px 16px;
      margin-right: 12px;
    }
    &-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-title {
      color: $black;
      font-size: 20px;
      line-height: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
    }

    &-close {
      font-size: 24px;
      line-height: 29px;
      text-align: center;
      color: $color-3;
      cursor: pointer;
    }

    &-name {
      color: $clr-typo-titles;
      font-size: 14px;
      line-height: 14px;

      &__title {
        margin-top: 32px;
        color: $grey-7;
        font-size: 11px;
        line-height: 14px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
    }
    &-link {
      display: block;
      font-size: 14px;
      line-height: 14px;
      font-weight: 500;
      color: $clr-primary-blue;
      text-decoration: none;
      padding-top: 10px;
    }

    &-dsp {
      margin-top: 4px;

      .dsp-item {
        padding: 12px;
        position: relative;
        display: flex;
        align-items: center;
        width: 336px;
        height: 48px;
        border: 1px solid $grey-2;
        box-sizing: border-box;
        border-radius: 6px;
        margin-bottom: 10px;

        &.item-active {
          border: 1px solid $clr-primary-blue;
          box-shadow: $shadow-2;

          .dsp-check {
            border: 7px solid $clr-primary-blue;
          }
        }

        img {
          height: 22px;
        }
      }

      .dsp-check {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid $grey-3;
        box-sizing: border-box;
        position: relative;
        left: -16px;
      }

      .dsp-input {
        visibility: hidden;
      }
    }

    &-button {
      font-family: Inter, sans-serif;
      margin-top: 32px;
      width: 100%;
      border: none;
      outline: none;
      background: rgb(44 94 246 / 50%);
      border-radius: 6px;
      color: $white;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;

      &.button-active {
        cursor: pointer;
        background: $clr-typo-titles;
        pointer-events: auto;
        &:hover {
          background: $clr-primary-blue;
        }
      }

      img {
        width: 10px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }
}
</style>
