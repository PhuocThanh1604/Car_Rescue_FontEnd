import { TablePagination, Typography, styled } from '@mui/material';

const PaginationContainer = styled('span')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  fontSize: '2.2rem', // Tăng kích thước chữ ở đây
}));

const CustomTablePagination = (props) => {
  const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = props;

  const emptyRowsPerPageOptions = [];

  return (
    <PaginationContainer>
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
    </PaginationContainer>
  );
};

export default CustomTablePagination;
