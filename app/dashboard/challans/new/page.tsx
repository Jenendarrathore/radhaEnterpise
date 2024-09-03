"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";
import { useCreateChallanMutation } from "@/redux/challansApi";
import { useGetClientsQuery } from "@/redux/clientsApi";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useCreateBaleAndChallanMutation } from "@/redux/BalesApi";

// app/challans/new.tsx
const NewChallanPage = () => {
  // const [createChallan, { isLoading, isSuccess, isError, error }] =
  //   useCreateChallanMutation();
  const [
    createBaleAndChallan,
    { isLoading, isSuccess, isError, error, data: newChallan },
  ] = useCreateBaleAndChallanMutation();

  const initialValues = {
    client: "",
    challanNumber: "",
    totalMeters: "",
    quality: "",
    width: "",
    challanDate: "",
    pcs: "",
    fold: "",
    rate: "",
    challanAmount: "",
    lots: [{ baleCount: 1, totalMeters: 0, entries: [{ meters: 0 }] }], // Include totalMeters
  };

  const validationSchema = Yup.object({
    client: Yup.string()
      .required("Client is required")
      .min(1, "Client name must be at least 1 character long")
      .max(100, "Client name must not exceed 100 characters"),

    challanNumber: Yup.string()
      .required("Challan number is required"),

    totalMeters: Yup.number(),
    // .required("Total meters is required")
    // .positive("Total meters must be a positive number")
    // .integer("Total meters must be an integer"),

    quality: Yup.string().required("Quality is required"),

    width: Yup.number()
      .required("Width is required")
      .positive("Width must be a positive number"),

    challanDate: Yup.date()
      .required("Challan date is required")
      .typeError("Invalid date format"),

    pcs: Yup.number()
      .required("Number of pieces is required")
      .positive("Number of pieces must be a positive number")
      .integer("Number of pieces must be an integer"),

    fold: Yup.number()
      .required("Fold is required")
      .positive("Fold must be a positive number")
      .integer("Fold must be an integer"),

    rate: Yup.number()
      .required("Rate is required")
      .positive("Rate must be a positive number"),

    challanAmount: Yup.number(),
    // .required("Challan amount is required")
    // .positive("Challan amount must be a positive number"),
    lots: Yup.array().of(
      Yup.object().shape({
        baleCount: Yup.number()
          .required("Bale count is required")
          .positive("Bale count must be a positive number")
          .integer("Bale count must be an integer"),
        totalMeters: Yup.number()
          .required("Total meters is required")
          .positive("Total meters must be a positive number"),

        entries: Yup.array().of(
          Yup.object().shape({
            meters: Yup.number()
              .required("Cloth meters are required")
              .positive("Cloth meters must be a positive number"),
            // width: Yup.number(),
          })
        ),
      })
    ),
  });

  const isFormFieldValid = (formik: any, fieldName: string) =>
    formik.touched[fieldName] && formik.errors[fieldName];
  // const isFieldInvalid = (fieldName) =>
  //   formik.touched[fieldName] && Boolean(formik.errors[fieldName]);

  const [clientOption, setClientOptions] = useState([]);
  const {
    data: clients,
    isLoading: isClientLoading,
    error: getClientsError,
  } = useGetClientsQuery(null);

  useEffect(() => {
    if (clients && clients.length > 0) {
      const options = clients.map((e: any) => ({
        label: e.partyName,
        id: e._id,
      }));
      setClientOptions(options);
    }
  }, [clients]);

  // Calculate total meters for a lot
  const calculateTotalBaleMeters = (entries: any): any => {
    let total = 0;

    for (const entry of entries) {
      total += parseFloat(entry.meters || "0");
    }

    return total;
  };

  const calculateTotalMeters = (lots: any): any => {
    let total = 0;

    if (lots) {
      for (const lot of lots) {
        total += calculateTotalBaleMeters(lot.entries);
      }
    }

    return total;
  };

  const calculateTotalAmount = (totalMeters: any, rate: any) => {
    return totalMeters * parseFloat(rate || 0);
  };

  // Function to update total meters for each lot and overall total meters

  useEffect(() => {
    if (isSuccess && newChallan) {
      const newChallanId = newChallan._id; // Assuming your API returns the saved document
      window.location.href = `/dashboard/challans`;
    }
  }, [isSuccess, newChallan]);

  return (
    <div>
      <h1>Add New Challan</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const handleSubmit = async () => {
            try {
              const challanData = {
                client: values.client,
                challanNumber: values.challanNumber,
                totalMeters: values.totalMeters,
                quality: values.quality,
                width: values.width,
                challanDate: values.challanDate,
                pcs: values.pcs,
                fold: values.fold,
                rate: values.rate,
                challanAmount: values.challanAmount,
                lots: values.lots,
              };
              await createBaleAndChallan(challanData).unwrap();
              toast.success("Challan Created");

              console.log("challanData", challanData);

              // Handle success (e.g., show a success message, reset the form, etc.)
            } catch (err) {
              // Handle error (e.g., show an error message)
              toast.success("Something went wrong");

              console.error("Failed to create challan:", error);
            }
          };
          handleSubmit();
        }}
      >
        {(formik) => {
          const updateTotalMeters = () => {
            const totalMeters = calculateTotalMeters(formik.values.lots);
            const totalAmount = calculateTotalAmount(
              totalMeters,
              formik.values.rate
            );

            formik.setFieldValue("totalMeters", totalMeters);
            formik.setFieldValue("challanAmount", totalAmount);

            // Update each lot's totalMeters based on the entries
            // const updatedLots = formik.values.lots.map((lot, lotIndex) => ({
            //   ...lot,
            //   totalMeters: calculateTotalBaleMeters(lot.entries),
            // }));
            let updatedLots = [];

            for (let i = 0; i < formik.values.lots.length; i++) {
              const lot = formik.values.lots[i];
              let totalMeters = 0;
              for (let j = 0; j < lot.entries.length; j++) {
                const entry = lot.entries[j];
                totalMeters = totalMeters + Number(entry.meters);
              }
              lot.totalMeters = totalMeters;
              updatedLots.push(lot);
            }
            console.log(formik.errors);

            // formik.setFieldValue("lots", updatedLots);
          };

          // const updateTotalMeters = () => {

          // const totalMeters = calculateTotalMeters(formik.values.lots);
          // const totalAmount = calculateTotalAmount(
          //   totalMeters,
          //   formik.values.rate
          // );

          // formik.setFieldValue(`totalMeters`, totalMeters);
          // formik.setFieldValue(`totalAmount`, totalAmount);
          // let updatedLots = [];

          // for (let i = 0; i < formik.values.lots.length; i++) {
          //   const lot = formik.values.lots[i];
          //   let totalMeters = 0;
          //   for (let j = 0; j < lot.entries.length; j++) {
          //     const entry = lot.entries[j];
          //     totalMeters = totalMeters + Number(entry.meters);
          //   }
          //   lot.totalMeters = totalMeters;
          //   updatedLots.push(lot);
          // }

          // formik.setValues("lots", updatedLots);
          // };

          return (
            <Form>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={clientOption}
                    getOptionLabel={(option: any) => option.label} // Adjust based on client data structure
                    onChange={(event, value: any) => {
                      console.log("value", value);

                      formik.setFieldValue("client", value.id);
                      // onSelect(value);
                    }}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          label="Select Client"
                          variant="outlined"
                        />
                      </>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="text"
                    id="challanNumber"
                    name="challanNumber"
                    label="Challan Number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.challanNumber}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "challanNumber")}
                    helperText={
                      isFormFieldValid(formik, "challanNumber")
                        ? formik.errors.challanNumber
                        : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="text"
                    id="quality"
                    name="quality"
                    label="Quality"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.quality}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "quality")}
                    helperText={
                      isFormFieldValid(formik, "quality")
                        ? formik.errors.quality
                        : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={isFormFieldValid(formik, "width")}
                  >
                    <InputLabel id="width-label">Width</InputLabel>
                    <Select
                      labelId="width-label"
                      id="width"
                      name="width"
                      value={formik.values.width}
                      onChange={formik.handleChange}
                      label="Width"
                    >
                      <MenuItem value={36}>36</MenuItem>
                      <MenuItem value={44}>44</MenuItem>
                      <MenuItem value={58}>58</MenuItem>
                    </Select>
                    <FormHelperText>
                      {isFormFieldValid(formik, "width")
                        ? formik.errors.width
                        : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="date"
                    id="challanDate"
                    name="challanDate"
                    label="Challan Date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.challanDate}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "challanDate")}
                    helperText={
                      isFormFieldValid(formik, "challanDate")
                        ? formik.errors.challanDate
                        : ""
                    }
                    InputLabelProps={{ shrink: true }} // To ensure label does not overlap
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    id="pcs"
                    name="pcs"
                    label="Pieces"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.pcs}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "pcs")}
                    helperText={
                      isFormFieldValid(formik, "pcs") ? formik.errors.pcs : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    id="fold"
                    name="fold"
                    label="Fold"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.fold}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "fold")}
                    helperText={
                      isFormFieldValid(formik, "fold") ? formik.errors.fold : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    id="rate"
                    name="rate"
                    label="Rate"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.rate}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "rate")}
                    helperText={
                      isFormFieldValid(formik, "rate") ? formik.errors.rate : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <FieldArray
                    name="lots"
                    render={({ push, remove }) => (
                      <div>
                        {formik.values.lots.map((lot, lotIndex) => (
                          <Accordion key={lotIndex} defaultExpanded>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`panel${lotIndex}-content`}
                              id={`panel${lotIndex}-header`}
                            >
                              <Typography>
                                Bale Count: {lot.baleCount}
                              </Typography>
                              <Button
                                type="button"
                                onClick={() => remove(lotIndex)}
                              >
                                <DeleteIcon />
                              </Button>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <TextField
                                    type="number"
                                    id={`lots.${lotIndex}.baleCount`}
                                    name={`lots.${lotIndex}.baleCount`}
                                    label="Bale Count"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={lot.baleCount}
                                    onChange={formik.handleChange}
                                    error={isFormFieldValid(
                                      formik,
                                      `lots[${lotIndex}].baleCount`
                                    )}
                                    helperText={
                                      //@ts-ignore
                                      formik.errors.lots?.[lotIndex]?.baleCount
                                    }
                                  />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <TextField
                                    label="Total Bale Meters"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={calculateTotalBaleMeters(
                                      lot.entries
                                    )}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Grid>
                                {/* <Grid size={{ xs: 6, md: 3 }}>
                                  <TextField
                                    type="number"
                                    name={`lots.${lotIndex}.totalMeters`}
                                    label="Total Meters"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={lot.totalMeters}
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      // updateTotalMeters(
                                      //   formik,
                                      //   lotIndex,
                                      //   lot.entries
                                      // );
                                    }}
                                    error={isFormFieldValid(
                                      formik,
                                      `lots.${lotIndex}.totalMeters`
                                    )}
                                    helperText={
                                      isFormFieldValid(
                                        formik,
                                        `lots.${lotIndex}.totalMeters`
                                      )
                                        ? formik.errors.lots?.[lotIndex]
                                            ?.totalMeters
                                        : ""
                                    }
                                  />
                                </Grid> */}
                              </Grid>
                              <br></br>
                              <FieldArray
                                name={`lots.${lotIndex}.entries`}
                                render={({ push, remove }) => (
                                  <div>
                                    {lot.entries.map((entry, entryIndex) => (
                                      <Grid
                                        className="mt-4"
                                        container
                                        spacing={2}
                                        key={entryIndex}
                                      >
                                        <Grid size={{ xs: 6, md: 3 }}>
                                          <TextField
                                            type="number"
                                            id={`lots.${lotIndex}.entries.${entryIndex}.meters`}
                                            name={`lots.${lotIndex}.entries.${entryIndex}.meters`}
                                            label="Meters"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={entry.meters}
                                            onChange={(e) => {
                                              formik.handleChange(e);
                                              updateTotalMeters();
                                            }}
                                            error={isFormFieldValid(
                                              formik,
                                              `lots[${lotIndex}].entries[${entryIndex}].meters`
                                            )}
                                            helperText={
                                            //@ts-ignore
                                              formik.errors.lots?.[lotIndex]?.entries?.[entryIndex]?.meters
                                            }
                                          />
                                        </Grid>

                                        {/* <Grid size={{ xs: 6, md: 6 }}>
                                        <TextField
                                          type="number"
                                          id={`lots.${lotIndex}.entries.${entryIndex}.width`}
                                          name={`lots.${lotIndex}.entries.${entryIndex}.width`}
                                          label="Width"
                                          variant="outlined"
                                          size="small"
                                          fullWidth
                                          value={entry.width}
                                          onChange={formik.handleChange}
                                          error={isFormFieldValid(
                                            formik,
                                            `lots[${lotIndex}].entries[${entryIndex}].width`
                                          )}
                                          helperText={
                                            formik.errors.lots?.[lotIndex]
                                              ?.entries?.[entryIndex]?.width
                                          }
                                        />
                                      </Grid> */}

                                        <Grid size={{ xs: 3, md: 3 }}>
                                          <Button
                                            type="button"
                                            onClick={() => remove(entryIndex)}
                                          >
                                            <DeleteIcon />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    ))}
                                    <Button
                                      type="button"
                                      className="add-icon"
                                      onClick={() => push({ meters: "" })}
                                    >
                                      <AddCircleOutlineIcon /> Add Meter
                                    </Button>
                                  </div>
                                )}
                              />
                            </AccordionDetails>
                          </Accordion>
                        ))}
                        <br></br>
                        <Button
                          type="button"
                          onClick={() =>
                            push({
                              baleCount: 1,
                              entries: [{ meters: "", width: "" }],
                            })
                          }
                        >
                          <AddCircleOutlineIcon /> Add Taka
                        </Button>
                      </div>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    id="totalMeters"
                    name="totalMeters"
                    label="Total Meters"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={calculateTotalMeters(formik.values.lots)}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "totalMeters")}
                    helperText={
                      isFormFieldValid(formik, "totalMeters")
                        ? formik.errors.totalMeters
                        : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    id="challanAmount"
                    name="challanAmount"
                    label="Challan Amount"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={calculateTotalAmount(
                      calculateTotalMeters(formik.values.lots),
                      formik.values.rate
                    )}
                    onChange={formik.handleChange}
                    error={isFormFieldValid(formik, "challanAmount")}
                    helperText={
                      isFormFieldValid(formik, "challanAmount")
                        ? formik.errors.rate
                        : ""
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
                  onClick={updateTotalMeters}
                >
                  Submit
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      {/* Placeholder for challan form */}
    </div>
  );
};
export default NewChallanPage;
