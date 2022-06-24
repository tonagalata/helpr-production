import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ProjectCard from '../../components/Card/ProjectCard'
import styles from './Home.module.css'
import AllProjects from '../AllProjects/AllProjects';

  
const Home = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (

    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '2em' }}>
      <Paper sx={{ width: '50%' }}>
        <h1 style={{ textAlign: 'center' }}>Projects Table</h1>
        <TableContainer sx={{ maxWidth: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {Object.keys(props.projects[0]).map((column, i) => (
                  <TableCell>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                props.projects.map((row, i) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>  
                  {Object.keys(row).map( r => (
                    <TableCell>{row[r]}</TableCell>
                    
                    ))}
                    </TableRow>
                ))}
                </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={props.projects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
  
export default Home;