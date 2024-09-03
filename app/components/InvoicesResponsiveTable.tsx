import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { formatAmount } from '@/helper/helper';
import Link from 'next/link';

export default function InvoicesResponsiveTable({ headings, data }: any) {

  const totalAmount = () => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      total  = total + e.totalAmount
      
    }
    return total
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
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
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{i.invoiceNumber}</TableCell>
              <TableCell>{i.client.partyName}</TableCell>
              <TableCell>{i.client.address}</TableCell>
              <TableCell>₹ {formatAmount(i.totalAmount)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  // href={`/dashboard/invoices/${i._id}`} // Use template literals to include the ID in the URL
                >
                  <Link href={`/dashboard/invoices/${i._id}`}>
                    Generate Pdf
                  </Link>
                </Button>
              </TableCell>

              {/* <TableCell align="right">{i.calories}</TableCell> */}
              {/* <TableCell align="right">{i.fat}</TableCell> */}
              {/* <TableCell align="right">{i.carbs}</TableCell> */}
              {/* <TableCell align="right">{i.protein}</TableCell> */}
            </TableRow>
          ))}
          <p>{totalAmount()}</p>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
