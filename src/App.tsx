import './App.css';
import { useReducer } from 'react';
import moment from 'moment';
import { ProjectGrid } from "./project/ProjectGrid";
import { Map, Set } from "immutable";
import { enumeratePastMondays } from './util/generateDate';
import { useProjectFetch } from './api/toggl';
import { Container, FormControl, Grid, TextField } from '@mui/material';
import { useLocalStorage } from './util/useLocalStorage';
import { PlainTextData } from './project/PlainTextData';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProjectData, RootReducer, RootState } from './types';
import { rootReducer } from './actions/root.reducer';
import { DISPATCH_ACTION } from './util/const';

function App() {
  const [localStorageKey, setKey] = useLocalStorage("key", "");
  const [localStorageWid, setWid] = useLocalStorage("wid", "");
  const [localStorageWebsite, setWebsite] = useLocalStorage("website", "");
  const [localStorageIgnore, setIgnore] = useLocalStorage("ignore", "");

  const [state, dispatch] = useReducer<RootReducer, RootState>(rootReducer, {
    start: moment().day(1).format("YYYY-MM-DD"),
    weekLength: 5,
    hideIgnored: false,
    rounding: 30,
    adjustments: Map<string, number>(),
    ignoreProjects: Set<string>(),
    autoIgnoreProjects: Set<string>(),
    projectOrder: [],
    projectData: {
      projects: [],
      totals: [],
      headers: [],
      adjustments: Map<string, number>(),
      ignoreProjects: Set<string>(),
      totalAdjustments: [],
    } as ProjectData,
    originalProjectData: {
      projects: [],
      totals: [],
      headers: [],
      adjustments: Map<string, number>(),
      ignoreProjects: Set<string>(),
      totalAdjustments: [],
    } as ProjectData
  }, (state: RootState) => {
    let autoIgnoreProjects = state.autoIgnoreProjects
    const extendedList = localStorageIgnore.split(",").map((e: string) => e.trim()).filter((e: string) => e)
    for (const item of extendedList) {
      autoIgnoreProjects = autoIgnoreProjects.add(item)
    }
    debugger
    return {
      ...state,
      autoIgnoreProjects: autoIgnoreProjects,
    }
  })

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
            hideIgnored={state.hideIgnored}
            projectData={state.projectData}
          ></ProjectGrid>
        }
        {localStorageWebsite && <iframe src={localStorageWebsite} className="external-site" title="Import data" width="100%" height="500px"></iframe>}
        <PlainTextData projectData={state.projectData} />
        <Grid item>
          <FormControl fullWidth margin="dense">
            <TextField
              id="ignore"
              value={(localStorageIgnore as string)}
              label="Auto Ignore Client"
              variant="standard"
              type="text"
              fullWidth={true}
              onChange={(e) => {
                const ignoreProjects = e.target.value
                setIgnore(ignoreProjects)
                dispatch({
                  type: DISPATCH_ACTION.REPLACE_IGNORED,
                  value: "",
                  autoIgnoreProjects: ignoreProjects.split(",").map(e => e.trim())
                })
              }}
            />
          </FormControl>
        </Grid>
        {state.autoIgnoreProjects.toString()}
        <Footer />
      </Container>
    </>
  )
}

export default App;
