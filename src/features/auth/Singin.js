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

  const [singin, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

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

  // useEffect(() => {
  //   // Kiểm tra xem có token trong Local Storage không
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     // Nếu có, chuyển hướng người dùng đến trang chính
  //     navigate('/welcome');
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return; // Tránh gửi yêu cầu nếu đang tải
    }
    try {
      if (!isValidEmail(email)) {
        // Check if the email is in a valid format
        setErrMsg("Định dạng email không hợp lệ");
        return;
      }
      // Lấy `deviceToken` từ `localStorage`
      const devicetoken1 = localStorage.getItem("deviceToken");
      console.log(devicetoken1);
      const devicetoken = `${devicetoken1}`;
      // Sau khi đăng nhập thành công
      const userData = await singin({ email, password, devicetoken }).unwrap();
      dispatch(setCredentials({ ...userData, email }));
   
      // Lưu token vào Local Storage
      localStorage.setItem("token", userData.token);
      setEmail("");
      setPassword("");
      navigate("/client");
      let redirectTo = "/welcome"; // Đường dẫn mặc định

      if ((userData.roles = "Admin")) {
        // Nếu có vai trò 5150, chuyển hướng đến "/welcome"
        redirect("/welcome");
      } else if ((userData.roles = "Manager")) {
        // Nếu có vai trò 1984 hoặc 2001, chuyển hướng đến "/manager"
        redirect("/manager");
      }
    } catch (err) {
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg("Tài khoản không đúng ");
      } else if (err.originalStatus === 400) {
        setErrMsg("Thiếu tên người dùng hoặc mật khẩu");
      } else if (err.originalStatus === 401) {
        setErrMsg("Bạn không có quyền try cập");
      } else if (err.originalStatus === 500) {
        setErrMsg("lỗi tạm thời trên Web Server");
      } else {
        setErrMsg("Đăng nhập thất bại");
      }
      if (shouldFocus) {
        errRef.current.focus(); // Gọi .focus() nếu shouldFocus là true
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
              "url(https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.15752-9/395646041_853414299597827_3662894112485871322_n.png?_nc_cat=110&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=PukP_bH6ivcAX93pOlS&_nc_ht=scontent.fsgn2-6.fna&oh=03_AdQo-iiYA2xq6tyxfg8Pyb7ze-OtDyet5qV2CC3IxfFz9Q&oe=6560BB64)",
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
