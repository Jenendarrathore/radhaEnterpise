"use client";

import React from "react";
import { useRouter } from "next/router";
import { useGetClientsQuery } from "@/redux/clientsApi";
import CleintsResponsiveTable from "@/app/components/ClientsResponsiveTable";
import { Button } from "@mui/material";
import Link from "next/link";

const ClientsPage: React.FC = () => {
  // const router = useRouter();
  const { data: clients, isLoading, error } = useGetClientsQuery(null);
  const headings = ["partyName", "address", "gst", "panNo", "state", "code"];
  const handleClientClick = (id: string) => {
    // router.push(`/clients/${id}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading clients.</p>;

  return (
    <div>
      <h1>Clients</h1>
      <Link href="/dashboard/clients/new">
            <Button variant="contained">New Client</Button>
          </Link>

      <CleintsResponsiveTable
        headings={headings}
        data={clients}
      ></CleintsResponsiveTable>
    </div>
  );
};

export default ClientsPage;
