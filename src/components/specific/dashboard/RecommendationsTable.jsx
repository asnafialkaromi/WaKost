import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import formatDate from "../../../utils/dateFormatter";

const RecomendationTable = ({ recommendations, onDeleteClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Nama Kost</TableColumn>
        <TableColumn>Kota</TableColumn>
        <TableColumn>Alamat</TableColumn>
        <TableColumn>Tanggal dibuat</TableColumn>
        <TableColumn>Aksi</TableColumn>
      </TableHeader>
      <TableBody>
        {recommendations.map((rec) => (
          <TableRow key={rec.id}>
            <TableCell>{rec.properties.name}</TableCell>
            <TableCell>{rec.properties.city}</TableCell>
            <TableCell>{rec.properties.address}</TableCell>
            <TableCell>{formatDate(rec.created_at)}</TableCell>
            <TableCell>
              <Button
                color="danger"
                size="sm"
                onPress={() => onDeleteClick(rec.id)}
              >
                Hapus
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecomendationTable;
