import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ChallansResponsiveTable({ headings, data }: any) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((heading: any) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((i: any) => (
            <TableRow
              key={i.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{i.partyName}</TableCell>
              <TableCell>{i.address}</TableCell>
              <TableCell>{i.gst}</TableCell>
              <TableCell>{i.panNo}</TableCell>
              <TableCell>{i.state}</TableCell>
              <TableCell>{i.code}</TableCell>
              {/* <TableCell align="right">{i.calories}</TableCell> */}
              {/* <TableCell align="right">{i.fat}</TableCell> */}
              {/* <TableCell align="right">{i.carbs}</TableCell> */}
              {/* <TableCell align="right">{i.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
