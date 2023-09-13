import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Modal,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/productSlice';
import { Edit, FilterList, Search } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import ModalDetail from './ModalComponentDetail';
import ModalEdit from './ModalComponentEdit';
import CustomTablePagination from './TablePagination';
import ToggleButton from './ToggleButton';
import { DeleteOutline } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fade from '@mui/material/Fade';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';
const Products = (props) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('Status');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditBook, setSelectedEditBook] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Thêm state để điều khiển hiển thị modal xóa
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  const handleEditClick = (book) => {
    setSelectedEditBook(book);
    setOpenEditModal(true);
  };
  const handleSearchChange = (event) => {
    const value = event.target.value || ''; // Use an empty string if the value is null
    setSearchText(value);
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredProducts = products.filter((user) => {
        const orderDate = moment(user.createAt).format('YYYY-MM-DD');
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredProducts(filteredProducts);
      setFilterOption('Date');
    } else {
      setFilteredProducts(products);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === 'Status') {
      // Hiển thị tất cả các trạng thái
      setFilteredProducts(products);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredProducts = products.filter(
        (product) => product.status === selectedStatusOption
      );
      setFilteredProducts(filteredProducts);
    }
  };
  const handleUpdateClick = (product) => {
    setSelectedEditBook(product);
    setOpenEditModal(true);
    setIsSuccess(true);
    dispatch(fetchProducts());
  };
  const handleBookDetailClick = (book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct({ id: selectedProduct.bookId }))
      .then(() => {
        toast.success('Delete book successfully');
        setOpenDeleteModal(false);
        // Cập nhật danh sách sản phẩm sau khi xóa thành công
        const updatedProducts = products.filter(
          (product) => product.bookId !== selectedProduct.bookId
        );
        setFilteredProducts(updatedProducts);
      })
      .catch((error) => {
        toast.error(error,"Error!!");
      });
  };

  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const filterMatch =
        filterOption === 'Status' ||
        (filterOption === 'Active' && product.status === 'Active') ||
        (filterOption === 'Out of stock' && product.status === 'Out of stock');
      return nameMatch && filterMatch;
    });
    setFilteredProducts(filteredProducts);
  }, [products, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProducts())
      .then(() => {
        setIsSuccess(true);
        // Không cần setFilteredProductsStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProductsPagination = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: 'bookId', headerName: 'ID', width: 50, key: 'bookId' },
    { field: 'name', headerName: 'Name Book', width: 200, key: 'name' ,  cellClassName: 'name-column--cell',},
    {
      field: 'authorName',
      headerName: 'AuthorName',
      width: 200,
      key: 'authorName',
    },
    { field: 'quantity', headerName: 'Quantity', width: 60, key: 'quantity' },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      key: 'price',
      valueFormatter: (params) => params.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }
    ,
    { field: 'publicDate', headerName: 'Date', width: 150, key: 'status' ,
    valueGetter: (params) =>
    moment(params.row.createAt).utcOffset(7).format('DD-MM-YYYY'),},
    {
      field: 'bookDetail',
      headerName: 'Book Detail',
      width: 140,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleBookDetailClick(params.row)}>
          Book Detail
        </Button>
      ),
      key: 'bookDetail',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 60,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" className="filter-box">
          <ToggleButton
            initialValue={params.value === 'Active'}
            onChange={(value) => {
              const updatedProducts = products.map((product) => {
                if (product.bookId === params.row.bookId) {
                  return {
                    ...product,
                    status: value ? 'Active' : 'Out of stock',
                  };
                }
                return product;
              });
              setFilteredProducts(updatedProducts);
            }}
          />
        </Box>
      ),
      key: 'status',
    },
    {
      field: 'update',
      headerName: 'Update',
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleUpdateClick(params.row)}>
          <Edit style={{ color: 'red' }} />
        </IconButton>
      ),
      key: 'update',
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteClick(params.row)}
          {...(loading ? { loading: true } : {})} // Conditionally include the loading attribute
          comingsoon={loading ? 1 : 0}
        
        >
          <DeleteOutline />
        </IconButton>
      ),
      key: 'deleted',
    },
    
    

  ];

  return (
    <Box m="10px">
      <Header title="Product" subtitle="List of Books" />

      <Box display="flex" alignItems="center" className="search-box">
        <Box
          display="flex"
          borderRadius="5px"
          className="search-box"
          border={1}
          marginRight={2}
          >
          <InputBase
            sx={{ ml: 4, flex: 1, padding: 1.3 }}
            placeholder="Search"
            onChange={handleSearchChange}
            className="search-input"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        
        <ToastContainer />
        <Box display="flex" alignItems="center" className="filter-box">
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOption}
              onChange={handleFilterChange}
              variant="outlined"
              className="filter-select">
              <MenuItem key="status-all" value="Status">
                Status
              </MenuItem>
              <MenuItem key="status-active" value="Active">
                Active
              </MenuItem>
              <MenuItem key="status-outofstock" value="Out of stock">
                Out of Stock
              </MenuItem>
              <MenuItem key="status-unavailable" value="unavailable">
                Unavailable
              </MenuItem>
            </Select>
          </FormControl>
        
        </Box>
        <Box display="flex" alignItems="center" className="startDate-box">
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate ||''}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format('YYYY-MM-DD'), // Set the maximum selectable date as today
            }}
            sx={{ ml: 4,mr:2}}
          />
        </Box>

        <Box  display="flex" alignItems="center" className="endtDate-box">
          <TextField
            label="Đến ngày"
            type="date"
            value={endDate||''}
            onChange={(event) => setEndDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format('YYYY-MM-DD'), // Set the maximum selectable date as today
            }}
          />
        </Box>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-row': {
            borderBottom: 'none',
          },
        }}>
        <DataGrid
          rows={filteredProductsPagination}
          columns={columns}
          getRowId={(row) => row.bookId}
          autoHeight
          checkboxSelection
          loading={loading}
        />
        <CustomTablePagination
          count={filteredProducts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        selectedBook={selectedBook}
        loading={loading}
        ></ModalDetail>
      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditBook={selectedEditBook}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
       <ToastContainer />
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        className="centered-modal" // Thêm className cho modal
      >
        <Fade in={openDeleteModal}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              boxShadow: 24,
              borderRadius: 16,
            }}>
            <Card>
              <CardContent>
                <Typography variant="h3">Confirm Delete</Typography>
                <Typography>
                  Are you sure you want to delete this book?
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="error">
                  Delete
                </Button>
                <Button
                  onClick={() => setOpenDeleteModal(false)}
                  variant="contained">
                  Cancel
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Products;