"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PrestappLogo from "../../../public/logos/PrestappLogo";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(null);
    const response = await signIn("credentials", {
      username: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/");
    } else {
      reset();
      setError("Invalid credentials");
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw !important",
        maxWidth: "100vw !important",
        backgroundColor: "#8de8ff",
        margin: 0,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#d4ffd8",
          maxWidth: "600px",
          maxHeight: "700px",
          minWidth: "30%",
          minHeight: "40%",
          padding: "80px 30px",
          borderRadius: "10px",
        }}
      >
        <PrestappLogo width={200} height={78} />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type={hidePassword ? "password" : "text"}
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setHidePassword(!hidePassword)}
                      edge="end"
                    >
                      {hidePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {error && (
          <Typography
            sx={{
              color: "red",
              fontSize: "16px",
              textAlign: "center",
              border: "1px solid red",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign in
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => router.push("/signup")}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
