import './App.css';
import { useReducer } from 'react';
import moment from 'moment';
import { ProjectGrid } from "./project/projectGrid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { enumeratePastMondays } from './util/generateDate';
import { useProjectFetch } from './api/toggl';
import { Card, Container, Grid, TextField } from '@mui/material';
import { useLocalStorage } from './util/useLocalStorage';
import { ProjectData } from './types';
import { manipulateData, processProjectData } from './util/projectData';
import { DEFAULT_ADJUSTMENT, DISPATCH_ACTION } from './util/const';

function reducer(state: any, action: { type: string, value: any, projectID?: string, columnIndex?: number }) {
  if (!action || !action.type) {
    console.warn("Empty action")
    return state
  }
  console.log("X", state, action)
  switch (action.type) {
    case DISPATCH_ACTION.PROJECT_LOADED: {
      const dateFrom = state.start
      const dateTo = moment(state.start).add(7, 'days').format("YYYY-MM-DD")
      const originalProjectData = processProjectData(action.value, dateFrom, dateTo)
      const projectData = manipulateData(originalProjectData, state.weekLength, state.rounding, state.adjustments)
      return { ...state, projectData, originalProjectData, adjustments: {} }
    }
    case DISPATCH_ACTION.WEEK_LENGTH_CHANGED: {
      const weekLength = (action.value as number)
      return {
        ...state,
        weekLength,
        projectData: manipulateData(state.originalProjectData, weekLength, state.rounding, state.adjustments),
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
        projectData: manipulateData(state.originalProjectData, state.weekLength, rounding, state.adjustments),
      }
    }
    case DISPATCH_ACTION.ADJUST: {
      console.log("rounding", action)
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
        projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, adjustments),
      }
    }
    default: {
      console.warn("Unknown action", action)
    }
  }
  console.log(action)
  return state
}


function App() {
  const [state, dispatch] = useReducer(reducer, {
    start: moment().day(1).format("YYYY-MM-DD"),
    weekLength: 5,
    rounding: 30,
    adjustments: {},
    projectData: {
      projects: [],
      totals: [],
      headers: [],
    } as ProjectData
  })

  const [localStorageKey, setKey] = useLocalStorage("key", "");
  const [localStorageWid, setWid] = useLocalStorage("wid", "");
  const [loading, error, project] = useProjectFetch(state.start, localStorageKey, localStorageWid, dispatch)

  const dateSelection = enumeratePastMondays(moment(), 10)
  return (
    <>
      {/* {error && 'Error!'}
      {loading && 'Loading...'} */}
      <Container fixed>
        <Card elevation={1} style={{ marginBottom: 15, marginTop: 15 }}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label">Start</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.start}
                  label="Start"
                  onChange={(e) => { dispatch({ type: DISPATCH_ACTION.START_CHANGED, value: e.target.value }) }}
                >
                  {dateSelection.map((val) => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel id="week-length-label">Week length</InputLabel>
                <Select
                  labelId="week-length-label"
                  id="week-length"
                  value={state.weekLength}
                  label="Week Length"
                  onChange={(e) => { dispatch({ type: DISPATCH_ACTION.WEEK_LENGTH_CHANGED, value: parseInt(`${e.target.value}`, 10) }) }}
                >
                  <MenuItem value={7}>Whole Week</MenuItem>
                  <MenuItem value={5}>Workdays</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel id="rounding-lable">Round</InputLabel>
                <Select
                  labelId="rounding-label"
                  id="rounding"
                  value={state.rounding}
                  label="Rounding"
                  onChange={(e) => { dispatch({ type: DISPATCH_ACTION.ROUNDING_CHANGED, value: parseInt(`${e.target.value}`, 10) }) }}
                >
                  <MenuItem value={0}>No Rounding</MenuItem>
                  <MenuItem value={30}>30 minute</MenuItem>
                  <MenuItem value={60}>Hour</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth margin="dense">
                <TextField
                  id="apikey"
                  value={localStorageKey}
                  label="API Key"
                  variant="standard"
                  type="password"
                  onChange={(e) => {
                    setKey(e.target.value)
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth margin="dense">
                <TextField
                  id="workspaceid"
                  value={localStorageWid}
                  label="Workspace ID"
                  variant="standard"
                  type="password"
                  onChange={(e) => {
                    setWid(e.target.value)
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Card>
        {
          state?.projectData && <ProjectGrid dispatch={dispatch} weekLength={state.weekLength} projectData={state.projectData}></ProjectGrid>
        }
      </Container>
    </>
  )
}

export default App;
