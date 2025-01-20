"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PrestappLogo from "../../../public/logos/PrestappLogo";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { Loan } from "@prisma/client";
import { format } from "date-fns";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  name: yup.string().required("Name is required"),
  phoneNumber: yup.string(),
});

const Profile: React.FC = () => {
  const { data: session, status: statusSession } = useSession();

  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLoans, setUserLoans] = useState<Loan[] | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!session?.user?.email) {
      return;
    }
    fetch("/api/loan/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session?.user?.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserLoans(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [session?.user?.email]);

  useEffect(() => {
    setIsLogged(statusSession === "authenticated");
    if (!session?.user?.email) {
      return;
    }
    fetch("/api/user/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session?.user?.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setValue("email", data.email);
        setValue("name", data.name);
        setValue("phoneNumber", data.phoneNumber);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [statusSession, session?.user?.email]);

  useEffect(() => {
    if (statusSession === "unauthenticated") {
      router.push("/login");
    }
  }, [statusSession, router]);

  const onSubmit = async (data: {
    email: string;
    name: string;
    phoneNumber?: string;
  }) => {
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.refresh();
      } else {
        setError("Error updating user");
      }
    } catch (error) {
      console.error(error);
      setError("Error updating user");
    }
  };

  if (!isLogged) {
    return null;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
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
          minWidth: "30%",
          minHeight: "40%",
          padding: "80px 30px",
          borderRadius: "10px",
        }}
      >
        <PrestappLogo width={200} height={78} />
        <Controller
          disabled
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
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              variant="outlined"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
              fullWidth
              margin="normal"
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
          Update Profile
        </Button>
        <Typography
          sx={{
            marginTop: "20px",
          }}
          variant="h4"
        >
          Your Loans
        </Typography>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
            width: "100%",
            minHeight: "50px",
            maxHeight: "100px",
            overflowY: "scroll",
            borderRadius: "10px",
          }}
        >
          {userLoans?.map((loan) => (
            <Box
              key={loan.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "50px",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography>Amount: {loan?.amount}</Typography>
              <Typography>
                Date: {format(new Date(loan?.createdAt), "dd/MM/yyyy")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
