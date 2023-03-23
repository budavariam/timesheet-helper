import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Map, Set } from 'immutable';

import { TogglProjectResponse } from '../types';
import mockData from "../api/data.json"

import { manipulateData } from '../util/projectData';
import { ProjectGrid } from './ProjectGrid';
import { handleProjectLoaded } from '../actions/root.reducer';

export default {
  title: 'Components/ProjectGrid',
  story: ProjectGrid,
  argTypes: {},
  docs: {
    description: {
      component: 'Adjustable cell value.',
    }
  },
} as ComponentMeta<typeof ProjectGrid>;

const Template: ComponentStory<typeof ProjectGrid> = (args) => <ProjectGrid {...args} />;

const dispatch = action('dispatch-event')
const { projectData: projectLoaded } = handleProjectLoaded("2022-02-22", mockData as unknown as TogglProjectResponse, 7, 30, Set<string>())
const hideIgnored = false
const projectData = manipulateData(projectLoaded, 5, 30, Map<string, number>(), Set<string>(), Set<string>(), [])

export const Primary = Template.bind({});
Primary.args = {
  projectData,
  hideIgnored,
  dispatch,
};
Primary.parameters = {
  docs: {
    description: {
      story: '...',
    }
  },
};
