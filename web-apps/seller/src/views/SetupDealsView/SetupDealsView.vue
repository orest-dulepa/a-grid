<template>
  <container class="setup-deals" is-large="true">
    <div class="setup-deals__steps-wrapper">
      <container class="setup-deals__steps-container">
        <div class="setup-deals__steps">
          <template v-for="(step, index) in steps">
            <div
              :key="step.name"
              class="setup-deals__step"
              :class="{
                'setup-deals__step--active': step.active,
                'setup-deals__step--done': step.done,
              }"
              @click="step.done && prevStep(index)"
            >
              <div class="setup-deals__step-indicator">
                <template v-if="step.done">
                  <checkmark-icon />
                </template>
                <template v-else>
                  {{ index + 1 }}
                </template>
              </div>
              <p class="setup-deals__step-name">
                {{ step.name }}
              </p>
            </div>
          </template>
        </div>
      </container>
    </div>
    <div class="setup-deals__container">
      <transition name="fade" mode="out-in">
        <template v-if="isInitialStep">
          <initial-step @next-step="nextStep" />
        </template>
        <template v-for="step in steps">
          <component
            v-if="step.active"
            :key="step.name"
            :is="step.component"
            @prev-step="prevStep"
            @next-step="nextStep"
          />
        </template>
        <template v-if="isFinalStep">
          <final-step @start-over="startOver" />
        </template>
      </transition>
    </div>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { scrollTop } from '@/utils';
import Container from '@/components/layout/Container.vue';
import CheckmarkIcon from '@/components/ui/icons/Checkmark.svg?inline';
import InitialStep from './steps/InitialStep.vue';
import FinalStep from './steps/FinalStep.vue';
import KeyValueStep from './steps/KeyValueStep.vue';
import AdvertiserStep from './steps/AdvertiserStep.vue';
import InsertionStep from './steps/InsertionStep.vue';
import LineItemStep from './steps/LineItemStep.vue';

@Component({
  components: {
    Container,
    InitialStep,
    FinalStep,
    KeyValueStep,
    AdvertiserStep,
    InsertionStep,
    LineItemStep,
    CheckmarkIcon,
  },
})
export default class SetupDealsView extends Vue {
  steps = [
    {
      name: 'Create Key/Value',
      active: false,
      done: false,
      component: 'KeyValueStep',
    },
    {
      name: 'Create an Advertiser',
      active: false,
      done: false,
      component: 'AdvertiserStep',
    },
    {
      name: 'Create an Insertion Order',
      active: false,
      done: false,
      component: 'InsertionStep',
    },
    {
      name: 'Create a Line Item',
      active: false,
      done: false,
      component: 'LineItemStep',
    },
  ];
  nextStep(): void {
    const currentStep = this.steps.findIndex((item) => item.active);
    if (currentStep < 0) {
      this.steps[0].active = true;
    } else {
      this.steps[currentStep].done = true;
      this.steps[currentStep].active = false;
      if (currentStep < this.steps.length - 1) {
        this.steps[currentStep + 1].active = true;
      }
    }
    scrollTop();
  }
  prevStep(stepIndex: number): void {
    if (stepIndex !== undefined) {
      this.steps.forEach((_, index) => {
        if (index >= stepIndex) {
          this.steps[index].active = false;
          this.steps[index].done = false;
        }
      });
      this.steps[stepIndex].active = true;
    } else {
      const currentStep = this.steps.findIndex((item) => item.active);
      if (currentStep === 0) {
        this.steps[currentStep].active = false;
      } else {
        this.steps[currentStep].active = false;
        this.steps[currentStep - 1].done = false;
        this.steps[currentStep - 1].active = true;
      }
    }
    scrollTop();
  }

  startOver(): void {
    this.prevStep(0);
  }

  get isInitialStep(): boolean {
    return this.steps.every((item) => !item.done && !item.active);
  }

  get isFinalStep(): boolean {
    return this.steps.every((item) => item.done);
  }
}
</script>

<style lang="scss" scoped>
$steps-container-height: 104px;

.setup-deals {
  margin-top: 40px;
}
.setup-deals__steps-wrapper {
  background-color: $white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  height: 64px;
}
.setup-deals__steps-container {
  padding: 15px 0;
  margin-top: 0;
}
.setup-deals__steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setup-deals__step {
  display: flex;
  align-items: center;

  &--done {
    cursor: pointer;
  }
}
.setup-deals__step-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid $grey-2;
  margin-right: 16px;

  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  color: $dark-grey-1;

  transition: color 0.3s ease-out, border-color 0.3s ease-out;

  .setup-deals__step--active & {
    border-color: rgba($electric-blue, 0.5);
    color: $electric-blue;
  }
  .setup-deals__step--done & {
    border-color: $electric-blue;
    color: $white;
    background-color: $electric-blue;
  }

  svg {
    width: 16px;
    height: initial;
  }
}
.setup-deals__step-name {
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: $dark-grey-1;
  margin: 0;
  transition: color 0.3s ease-out;

  .setup-deals__step--active & {
    color: $electric-blue;
  }
  .setup-deals__step--done & {
    color: $dark-grey-4;
  }
}
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
  opacity: 0;
}
</style>
