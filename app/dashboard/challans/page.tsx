"use client";

import React from "react";
import { useRouter } from "next/router";
import { useGetChallansQuery } from "@/redux/challansApi";
import ChallansResponsiveTable from "@/app/components/ChallansResponsiveTable";
import { Button } from "@mui/material";
import Link from "next/link";

const ChallansPage: React.FC = () => {
  // const router = useRouter();
  const { data: challans, isLoading, error } = useGetChallansQuery(null);
  const headings = [
    "challanNumber",
    "client",
    "totalMeters",
    "challanAmount",
    "quality",
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading challans.</p>;

  return (
    <div>
      <h1>Challans</h1>
       <Link href="/dashboard/challans/new">
      <Button variant="contained" >
      New Challan
      </Button>
      </Link>
        
      <ChallansResponsiveTable
        headings={headings}
        data={challans}
      ></ChallansResponsiveTable>
    </div>
  );
};

export default ChallansPage;
