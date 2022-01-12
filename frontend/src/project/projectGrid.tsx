import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Project } from '../types';
import { formatDuration } from '../util/format';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}:last-child`]: {
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
  const projects: Project[] = props.projects;
  const totals: number[] = props.totals;
  const dates: string[] = props.totals.map((_: any) => "-")
  dates[dates.length -1] = "Totals"
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            {dates.map((day, i) => <TableCell key={i} align="right">{day}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project: Project) => (
            <TableRow
              key={project.uuid}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <span style={{ color: project.hexColor }}>{project.client} {project.project}</span>
              </TableCell>
              {project.totals.map((num, i) => <StyledTableCell key={i} align="right">{formatDuration(num)}</StyledTableCell>)}
            </TableRow>
          ))}
          <StyledTableRow>
            <StyledTableCell>Totals</StyledTableCell>
            {totals.map((num, i) => <StyledTableCell key={i} align="right">{formatDuration(num)}</StyledTableCell>)}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}