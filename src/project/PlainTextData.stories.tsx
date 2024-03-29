import { ComponentStory, ComponentMeta } from '@storybook/react';
import { manipulateData } from '../util/projectData';
import { PlainTextData } from './PlainTextData';
import mockData from "../api/data.json"
import { handleProjectLoaded } from '../actions/root.reducer';
import { TogglProjectResponse } from '../types';
import { Map, Set } from "immutable";

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

const { projectData: projectLoaded } = handleProjectLoaded("2022-02-22", mockData as unknown as TogglProjectResponse, 5, 30, Set<string>())
const projectData = manipulateData(projectLoaded, 5, 30, Map<string, number>(), Set<string>(), Set<string>(), [])

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
