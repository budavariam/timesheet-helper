import { useCallback } from 'react';
import { Project } from '../types';
import { formatDuration } from '../util/format';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const filterByWeekLength = (weekLength: number) => (e: any, i: number) => {
  return !(weekLength === 5 && (i === 5 || i === 6))
}

export function ProjectDataGrid(props: any) {
  const projects: Project[] = props.projects;
  const totals: number[] = props.totals;
  const headers: string[] = props.headers
  const weekLength: number = props.weekLength
  const weekFilter = useCallback(filterByWeekLength(weekLength), [weekLength])

  const rows: GridRowsProp = projects.map((project: Project) => {
    const title: (string | number)[] = [`${project.client} ${project.project}`]
    return {
      id: project.uuid,
      ...(
        title.concat(project.totals.map((num) => formatDuration(num))))
        .filter(weekFilter)
        .reduce(((acc: any, curr: any, i) => { acc["col" + (i)] = curr; return acc; }), {})
    }
  })//.concat(totals.map((num, i) => formatDuration(num)).filter(weekFilter))

  const columns: GridColDef[] = ["Name"].concat(headers.filter(weekFilter)).map((day, i) => ({ field: "col" + i, headerName: day, width: 120 }))

  console.log(rows, columns)

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rowHeight={25} rows={rows} columns={columns} />
    </div>
  );
}