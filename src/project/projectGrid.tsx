import { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Project, ProjectData } from '../types';
import { formatDuration } from '../util/format';
import "./Duration.css"
import { Duration } from './Duration';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}:last-child, &.${tableCellClasses.body}:last-child`]: {
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0, // hide last border
    backgroundColor: theme.palette.grey[100],
  },
}));

export function ProjectGrid(props: any) {
  const projectData: ProjectData = props.projectData
  const dispatch: Function = props.dispatch
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            {projectData.headers.map((day, i) => <StyledTableCell key={i} align="center">{day}</StyledTableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {projectData.projects.map((project: Project) => (
            <TableRow
              key={project.uuid}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <span style={{ color: project.hexColor }}>{project.client} {project.project}</span>
              </TableCell>
              {project.totals.map((num, i) => <StyledTableCell key={i} align="center"><Duration value={num} dispatch={dispatch} adjustable={i !== project.totals.length - 1}/></StyledTableCell>)}
            </TableRow>
          ))}
          <StyledTableRow>
            <StyledTableCell>Totals</StyledTableCell>
            {projectData.totals.map((num, i) => <StyledTableCell key={i} align="center"><Duration value={num} dispatch={dispatch} adjustable={false}/></StyledTableCell>)}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}