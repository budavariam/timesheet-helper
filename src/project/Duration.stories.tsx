import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Duration } from './Duration';

export default {
  title: 'Components/Duration',
  story: Duration,
  argTypes: {},
  docs: {
    description: {
      component: 'Adjustable cell value.',
    }
  },
} as ComponentMeta<typeof Duration>;

const Template: ComponentStory<typeof Duration> = (args) => <Duration {...args} />;

const timeValue = 4 * 3600 * 1000
const adjustment = 1 * 3600 * 1000
const dispatch = (action: any) => { console.log("Dispatched", action) }

export const APrimary = Template.bind({});
APrimary.args = {
  num: 2 * timeValue + adjustment,
  dispatch,
  adjusted: adjustment,
  hideInfo: true,
  showEmpty: true,
  adjustable: true,
};
APrimary.parameters = {
  docs: {
    description: {
      story: '...',
    }
  },
};

export const HideAdjustedValue = Template.bind({});
HideAdjustedValue.args = {
  num: timeValue + adjustment,
  dispatch,
  adjusted: adjustment,
  hideInfo: true,
  showEmpty: true,
  adjustable: true,
};
HideAdjustedValue.parameters = {
  docs: {
    description: {
      story: 'Do not show if this value is adjusted or not.',
    }
  },
};
export const NonAdjustable = Template.bind({});
NonAdjustable.args = {
  num: timeValue + adjustment,
  dispatch,
  adjusted: adjustment,
  hideInfo: true,
  showEmpty: true,
  adjustable: false,
};
NonAdjustable.parameters = {
  docs: {
    description: {
      story: 'Can not change the value.',
    }
  },
};
export const ShowPlusAdjust = Template.bind({});
ShowPlusAdjust.args = {
  num: timeValue + adjustment,
  dispatch,
  adjusted: adjustment,
  hideInfo: false,
  showEmpty: true,
  adjustable: true,
};
ShowPlusAdjust.parameters = {
  docs: {
    description: {
      story: `Show +${adjustment}ms adjustment.`,
    }
  },
};
export const ShowMinusAdjust = Template.bind({});
ShowMinusAdjust.args = {
  num: timeValue - adjustment,
  dispatch,
  adjusted: -adjustment,
  hideInfo: false,
  showEmpty: true,
  adjustable: true,
};
ShowMinusAdjust.parameters = {
  docs: {
    description: {
      story: `Show -${adjustment}ms adjustment.`,
    }
  },
};
export const ShowZeroValue = Template.bind({});
ShowZeroValue.args = {
  num: 0,
  dispatch,
  adjusted: 0,
  hideInfo: false,
  showEmpty: true,
  adjustable: true,
};
ShowZeroValue.parameters = {
  docs: {
    description: {
      story: `Showing up empty value is relevant to know that a value hadd an original value, it was just adjusted to a 0.`,
    }
  },
};

export const HideZeroValue = Template.bind({});
HideZeroValue.args = {
  num: 0,
  dispatch,
  adjusted: 0,
  hideInfo: false,
  showEmpty: false,
  adjustable: true,
};
HideZeroValue.parameters = {
  docs: {
    description: {
      story: `Hiding empty value is relevant to know that a value didn't have an original value, it was originally 0.`,
    }
  },
};
