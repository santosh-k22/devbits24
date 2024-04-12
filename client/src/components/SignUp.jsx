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
import { useForm } from "react-hook-form";
import FormLabel from "@mui/material/FormLabel";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Grow
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const BASE_URL = "http://localhost:3000";


const defaultTheme = createTheme();

export default function SignUp() {
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try{
      const myData = JSON.stringify(data); 
      console.log("myData", myData);
      // const config = {headers: {'Content-Type': 'application/json'}}
      // const query = await axios.post(`${BASE_URL} + /auth/signup`, data)
      const query = await axios.post("http://localhost:3000/auth/signup", myData)
      console.log("QData", query.data);
    }
    catch(err) {
        console.log(err);
    }
    // console.log(data);
  };
  console.log(errors);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  // name="firstName"
                  {...register("firstName", {
                    required: "First name is required",
                    // pattern: {
                    //   value: /^[A-Za-z]+$/i,
                    //   message: "Invalid name",
                    // },
                  })}
                  // required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
                <FormLabel error component="div">
                  {errors.firstName?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  // name="lastName"
                  {...register("lastName", {
                    required: "Last name is required",
                    // pattern: {
                    //   value: /^[A-Za-z]+$/i,
                    //   message: "Invalid name",
                    // },
                  })}
                  autoComplete="family-name"
                />
                <FormLabel error component="div">
                  {errors.lastName?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  // name="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  autoComplete="email"
                />
                <FormLabel error component="div">
                  {errors.email?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  // name="username"
                  {...register("username", {
                    required: "Username is required",
                    min: 5,
                    max: 15,
                  })}
                />
                <FormLabel error component="div">
                  {errors.username?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  // name="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                <FormLabel error component="div">
                  {errors.password?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  // name="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                    // validate: (value) =>
                    //   value === password.current ||
                    //   "The passwords do not match",
                  })}
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
                <FormLabel error component="div">
                  {errors.confirmPassword?.message}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
