import './App.css';
import { useReducer } from 'react';
import moment from 'moment';
import { ProjectGrid } from "./project/ProjectGrid";
import { enumeratePastMondays } from './util/generateDate';
import { useProjectFetch } from './api/toggl';
import { Container } from '@mui/material';
import { useLocalStorage } from './util/useLocalStorage';
import { Project, ProjectData, TogglProjectResponse } from './types';
import { manipulateData, processProjectData } from './util/projectData';
import { DEFAULT_ADJUSTMENT, DISPATCH_ACTION } from './util/const';
import { PlainTextData } from './project/PlainTextData';
import { Header } from './Header';
import { Footer } from './Footer';

export function handleProjectLoaded(start: string, rawData: TogglProjectResponse, weekLength: number, rounding: number) {
  const dateFrom = start
  const dateTo = moment(start).add(7, 'days').format("YYYY-MM-DD")
  const originalProjectData = processProjectData(rawData, dateFrom, dateTo)
  const projectOrder = originalProjectData.projects.map(e => e.uuid)
  const projectData = manipulateData(originalProjectData, weekLength, rounding, {}, {}, projectOrder)
  return {
    projectData,
    originalProjectData,
    projectOrder,
  }
}

function reducer(state: any, action: { type: string, value: any, projectID?: string, columnIndex?: number }) {
  if (!action || !action.type) {
    console.warn("Empty action")
    return state
  }
  // console.log("X", state, action)
  switch (action.type) {
    case DISPATCH_ACTION.PROJECT_LOADED: {
      const { projectData, originalProjectData, projectOrder } = handleProjectLoaded(
        state.start, action.value, state.weekLength, state.rounding
      )
      return { ...state, projectData, originalProjectData, adjustments: {}, ignoreProjects: {}, projectOrder }
    }
    case DISPATCH_ACTION.ORDER_CHANGED: {
      const uuid = action.value
      const currIndex = state.projectOrder.indexOf(uuid);
      if (currIndex === 0) {
        return state
      }
      const newOrder = [...state.projectOrder]
      newOrder.splice(
        currIndex - 1, // starting form the item above
        2,  // remove 2 items
        state.projectOrder[currIndex], // add the selected item first
        state.projectOrder[currIndex - 1]) // then the one before it
      return {
        ...state,
        projectOrder: newOrder,
        projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, state.adjustments, state.ignoreProjects, newOrder),
      }
    }
    case DISPATCH_ACTION.WEEK_LENGTH_CHANGED: {
      const weekLength = (action.value as number)
      return {
        ...state,
        weekLength,
        projectData: manipulateData(state.originalProjectData, weekLength, state.rounding, state.adjustments, state.ignoreProjects, state.projectOrder),
      }
    }
    case DISPATCH_ACTION.START_CHANGED: {
      return { ...state, start: (action.value as string) }
    }
    case DISPATCH_ACTION.ROUNDING_CHANGED: {
      const rounding = (action.value as number)
      return {
        ...state,
        rounding,
        projectData: manipulateData(state.originalProjectData, state.weekLength, rounding, state.adjustments, state.ignoreProjects, state.projectOrder),
      }
    }
    case DISPATCH_ACTION.IGNORE_PROJECT_TOGGLE: {
      const projectID = action.projectID || ""
      const proj = state.projectData.projects.filter((e: Project) => e.uuid === projectID)[0]
      if (!proj) {
        return state
      }
      let ignoreProjects = {} as any
      if (proj.uuid in state.ignoreProjects) {
        ignoreProjects = {
          ...state.ignoreProjects,
        }
        delete ignoreProjects[proj.uuid]
      } else {
        ignoreProjects = {
          ...state.ignoreProjects,
          [proj.uuid]: true,
        }
      }
      return {
        ...state,
        ignoreProjects,
        projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, state.adjustments, ignoreProjects, state.projectOrder)
      }
    }
    case DISPATCH_ACTION.ADJUST: {
      const projectID = action.projectID || ""
      const columnIndex = action.columnIndex || 0
      if (!projectID) {
        return state
      }
      const adjustments = { ...state.adjustments }
      const adjustmentKey = `${projectID}-${columnIndex}`
      if (!(adjustmentKey in adjustments)) {
        // add default colindex value if missing
        adjustments[adjustmentKey] = 0
      }
      // adjust data
      adjustments[adjustmentKey] += (action.value as number) * ((state.rounding || DEFAULT_ADJUSTMENT) * 60 * 1000)

      return {
        ...state,
        adjustments,
        projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, adjustments, state.ignoreProjects, state.projectOrder),
      }
    }
    default: {
      console.warn("Unknown action", action)
    }
  }
  // console.log(action)
  return state
}


function App() {
  const [state, dispatch] = useReducer(reducer, {
    start: moment().day(1).format("YYYY-MM-DD"),
    weekLength: 5,
    rounding: 30,
    adjustments: {},
    projectOrder: {},
    projectData: {
      projects: [],
      totals: [],
      headers: [],
      adjustments: [],
      ignoreProjects: {},
      totalAdjustments: [],
    } as ProjectData
  })

  const [localStorageKey, setKey] = useLocalStorage("key", "");
  const [localStorageWid, setWid] = useLocalStorage("wid", "");
  const [localStorageWebsite, setWebsite] = useLocalStorage("website", "");
  useProjectFetch(state.start, localStorageKey, localStorageWid, dispatch)

  const dateSelection = enumeratePastMondays(moment(), 10)
  return (
    <>
      {/* {error && 'Error!'}
      {loading && 'Loading...'} */}
      <Container fixed>
        <Header
          state={state}
          dispatch={dispatch}
          dateSelection={dateSelection}
          localStorageKey={localStorageKey}
          setKey={setKey}
          localStorageWid={localStorageWid}
          setWebsite={setWebsite}
          localStorageWebsite={localStorageWebsite}
          setWid={setWid}
        />
        {
          state?.projectData && <ProjectGrid
            dispatch={dispatch}
            projectData={state.projectData}
          ></ProjectGrid>
        }
        {localStorageWebsite && <iframe src={localStorageWebsite} className="external-site" title="Import data" width="100%" height="500px"></iframe>}
        <PlainTextData projectData={state.projectData} />
        <Footer />
      </Container>
    </>
  )
}

export default App;
