import { TablePagination, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    fontSize: '2.2rem', // Tăng kích thước chữ ở đây
  },
}));

const CustomTablePagination = (props) => {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = props;

  const emptyRowsPerPageOptions = [];

  return (
    <span className={classes.paginationContainer}>
      <Typography variant="body2" color="textSecondary">
        Showing page {page + 1} of {Math.ceil(count / rowsPerPage)}
      </Typography>
      <TablePagination
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={emptyRowsPerPageOptions}
      />
    </span>
  );
};

export default CustomTablePagination;
