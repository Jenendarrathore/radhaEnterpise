"use client";

import { Autocomplete, Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";
import {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
} from "@/redux/invoicesApi";
import { useEffect, useState } from "react";
import { useGetClientsQuery } from "@/redux/clientsApi";
import { useRouter } from "next/router";
import { convertToIndianRupeesWords } from "@/helper/helper";
import { useGetChallansQuery } from "@/redux/challansApi";

// app/clients/new.tsx
const NewInvoicePage = () => {
  const [
    createInvoice,
    { isLoading, isSuccess, isError, error, data: newInvoice },
  ] = useCreateInvoiceMutation();
  const { data: allInvoices } = useGetInvoicesQuery(null);

  console.log("isSuccess", isSuccess);

  const [invoiceCount, setInvoiceCount] = useState();
  const [clientOption, setClientOptions] = useState([]);
  const [challanOption, setChallanOption] = useState([]);
  const {
    data: clients,
    isLoading: isClientLoading,
    error: getClientsError,
  } = useGetClientsQuery(null);

  const {
    data: challans,
    isLoading: isChallanLoading,
    error: getChallansError,
  } = useGetChallansQuery(null);

  useEffect(() => {
    if (clients && clients.length > 0) {
      const options = clients.map((e: any) => ({
        label: e.partyName,
        id: e._id,
      }));
      setClientOptions(options);
    }
  }, [clients]);
  useEffect(() => {
    if (challans && challans.length > 0) {
      const options = challans.map((e: any) => ({
        label: `${e.challanNumber} - ${e.client.partyName}`,
        id: e._id,
        totalMeters: e.totalMeters,
        challanAmount: e.challanAmount,
      }));
      setChallanOption(options);
    }
  }, [challans]);

  useEffect(() => {
    if (allInvoices) {
      setInvoiceCount(allInvoices.length + 1);
    }
  }, [allInvoices]);

  const initialValues = {
    invoiceNumber: "",
    challan: [],
    invoiceDate: "",
    client: "",
    paymentTerms: "",
    goodsSerialNumber: "",
    goodsDescription: "",
    goodsQuantity: "",
    goodsRate: "",
    goodsAmount: "",
    cgstAmount: "",
    sgstAmount: "",
    roundOff: "",
    totalAmount: "",
    totalAmountInWords: "",
    cgstRate: 2.5,
    sgstRate: 2.5,
    totalTaxAmount: "",
    totalTaxAmountInWords: "",
  };
  const validationSchema = Yup.object({
    invoiceNumber: Yup.number().required("Invoice Number is required."),
    challan: Yup.array().required("Challan Number is required."),
    invoiceDate: Yup.date().required("Invoice Date is required."),
    client: Yup.string().required("Client is required."),
    paymentTerms: Yup.string().required("Payment Terms are required."),
    goodsSerialNumber: Yup.number(),
    goodsDescription: Yup.string(),
    goodsQuantity: Yup.number(),
    goodsRate: Yup.number(),
    goodsAmount: Yup.number(),
    cgstAmount: Yup.number().required("CGST Amount is required."),
    sgstAmount: Yup.number().required("SGST Amount is required."),
    roundOff: Yup.number().required("Round of Amount is required."),
    totalAmount: Yup.number().required("Total Amount is required."),
    totalAmountInWords: Yup.string().required(
      "Total Amount In Words is required."
    ),
    cgstRate: Yup.number().required("CGST Rate is required."),
    sgstRate: Yup.number().required("SGST Rate is required."),
    totalTaxAmount: Yup.number().required("Total Tax Amount is required."),
    totalTaxAmountInWords: Yup.string().required(
      "Total Tax Amount In Words is required."
    ),
  });

  const isFormFieldValid = (formik: any, fieldName: string) =>
    formik.touched[fieldName] && formik.errors[fieldName];
  // const isFieldInvalid = (fieldName) =>
  //   formik.touched[fieldName] && Boolean(formik.errors[fieldName]);

  const calculateTotalAmount = (values: any) => {
    const roundToFixed = (number, decimals) => {
      return Number(number.toFixed(decimals));
    };

    let goodsAmount = 0;

    for (let i = 0; i < values.challan.length; i++) {
      const challan = values.challan[i];
      goodsAmount = goodsAmount + challan.challanAmount;
    }

    const cgstAmount = (goodsAmount * values.cgstRate) / 100;
    const sgstAmount = (goodsAmount * values.sgstRate) / 100;
    const totalTaxAmount = cgstAmount + sgstAmount;
    const totalAmount = goodsAmount + totalTaxAmount;

    // Round total amount and calculate rounding difference
    const roundedTotalAmount = roundToFixed(totalAmount, 0);
    const roundOff = roundToFixed(totalAmount - roundedTotalAmount, 2);

    // Convert amounts to words
    const totalAmountInWords = convertToIndianRupeesWords(roundedTotalAmount);
    const totalTaxAmountInWords = convertToIndianRupeesWords(totalTaxAmount);

    return {
      goodsAmount,
      cgstAmount,
      sgstAmount,
      totalTaxAmount,
      totalAmount: roundedTotalAmount, // Return the rounded total amount
      totalAmountInWords,
      totalTaxAmountInWords,
      roundOff, // Return the rounding difference
    };
  };

  useEffect(() => {
    if (isSuccess && newInvoice) {
      const invoiceId = newInvoice._id; // Assuming your API returns the saved document
      window.location.href = `/dashboard/invoices/${invoiceId}`;
    }
  }, [isSuccess, newInvoice]);

  return (
    <div>
      <h1>Generate new Invoice</h1>
      {clients && clients.length > 0 && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            const handleSubmit = async () => {
              try {
                // const invoiceData = {
                //   partyName: values.partyName,
                //   address: values.address,
                //   gst: values.gst,
                //   panNo: values.panNo,
                //   state: values.state,
                //   code: values.code,
                // };

                const challanObjectids = values.challan.map((e: any) => e.id);
                const data = { ...values, challan: challanObjectids };
                console.log("data", data);

                await createInvoice(data).unwrap();
                toast.success("Client Created");

                // Handle success (e.g., show a success message, reset the form, etc.)
              } catch (err) {
                // Handle error (e.g., show an error message)
                toast.success("Something went wrong");

                console.error("Failed to create Invoice:", error);
              }
            };
            handleSubmit();
          }}
        >
          {(formik) => {
            useEffect(() => {
              const {
                goodsAmount,
                cgstAmount,
                sgstAmount,
                totalTaxAmount,
                totalAmount,
                totalAmountInWords,
                totalTaxAmountInWords,
                roundOff,
              } = calculateTotalAmount(formik.values);
              formik.setFieldValue("goodsAmount", goodsAmount);

              formik.setFieldValue("cgstAmount", cgstAmount);
              formik.setFieldValue("sgstAmount", sgstAmount);
              formik.setFieldValue("totalTaxAmount", totalTaxAmount);
              formik.setFieldValue("totalAmount", totalAmount);
              formik.setFieldValue("totalAmountInWords", totalAmountInWords);
              formik.setFieldValue("roundOff", roundOff);
              formik.setFieldValue(
                "totalTaxAmountInWords",
                totalTaxAmountInWords
              );
            }, [formik.values.challan]);

            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="invoiceNumber"
                      name="invoiceNumber"
                      label="Invoice Number"
                      variant="filled"
                      fullWidth
                      size="small"
                      value={formik.values.invoiceNumber}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "invoiceNumber")}
                      helperText={
                        isFormFieldValid(formik, "invoiceNumber")
                          ? formik.errors.invoiceNumber
                          : ""
                      }
                    />
                  </Grid>
                  {console.log(formik.errors)}
                  {/* <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="challan"
                      name="challan"
                      label="Challan Number"
                      variant="filled"
                      fullWidth
                      size="small"
                      value={formik.values.challan}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "challan")}
                      helperText={
                        isFormFieldValid(formik, "challan")
                          ? formik.errors.challan
                          : ""
                      }
                    />
                  </Grid> */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Autocomplete
                      multiple
                      options={challanOption}
                      getOptionLabel={(option) => option.label} // Adjust based on client data structure
                      onChange={(event, value: any) => {
                        formik.setFieldValue("challan", value);

                        // onSelect(value);
                      }}
                      renderInput={(params) => (
                        <>
                          <TextField
                            {...params}
                            label="Select Challan"
                            variant="outlined"
                          />
                        </>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="date"
                      id="invoiceDate"
                      name="invoiceDate"
                      label="Invoice Date"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.invoiceDate}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "invoiceDate")}
                      helperText={
                        isFormFieldValid(formik, "invoiceDate")
                          ? formik.errors.invoiceDate
                          : ""
                      }
                      InputLabelProps={{ shrink: true }} // To ensure label does not overlap
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Autocomplete
                      options={clientOption}
                      getOptionLabel={(option) => option.label} // Adjust based on client data structure
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
                      id="paymentTerms"
                      name="paymentTerms"
                      label="Payment Terms"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.paymentTerms}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "paymentTerms")}
                      helperText={
                        isFormFieldValid(formik, "paymentTerms")
                          ? formik.errors.paymentTerms
                          : ""
                      }
                    />
                  </Grid>

                  {/* <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="goodsSerialNumber"
                      name="goodsSerialNumber"
                      label="Goods Serial Number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.goodsSerialNumber}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "goodsSerialNumber")}
                      helperText={
                        isFormFieldValid(formik, "goodsSerialNumber")
                          ? formik.errors.goodsSerialNumber
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="text"
                      id="goodsDescription"
                      name="goodsDescription"
                      label="Goods Description"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.goodsDescription}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "goodsDescription")}
                      helperText={
                        isFormFieldValid(formik, "goodsDescription")
                          ? formik.errors.goodsDescription
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="goodsQuantity"
                      name="goodsQuantity"
                      label="Goods Quantity"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.goodsQuantity}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "goodsQuantity")}
                      helperText={
                        isFormFieldValid(formik, "goodsQuantity")
                          ? formik.errors.goodsQuantity
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="goodsRate"
                      name="goodsRate"
                      label="Goods Rate"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.goodsRate}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "goodsRate")}
                      helperText={
                        isFormFieldValid(formik, "goodsRate")
                          ? formik.errors.goodsRate
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="goodsAmount"
                      name="goodsAmount"
                      label="Goods Amount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.goodsAmount}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "goodsAmount")}
                      helperText={
                        isFormFieldValid(formik, "goodsAmount")
                          ? formik.errors.goodsAmount
                          : ""
                      }
                    />
                  </Grid> */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="cgstRate"
                      name="cgstRate"
                      label="CGST Rate"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.cgstRate}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "cgstRate")}
                      helperText={
                        isFormFieldValid(formik, "cgstRate")
                          ? formik.errors.cgstRate
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="sgstRate"
                      name="sgstRate"
                      label="SGST Rate"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.sgstRate}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "sgstRate")}
                      helperText={
                        isFormFieldValid(formik, "sgstRate")
                          ? formik.errors.sgstRate
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="cgstAmount"
                      name="cgstAmount"
                      label="CGST Amount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.cgstAmount}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "cgstAmount")}
                      helperText={
                        isFormFieldValid(formik, "cgstAmount")
                          ? formik.errors.cgstAmount
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="sgstAmount"
                      name="sgstAmount"
                      label="SGST Amount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.sgstAmount}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "sgstAmount")}
                      helperText={
                        isFormFieldValid(formik, "sgstAmount")
                          ? formik.errors.sgstAmount
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="roundOff"
                      name="roundOff"
                      label="Round off"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.roundOff}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "roundOff")}
                      helperText={
                        isFormFieldValid(formik, "roundOff")
                          ? formik.errors.roundOff
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="totalAmount"
                      name="totalAmount"
                      label="Total Amount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.totalAmount}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "totalAmount")}
                      helperText={
                        isFormFieldValid(formik, "totalAmount")
                          ? formik.errors.totalAmount
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="text"
                      id="totalAmountInWords"
                      name="totalAmountInWords"
                      label="Total Amount In Words"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.totalAmountInWords}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "totalAmountInWords")}
                      helperText={
                        isFormFieldValid(formik, "totalAmountInWords")
                          ? formik.errors.totalAmountInWords
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      id="totalTaxAmount"
                      name="totalTaxAmount"
                      label="Total Tax Amount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.totalTaxAmount}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "totalTaxAmount")}
                      helperText={
                        isFormFieldValid(formik, "totalTaxAmount")
                          ? formik.errors.totalTaxAmount
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="text"
                      id="totalTaxAmountInWords"
                      name="totalTaxAmountInWords"
                      label="Total Tax Amount In Words"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formik.values.totalTaxAmountInWords}
                      onChange={formik.handleChange}
                      error={isFormFieldValid(formik, "totalTaxAmountInWords")}
                      helperText={
                        isFormFieldValid(formik, "totalTaxAmountInWords")
                          ? formik.errors.totalTaxAmountInWords
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
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      {/* Placeholder for client form */}
    </div>
  );
};
export default NewInvoicePage;
