import useFetch from 'use-http';
import './App.css';
import { ProjectGrid } from "./project/projectGrid";

function App() {
  const { loading, error, data = [] } = useFetch('/project', {}, [])
  return (
    <>
      {error && 'Error!'}
      {loading && 'Loading...'}
      {
        data?.data && <ProjectGrid projects={data.data} totals={data.weekTotals}></ProjectGrid>
      }
    </>
  )
}

export default App;
