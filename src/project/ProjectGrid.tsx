import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Project, ProjectData, RootAction } from '../types';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Duration } from './Duration';
import { DISPATCH_ACTION } from '../util/const';
import "./ProjectGrid.css"

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

type ProjectGridProps = {
  projectData: ProjectData,
  hideIgnored: boolean,
  dispatch: React.Dispatch<RootAction>,
}

export function ProjectGrid(props: ProjectGridProps) {
  const { projectData, hideIgnored, dispatch } = props
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table" className={`${hideIgnored ? "hide-ignored" : ""}`}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <span
                className="ignoreProject"
                title={hideIgnored ? "Show hidden" : "Only show visible"}
                onClick={() => {
                  dispatch({ type: DISPATCH_ACTION.HIDE_IGNORED_TOGGLE, value: "" })
                }}
              >{hideIgnored
                ? <VisibilityIcon />
                : <VisibilityOffIcon />
                }
              </span>
            </StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            {projectData.headers.map((day, i) => <StyledTableCell key={i} align="center">{day}</StyledTableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {projectData.projects.map((project: Project, pi: number) => (
            <TableRow
              key={project.uuid}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              className={`${project.ignore ? "ignored" : ""}`}
            >
              <TableCell component="th" scope="row">
                <span className="ignoreProject" onClick={() => {
                  dispatch({ type: DISPATCH_ACTION.IGNORE_PROJECT_TOGGLE, value: project.uuid })
                }}>{project.ignore
                  ? <VisibilityOffOutlinedIcon />
                  : <VisibilityOutlinedIcon />
                  } </span>
              </TableCell>
              <TableCell component="th" scope="row" title="Move up one line..."
                className="clickable"
                onClick={() => {
                  dispatch({ type: DISPATCH_ACTION.ORDER_CHANGED, value: project.uuid })
                }}>
                <span style={{ color: project.hexColor }}>
                  {project.client} {project.project}
                </span>
              </TableCell>
              {project.totals.map((num, i) => (
                <StyledTableCell key={i} align="center">
                  <Duration
                    projectID={project.uuid}
                    columnIndex={i}
                    num={num}
                    dispatch={dispatch}
                    adjustable={i !== project.totals.length - 1}
                    adjusted={project.adjustments[i] || 0}
                    showEmpty={i === project.totals.length - 1}
                  />
                  {(i === project.totals.length - 1) &&
                    <span className="ignored">
                      &nbsp;(<Duration
                        num={project.adjustments[i]}
                        dispatch={dispatch}
                        adjustable={false}
                        showEmpty={true}
                        hideInfo={true}
                      />)
                    </span>
                  }
                  {/* {(i === project.totals.length - 1) && <span className="ignored" style={{ visibility: pi !== 0 ? "visible" : "hidden" }} onClick={() => {
                    dispatch({ type: DISPATCH_ACTION.ORDER_CHANGED, value: project.uuid })
                  }}><ArrowDropUpIcon /></span>} */}
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Totals</StyledTableCell>
            {projectData.totals.map((num, i) => (
              <StyledTableCell key={i} align="center">
                <Duration
                  num={num}
                  dispatch={dispatch}
                  adjustable={false}
                  showEmpty={true}
                />
                <br />
                <span className="ignored">
                  <Duration
                    num={projectData.totalAdjustments[i]}
                    dispatch={dispatch}
                    adjustable={false}
                    adjusted={0}
                    showEmpty={true}
                  />
                </span>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer >
  );
}