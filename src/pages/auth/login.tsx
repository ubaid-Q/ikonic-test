import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInUser } from "./handlers";
import { Copyright } from "../../components/copyright";
import { SnackBar } from "../../components/snackBar";
import { SnackBarState } from "../../app/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { addUser, RootState } from "../../store";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.user.user);
  const [snackBar, setSnackBar] = React.useState<SnackBarState>({
    open: false,
    message: "",
    severity: "error",
  });

  React.useEffect(() => {
    console.log("state users", users);
  }, [users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const res = await signInUser(event);
      if (res.status === 200) {        
       dispatch(addUser(res.data.data));
        setSnackBar({
          message: res.data.message,
          severity: "success",
          open: true,
        });
          navigate("/dashboard");
      }
    } catch (error: any) {
      if ([400,404].includes(error.response.status)) {
        setSnackBar({
          message: error.response.data.message,
          severity: "error",
          open: true,
        });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <SnackBar
          open={snackBar.open}
          onClose={() => setSnackBar({ ...snackBar, open: false })}
          message={snackBar.message}
          severity={snackBar.severity}
        />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
              Don't have an account?
                <Button onClick={() => navigate("/register")} >
                  {" Register"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
