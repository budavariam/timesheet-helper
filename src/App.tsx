import './App.css';
import { useReducer } from 'react';
import moment from 'moment';
import { ProjectGrid } from "./project/ProjectGrid";
import { Map, Set } from "immutable";
import { enumeratePastMondays } from './util/generateDate';
import { useProjectFetch } from './api/toggl';
import { Container } from '@mui/material';
import { useLocalStorage } from './util/useLocalStorage';
import { PlainTextData } from './project/PlainTextData';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProjectData, RootReducer } from './types';
import { rootReducer } from './actions/root.reducer';

function App() {
  const [state, dispatch] = useReducer<RootReducer>(rootReducer, {
    start: moment().day(1).format("YYYY-MM-DD"),
    weekLength: 5,
    rounding: 30,
    adjustments: Map<string, number>(),
    ignoreProjects: Set<string>(),
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
