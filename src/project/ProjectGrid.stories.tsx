import { ComponentStory, ComponentMeta } from '@storybook/react';
import { manipulateData } from '../util/projectData';
import { ProjectGrid } from './ProjectGrid';
import mockData from "../api/data.json"
import { handleProjectLoaded } from '../actions/root.reducer';;
import { action } from '@storybook/addon-actions';
import { TogglProjectResponse } from '../types';
import { Map, Set } from 'immutable';

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
const { projectData: projectLoaded } = handleProjectLoaded("2022-02-22", mockData as unknown as TogglProjectResponse, 7, 30)
const projectData = manipulateData(projectLoaded, 5, 30, Map<string, number>(), Set<string>(), [])

export const Primary = Template.bind({});
Primary.args = {
  projectData,
  dispatch,
};
Primary.parameters = {
  docs: {
    description: {
      story: '...',
    }
  },
};
