"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Container } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { subYears } from "date-fns";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Nombre es requerido")
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .matches(
      /^[a-zA-Z]+$/,
      "Nombre no debe contener números ni caracteres especiales"
    ),
  lastName: yup
    .string()
    .required("Apellido es requerido")
    .min(2, "Apellido debe tener al menos 2 caracteres")
    .matches(
      /^[a-zA-Z]+$/,
      "Apellido no debe contener números ni caracteres especiales"
    ),
  email: yup
    .string()
    .required("Correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido"),
  address: yup
    .string()
    .required("Dirección es requerida")
    .min(10, "Dirección debe tener al menos 10 caracteres")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Dirección no debe contener caracteres especiales"
    )
    .matches(/^(?![0-9]*$)/, "Dirección no debe ser solo números"),
  loanAmount: yup
    .number()
    .required("Monto del préstamo es requerido")
    .positive("Monto del préstamo debe ser positivo")
    .min(25000, "Monto del préstamo debe ser al menos 25,000")
    .max(250000, "Monto del préstamo no debe exceder 250,000"),
  birthDate: yup
    .date()
    .required("Fecha de nacimiento es requerida")
    .max(subYears(new Date(), 18), "Debe ser mayor de 18 años"),
  phoneNumber: yup
    .string()
    .required("Número de teléfono es requerido")
    .matches(/^[0-9]+$/, "Número de teléfono debe ser válido"),
});

const LoanForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const savedData = localStorage.getItem("loanFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      (Object.keys(parsedData) as Array<keyof typeof parsedData>).forEach(
        (key) => {
          // Ensure loanAmount is a number
          const value =
            key === "loanAmount" ? Number(parsedData[key]) : parsedData[key];
          setValue(key as keyof typeof schema.fields, value);
        }
      );
    }
  }, [setValue]);

  const onChange = () => {
    const formData = getValues();
    localStorage.setItem("loanFormData", JSON.stringify(formData));
  };

  const onSubmit = (data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    loanAmount: number;
    birthDate: Date;
    phoneNumber: string;
  }) => {
    console.log(data);
    alert("Formulario enviado con éxito");
  };

  const handleReset = () => {
    reset();
    localStorage.removeItem("loanFormData");
  };

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
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                setValue("firstName", value);
                onChange();
              }}
              label="Nombre"
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ""}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Apellido"
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                const value = e.target.value;
                setValue("lastName", value);
                onChange();
              }}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Correo Electrónico"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                const value = e.target.value;
                setValue("email", value);
                onChange();
              }}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Dirección"
              variant="outlined"
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                const value = e.target.value;
                setValue("address", value);
                onChange();
              }}
            />
          )}
        />
        <Controller
          name="loanAmount"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <TextField
              {...field}
              label="Monto del Préstamo"
              variant="outlined"
              error={!!errors.loanAmount}
              helperText={errors.loanAmount ? errors.loanAmount.message : ""}
              fullWidth
              margin="normal"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setValue("loanAmount", Number(value));
                onChange();
              }}
            />
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          defaultValue={new Date()}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de Nacimiento"
              type="date"
              value={
                (field?.value instanceof Date
                  ? field.value.toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]) ||
                new Date().toISOString().split("T")[0]
              }
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.birthDate}
              helperText={errors.birthDate ? errors.birthDate.message : ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                const value = e.target.value;
                setValue("birthDate", new Date(value));
                onChange();
              }}
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
              label="Número de Teléfono"
              variant="outlined"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                const value = e.target.value;
                setValue("phoneNumber", value);
                onChange();
              }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Enviar
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleReset}
        >
          Restablecer
        </Button>
      </Box>
    </Container>
  );
};

export default LoanForm;
