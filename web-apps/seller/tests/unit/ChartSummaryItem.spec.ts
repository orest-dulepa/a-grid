import { shallowMount } from '@vue/test-utils';
import ChartSummaryItem from '@/components/ui/ChartSummaryItem.vue';

describe('ChartSummaryItem.vue', () => {
  it('renders props.msg when passed', () => {
    const title = 'Total Views';
    const stat = 123;
    const wrapper = shallowMount(ChartSummaryItem, {
      propsData: { title, stat },
    });
    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(stat.toString());
  });
});
