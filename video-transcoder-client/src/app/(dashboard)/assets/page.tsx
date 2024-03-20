import React from "react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import axios from "axios";

const page = async () => {

  // fileName: "VID-20230711-WA0065"
 
  return (
    <main className="flex-grow p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">Assets</h1>
        <Button
          className="px-2 py-1 bg-gray-800 text-white rounded-lg flex items-center space-x-2 text-sm"
          type="button"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Download</span>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Mar 12</TableCell>
            <TableCell>WeWork</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-red-200 text-red-800 rounded-md">
                Office
              </span>
            </TableCell>
            <TableCell>$175.00</TableCell>
            <TableCell>Preview</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
};

export default page;
