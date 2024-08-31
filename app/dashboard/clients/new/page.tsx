"use client";

import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Grid2";
import { useCreateClientMutation } from "@/redux/clientsApi";
import { toast } from "react-toastify";

// app/clients/new.tsx
const NewClientPage = () => {
  const [createClient, { isLoading, isSuccess, isError, error }] =
    useCreateClientMutation();

  console.log("isSuccess");
  console.log(isSuccess);

  const initialValues = {
    partyName: "",
    address: "",
    gst: "",
    panNo: "",
    state: "",
    code: "",
  };

  const validationSchema = Yup.object({
    partyName: Yup.string().required("Party Name is required."),
    address: Yup.string().required("Address is required."),
    gst: Yup.string().required("GST is required."),
    panNo: Yup.string(),
    state: Yup.string().required("State is required."),
    code: Yup.string().required("Code is required."),
  });

  const isFormFieldValid = (formik: any, fieldName: string) =>
    formik.touched[fieldName] && formik.errors[fieldName];
  // const isFieldInvalid = (fieldName) =>
  //   formik.touched[fieldName] && Boolean(formik.errors[fieldName]);

  return (
    <div>
      <h1>Add New Client</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const handleSubmit = async () => {
            try {
              const clientData = {
                partyName: values.partyName,
                address: values.address,
                gst: values.gst,
                panNo: values.panNo,
                state: values.state,
                code: values.code,
              };
              await createClient(clientData).unwrap();
              toast.success("Client Created");

              // Handle success (e.g., show a success message, reset the form, etc.)
            } catch (err) {
              // Handle error (e.g., show an error message)
              toast.success("Something went wrong");

              console.error("Failed to create client:", error);
            }
          };
          handleSubmit();
        }}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="partyName"
                  name="partyName"
                  label="Party Name" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.partyName}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "partyName")}
                  helperText={
                    isFormFieldValid(formik, "partyName")
                      ? formik.errors.partyName
                      : ""
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="address"
                  name="address"
                  label="Address" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "address")}
                  helperText={
                    isFormFieldValid(formik, "address")
                      ? formik.errors.address
                      : ""
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="gst"
                  name="gst"
                  label="GST" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.gst}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "gst")}
                  helperText={
                    isFormFieldValid(formik, "gst") ? formik.errors.gst : ""
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="panNo"
                  name="panNo"
                  label="PAN No" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.panNo}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "panNo")}
                  helperText={
                    isFormFieldValid(formik, "panNo") ? formik.errors.panNo : ""
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="state"
                  name="state"
                  label="State" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "state")}
                  helperText={
                    isFormFieldValid(formik, "state") ? formik.errors.state : ""
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="text"
                  id="code"
                  name="code"
                  label="Code" // Optional: Add a label if needed
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  error={isFormFieldValid(formik, "code")}
                  helperText={
                    isFormFieldValid(formik, "code") ? formik.errors.code : ""
                  }
                />
              </Grid>
            </Grid>

            <div>
              <Button
                type="submit"
                className="mt-4"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {/* Placeholder for client form */}
    </div>
  );
};
export default NewClientPage;
