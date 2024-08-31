"use client";

import React from "react";
import { useRouter } from "next/router";
import { useGetChallansQuery } from "@/redux/challansApi";
import ChallansResponsiveTable from "@/app/components/ChallansResponsiveTable";

const ChallansPage: React.FC = () => {
  // const router = useRouter();
  const { data: challans, isLoading, error } = useGetChallansQuery(null);
  const headings = ["partyName", "address", "gst", "panNo", "state", "code"];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading challans.</p>;

  return (
    <div>
      <h1>Challans</h1>
      <ChallansResponsiveTable
        headings={headings}
        data={challans}
      ></ChallansResponsiveTable>
    </div>
  );
};

export default ChallansPage;
