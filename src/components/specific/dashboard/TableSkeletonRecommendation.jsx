import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

const TableSkeletonRecommendation = () => {
  return (
    <Table aria-label="Recommendation Table">
      <TableHeader>
        <TableColumn>Nama Kost</TableColumn>
        <TableColumn>Kota</TableColumn>
        <TableColumn>Alamat</TableColumn>
        <TableColumn>Tanggal dibuat</TableColumn>
        <TableColumn>Aksi</TableColumn>
      </TableHeader>
      <TableBody>
        {Array(5)
          .fill()
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-6 rounded-lg p-0" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded-lg p-0" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded-lg p-0" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded-lg p-0" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded-lg p-0" />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeletonRecommendation;
