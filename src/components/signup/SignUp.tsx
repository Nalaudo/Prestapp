"use client";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Container,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import PrestappLogo from "../../../public/logos/PrestappLogo";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface SignUpFormInputs {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  name: yup.string().required("Name is required"),
  phone: yup.string().optional(),
});

const SignUp: React.FC = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        setError("Sign up failed");
      } else {
        const response = await signIn("credentials", {
          username: data.email,
          password: data.password,
          redirect: false,
        });

        if (response?.ok) {
          router.push("/");
        } else {
          router.push("/login");
        }
        router.push("/");
      }
    });
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
              margin="normal"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
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
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone (optional)"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone ? errors.phone.message : ""}
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
              width: "100%",
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
          Sign Up
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => router.push("/login")}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
