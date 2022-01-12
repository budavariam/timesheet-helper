import useFetch from 'use-http';
import './App.css';
import { ProjectGrid } from "./project/projectGrid";

function App() {
  const { loading, error, data = [] } = useFetch('/project/?from=2021-12-27&to=2022-01-05', {}, [])
  return (
    <>
      {error && 'Error!'}
      {loading && 'Loading...'}
      {
        data?.data && <ProjectGrid projects={data.data} totals={data.weekTotals} headers={data.headers || []}></ProjectGrid>
      }
    </>
  )
}

export default App;
