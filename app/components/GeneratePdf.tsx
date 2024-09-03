'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSession } from 'next-auth/react';
import { useGetInvoiceByIdQuery } from '@/redux/invoicesApi';
import { formatAmount } from '@/helper/helper';
import { Button } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

const GeneratePdf = ({ params }: any) => {
  const { data: session, status } = useSession();
  const [displayInvoice, setdisplayInvoice] = useState(false);
  // const [invoiceData, setinvoiceData] = useState<any>(null);

  const {
    data: invoiceData,
    error,
    isLoading,
    isError,
  } = useGetInvoiceByIdQuery(params);

  console.log('invoiceData', invoiceData);
  console.log('error', error);

  const handleDownload = () => {
    const input = document.getElementById('booking_invoice');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, 0, 0, pdfWidth, 0);
        pdf.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
      });
    }
  };

  return (
    <>
      <div className="invoice_btn_wrap">
        <div className="btn_item">
          <Link href="/dashboard/invoices">
            <Button variant="contained">View All Invoices</Button>
          </Link>
        </div>

        {/* {displayInvoice ? ( */}
        <>
          <div className="btn_item">
            
            <Button variant="contained" onClick={handleDownload}>
              Download Receipt
            </Button>
          </div>
        </>
        {/* ) : null} */}
      </div>

      {/* {displayInvoice ? ( */}
      <>
        <div id="booking_invoice" className="invoive_mian_wrap">
          <div className="invoice_template_wrap">
            <div className="invoice_header">
              {/* <div className="invoice_logo_wrap">
                <img src="/images/invoice/invoice-logo.png" alt="Raheja" />
              </div> */}
              <div className="invoice_address_wrap">
                <h4 className="invoice_title">RADHA ENTERPRISES</h4>
                <p className="invoice_gst">
                  GST Number: <span>27DHOPR3745H1ZR</span>
                </p>
                <p className="invoice_address">
                  B/108,Rajni Gandha,Sanghvi Garden,
                  <br />
                  Manpada Road,Kalyan,
                  <br />
                  Thane 421204
                  <br></br>
                  State Name: Maharashtra, Code:27
                </p>
              </div>
            </div>
            <div className="bodyHeading">Tax Invoice</div>

            <div className="invoice_body">
              <div className="invoice_body_top">
                <div className="bill_to">
                  <h5>To</h5>
                  <p className="bill_name">
                    {invoiceData && invoiceData?.client?.partyName}
                  </p>
                  <p className="bill_address">
                    {invoiceData && invoiceData.client?.address},<br />
                    {invoiceData &&
                      invoiceData?.client?.state +
                        ' ' +
                        invoiceData?.client?.code}
                  </p>
                </div>
                <div className="invoice_payment">
                  <p>
                    <span>Receipt Date:</span>{' '}
                    {invoiceData &&
                      moment(invoiceData.invoiceDate).format('DD-MM-YYYY')}
                  </p>

                  <p>
                    <span>Invoice No:</span>{' '}
                    {invoiceData && invoiceData.invoiceNumber}
                  </p>
                  {/* <p>
                    <span>Challan No:</span>{" "}
                    {invoiceData && invoiceData.challanNumber}
                  </p> */}
                </div>
              </div>
              <div className="invoice_booking_details">
                {/* <table className="invoice_table for_mobile">
                  <tbody>
                    <tr>
                      <th>Sr no</th>
                      <th>Description of Goods</th>
                      <th>Hsn/Sac</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Per</th>
                      <th>Disc %</th>
                      <th>Amount</th>
                    </tr>
                  </tbody>
                </table> */}
                <table className="invoice_table for_desktop">
                  <thead>
                    <tr>
                      <th>Sr no</th>
                      <th>Challan No</th>

                      <th>Description of Goods</th>
                      <th>Hsn/Sac</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Per</th>
                      <th>Disc %</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoiceData &&
                      invoiceData.challan.length > 0 &&
                      invoiceData.challan.map((e: any, index: number) => (
                        <tr key={e._id}>
                          <td>{index + 1}</td>
                          <td>{e.challanNumber}</td>
                          <td>{e.quality}</td>
                          <td>996111</td>
                          <td>{e.totalMeters} Mtrs.</td>
                          <td>{e.rate}</td>
                          <td>-</td>
                          <td>0</td>
                          <td>{formatAmount(e.challanAmount)}</td>
                        </tr>
                      ))}

                    <tr>
                      <td></td>
                      <td></td>

                      <td>CGST</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {invoiceData && formatAmount(invoiceData.cgstAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td></td>

                      <td></td>
                      <td>SGST</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {invoiceData && formatAmount(invoiceData.sgstAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>

                      <td>Round off</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{invoiceData && invoiceData.roundOff}</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td></td>

                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {invoiceData && formatAmount(invoiceData.totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br></br>
              <div className="invoice_body_top">
                <div className="bill_to">
                  <h5>Amount Chargeable in words</h5>
                  <p className="bill_name">
                    ₹ {invoiceData && invoiceData.totalAmountInWords}
                  </p>
                </div>
                <div className="invoice_payment">
                  <p>
                    <span>Total Amount:</span> ₹{' '}
                    {invoiceData && formatAmount(invoiceData.totalAmount)}
                  </p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>HSN/SAC</th>
                    <th rowSpan={2}>Taxable Value</th>
                    <th colSpan={2}>CGST</th>
                    <th colSpan={2}>SGST/UTGST</th>
                    <th rowSpan={2}>Total</th>
                  </tr>
                  <tr>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>996111</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.goodsAmount)}
                    </td>
                    <td>{invoiceData && invoiceData.cgstRate}%</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.cgstAmount)}
                    </td>
                    <td>{invoiceData && invoiceData.sgstRate}%</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.sgstAmount)}
                    </td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.totalTaxAmount)}
                    </td>
                  </tr>
                  <tr className="total">
                    <td>Total</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.goodsAmount)}
                    </td>
                    <td>{invoiceData && invoiceData.cgstRate}%</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.cgstAmount)}
                    </td>
                    <td>{invoiceData && invoiceData.sgstRate}%</td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.sgstAmount)}
                    </td>
                    <td>
                      {invoiceData && formatAmount(invoiceData.totalTaxAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br></br>
              <div className="invoice_body_top">
                <div className="">
                  <h5>Tax Amount in words</h5>
                  <p className="bill_name">
                    ₹ {invoiceData && invoiceData.totalTaxAmountInWords}
                  </p>
                </div>
              </div>
              <div className="invoice_body_top">
                <div className="bill_to"></div>
                <div className="invoice_payment">
                  <h5>Companys Bank Details</h5>
                  <p className="bill_name">Companys PAN :DHOPR3745H</p>

                  <p>
                    A/c Holders Name : RADHA ENTERPRISES <br />
                    Bank Name : UNION BANK <br />
                    A/c No : 576201010050963 <br />
                    Branch & Ifs Code : DOMBIVLI (E) & UBIN0557625
                  </p>
                </div>
              </div>
            </div>

            <div className="invoice_footer">
              <div className="invoice_footer_left">
                <div className="rera_wrap">
                  <h5>Declaration </h5>
                  <p className="rera_dis">
                    We declare that this invoice shows the actual price of the
                    goods described and that all particulars are true and
                    correct{' '}
                  </p>
                </div>
              </div>
              <div className="invoice_footer_right"></div>
            </div>
            <div className="invoice_footer">
              <div className="invoice_footer_left">
                <div className="rera_wrap">
                  <h5>Customers Seal and Signature </h5>
                </div>
              </div>
              <div className="invoice_footer_right">
                <h5>For RADHA ENTERPRISES</h5>
                <p>Authorised Signatory </p>{' '}
              </div>
            </div>
            <div className="invoice_copy"></div>
          </div>
        </div>
      </>
      {/* ) : ( */}
      {/* <>
        <p className="no_invoice">No Invoice Found</p>
      </> */}
      {/* )} */}
    </>
  );
};

export default GeneratePdf;
