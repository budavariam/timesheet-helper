import { ComponentStory, ComponentMeta } from '@storybook/react';
import { manipulateData } from '../util/projectData';
import { PlainTextData } from './PlainTextData';
import mockData from "../api/data.json"
import { handleProjectLoaded } from '../App';

export default {
  title: 'Components/PlainTextData',
  story: PlainTextData,
  argTypes: {},
  docs: {
    description: {
      component: 'Adjustable cell value.',
    }
  },
} as ComponentMeta<typeof PlainTextData>;

const Template: ComponentStory<typeof PlainTextData> = (args) => <PlainTextData {...args} />;

const { projectData: projectLoaded } = handleProjectLoaded("2022-02-22", mockData as any, 5, 30)
const projectData = manipulateData(projectLoaded, 5, 30, {}, {}, [])

export const Primary = Template.bind({});
Primary.args = {
  projectData
};
Primary.parameters = {
  docs: {
    description: {
      story: '...',
    }
  },
};
