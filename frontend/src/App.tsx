import useFetch from 'use-http';
import './App.css';
import { ProjectGrid } from "./project/projectGrid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import moment from 'moment';
import { enumeratePastMondays } from './util/generateDate';

function App() {
  const [start, setStart] = useState(() => moment().day(1).format("YYYY-MM-DD"))
  const { loading, error, data = [] } = useFetch(`/project/?from=${start}`, {}, [start])

  const dateSelection = enumeratePastMondays(start, 10)
  console.log(start, dateSelection)
  return (
    <>
      {error && 'Error!'}
      {loading && 'Loading...'}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Start</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={start}
          label="Start"
          onChange={(e) => { setStart(e.target.value) }}
        >
          {dateSelection.map((val) => <MenuItem key={val} value={val}>{val}</MenuItem>)}
        </Select>
      </FormControl>
      {
        data?.data && <ProjectGrid projects={data.data} totals={data.weekTotals} headers={data.headers || []}></ProjectGrid>
      }
    </>
  )
}

export default App;
