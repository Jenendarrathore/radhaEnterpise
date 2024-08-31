"use client";
import GeneratePdf from "@/app/components/GeneratePdf";
import { useGetInvoiceByIdQuery } from "@/redux/invoicesApi";

// app/invoices/[id]/page.tsx
export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Invoice Details: </h1>
      <GeneratePdf params={params.id}></GeneratePdf>
      {/* Placeholder for invoice details */}
    </div>
  );
}
