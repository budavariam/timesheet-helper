import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CopyToClipboard } from './CopyToClipboard';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/CopyToClipboard',
  component: CopyToClipboard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CopyToClipboard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CopyToClipboard> = (args) => <CopyToClipboard {...args} />;

export const LoremIpsum = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LoremIpsum.args = {
  data: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae, ullam.",
};