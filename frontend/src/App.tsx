import useFetch from 'use-http';
import './App.css';
import { ProjectGrid } from "./project/projectGrid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import moment from 'moment';
import { enumeratePastMondays } from './util/generateDate';
import { useProjectFetch } from './api/toggl';
import { Card, Container, FormGroup, Grid, TextField } from '@mui/material';
import { useLocalStorage } from './util/useLocalStorage';
import { Box } from '@mui/system';

function App() {
  const [state, setState] = useState(() => ({
    start: moment().day(1).format("YYYY-MM-DD"),
    weekLength: 5,
  }))

  const [localStorageKey, setKey] = useLocalStorage("key", "");
  const [localStorageWid, setWid] = useLocalStorage("wid", "");
  const [loading, error, project] = useProjectFetch(state.start, localStorageKey, localStorageWid)

  const dateSelection = enumeratePastMondays(moment(), 10)
  return (
    <>
      {/* {error && 'Error!'}
      {loading && 'Loading...'} */}
      <Container fixed>
        <Card elevation={1} style={{marginBottom: 15, marginTop: 15}}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label">Start</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.start}
                  label="Start"
                  onChange={(e) => { setState((prev) => ({ ...prev, start: e.target.value })) }}
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
                  onChange={(e) => { setState((prev) => ({ ...prev, weekLength: parseInt(`${e.target.value}`, 10) })) }}
                >
                  <MenuItem value={7}>Whole Week</MenuItem>
                  <MenuItem value={5}>Workdays</MenuItem>
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
          project?.data && <ProjectGrid weekLength={state.weekLength} projects={project.data} totals={project.weekTotals} headers={project.headers || []}></ProjectGrid>
        }
      </Container>
    </>
  )
}

export default App;
