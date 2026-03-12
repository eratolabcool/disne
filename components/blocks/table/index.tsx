import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Copy from "./copy";
import { TableColumn } from "@/types/blocks/table";
import type { ReactNode } from "react";

type TableBlockProps = {
  columns?: TableColumn[];
  data?: unknown[];
  empty_message?: string;
};

export default function TableBlock({
  columns,
  data,
  empty_message,
}: TableBlockProps) {
  const safeColumns = columns ?? [];

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {safeColumns.map((item: TableColumn, idx: number) => {
              return (
                <TableHead key={idx} className={item.className}>
                  {item.title}
                </TableHead>
              );
            })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item: unknown, idx: number) => {
            const row = (item ?? {}) as Record<string, unknown>;

            return (
              <TableRow key={idx}>
                {safeColumns.map((column: TableColumn, iidx: number) => {
                  const key = column.name ?? "";
                  const value = key ? row[key] : undefined;
                  const content = (column.callback
                    ? column.callback(item)
                    : value) as ReactNode;

                  if (column.type === "copy" && typeof value === "string") {
                    return (
                      <TableCell key={iidx} className={column.className}>
                        <Copy text={value}>{content}</Copy>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={iidx} className={column.className}>
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={safeColumns.length}>
              <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                <p>{empty_message}</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
