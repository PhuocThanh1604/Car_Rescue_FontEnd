import { useRef, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { redirect, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { CircularProgress } from "@mui/material";
import { requestPermissions } from "../../firebase";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Hệ Thống Quản Lí Xe Cứu Hộ
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
function isValidEmail(email) {
  // Regular expression for a valid email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const userRef = useRef();
  const errRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [deviceToken, setDeviceToken] = useState(null);

  const [singin, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();


  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  let shouldFocus = false; // Biến để kiểm tra xem có nên gọi .focus() hay không

  if (errRef.current) {
    shouldFocus = true; // Nếu errRef.current tồn tại, đặt shouldFocus thành true
  }

  if (errRef.current && errRef.current.focus) {
    errRef.current.focus();
  }
  

  useEffect(() => {
    const devicetoken = localStorage.getItem("deviceToken");
    if (!devicetoken) {
      const getToken = async () => {
        try {
          const token = await requestPermissions(); 
          localStorage.setItem("deviceToken", token);
        } catch (error) {
          console.error("Error while getting device token:", error);
          // Xử lý lỗi nếu cần
        }
      };
  
      getToken();
    }
  }, []);
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return; // Tránh gửi yêu cầu nếu đang tải
    }
  
    const devicetoken = localStorage.getItem("deviceToken"); // Lấy deviceToken từ localStorage
  
    try {
      if (!isValidEmail(email)) {
        setErrMsg("Định dạng email không hợp lệ");
        return;
      }
  
      const userData = await singin({ email, password, devicetoken }).unwrap();
      console.log(userData);
      dispatch(setCredentials({ ...userData, email }));
      setEmail("");
      setPassword("");
      navigate("/client");
  
      if (userData.roles === "Admin") {
        navigate("/welcome222");
      } else if (userData.roles === "Manager") {
        navigate("/manager");
      }
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg("Tài khoản không đúng ");
      } else if (err.originalStatus === 400) {
        setErrMsg("Thiếu tên người dùng hoặc mật khẩu");
      } else if (err.originalStatus === 401) {
        setErrMsg("Bạn không có quyền truy cập");
      } else if (err.originalStatus === 500) {
        setErrMsg("Lỗi tạm thời trên Web Server");
      } else {
        setErrMsg("Đăng nhập thất bại");
      }
      if (shouldFocus) {
        errRef.current.focus();
      }
    }
  };
  

  const handleUserInput = (e) => setEmail(e.target.value);

  const handlePwdInput = (e) => setPassword(e.target.value);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://firebasestorage.googleapis.com/v0/b/car-rescue-399511.appspot.com/o/admin%2FbackgroundRecusse.png?alt=media&token=d2ae18a3-552c-40c5-9357-4fd461c6ed88&fbclid=IwAR0yad2TxLTLyFNAprcV_xARgoYuhjbZciJtePPYg-7zKx2uWzjSJQF2fzQ)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng Nhập
            </Typography>
            {errMsg && <Typography color="error">{errMsg}</Typography>}
            {isLoading && <CircularProgress size={24} />}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                ref={userRef}
                value={email}
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleUserInput}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handlePwdInput}
                value={password}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Ghi Nhớ"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Quên Mật Khẩu
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Không Có Tài Khoản? Đăng Kí"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
