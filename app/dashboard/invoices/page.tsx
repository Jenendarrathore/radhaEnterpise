'use client';

import InvoicesResponsiveTable from '@/app/components/InvoicesResponsiveTable';
import { useGetInvoicesQuery } from '@/redux/invoicesApi';
import { Button } from '@mui/material';
import Link from 'next/link';

// app/invoices/page.tsx
export default function InvoicesPage() {
  const { data: invoices, isLoading, error } = useGetInvoicesQuery(null);
  const headings = ['SrNo', 'Client', 'Address', 'Amount'];

  const handleInvoiceClick = (id: string) => {
    // router.push(`/clients/${id}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading clients.</p>;
  return (
    <div>
      <h1 className="mb-4">Invoice</h1>
      <Link href="/dashboard/invoices/new">
            <Button variant="contained">New Invoice</Button>
          </Link>

      <InvoicesResponsiveTable
        headings={headings}
        data={invoices}
      ></InvoicesResponsiveTable>
    </div>
  );
}
