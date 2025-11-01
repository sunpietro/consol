"use client";

import { formatDate } from "@/helpers/date";
import { tw } from "@/helpers/twMerge";
import { useIdentities } from "@/hooks/identities";
import { IdentityWithSessions } from "@/services/users";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const columnHelper = createColumnHelper<IdentityWithSessions>();
const columns = [
  columnHelper.accessor("id", {
    cell: (info) => {
      const circle = (
        <span
          className={tw("inline-block w-8 h-8 rounded-full", getRandomColor())}
        ></span>
      );

      return (
        <span className="inline-flex items-center gap-4">
          {circle}
          {info.getValue()}
        </span>
      );
    },
    header: () => "ID",
  }),
  columnHelper.accessor((row) => row.traits["email"], {
    id: "email",
    cell: (info) => info.getValue(),
    header: () => "Email",
  }),
  columnHelper.accessor("schema_id", {
    cell: (info) => info.getValue(),
    header: () => "Schema",
  }),
  columnHelper.accessor((row) => row.verifiable_addresses?.[0]?.verified, {
    id: "email_verified",
    cell: (info) => {
      const isVerified = info.getValue();
      const dot = (
        <span
          className={tw(
            "inline-block w-2 h-2 rounded-full",
            isVerified ? "bg-green-500" : "bg-red-500"
          )}
        ></span>
      );
      const content = isVerified ? "Verified" : "Pending";

      return (
        <span className="inline-flex items-center gap-2">
          {dot} {content}
        </span>
      );
    },
    header: () => "Status",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => {
      const date = info.getValue();
      if (!date) return "";
      return formatDate(date);
    },
    header: () => "Created At",
  }),
  columnHelper.accessor((row) => row.sessions?.[0]?.authenticated_at, {
    id: "last_login",
    cell: (info) => (info.getValue() ? formatDate(info.getValue()!) : "N/A"),
    header: () => "Last Login",
  }),
  columnHelper.accessor((row) => row.id, {
    id: "action",
    cell: (info) => {
      return <Link href={`/identities/${info.getValue()}`}>View</Link>;
    },
    header: () => null,
  }),
];

export const Identities = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, isFetching } = useIdentities({
    pageSize: pagination.pageSize,
    pageToken: pageToken,
  });

  const identities = data?.identities || [];
  const hasNextPage = !!data?.nextPageToken;

  const table = useReactTable({
    data: identities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className="flex flex-col gap-7">
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="bg-foreground font-mono text-body-secondary text-xsmall font-normal py-3 px-6 text-left border-b border-accent uppercase min-w-fit"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-small text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-accent">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-small">
                    <div className="flex items-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isFetching && (
        <footer className="flex items-center gap-8 text-body-secondary text-small justify-end">
          <div className="flex items-center gap-2">
            <span>Items per page: </span>
            <select
              value={table.getState().pagination.pageSize}
              className="cursor-pointer border border-accent rounded p-2 bg-transparent hover:bg-accent focus:bg-accent"
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Items</span>
            <span>
              {`${
                table.getState().pagination.pageIndex * pagination.pageSize + 1
              }-${
                table.getState().pagination.pageIndex * pagination.pageSize +
                table.getRowModel().rows.length
              } of 
              ${
                hasNextPage
                  ? `${table.getPageCount() * pagination.pageSize}+`
                  : table.getState().pagination.pageIndex *
                      pagination.pageSize +
                    table.getRowModel().rows.length
              }`}
            </span>
          </div>
          <div className="flex items-center gap-2 transition-colors">
            <button
              className="cursor-pointer p-2 rounded bg-transparent hover:bg-accent focus:bg-accent"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              &lt;&lt;
            </button>
            <button
              className="cursor-pointer p-2 rounded hover:bg-accent focus:bg-accent"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              &lt;
            </button>
            <button
              className="cursor-pointer p-2 rounded hover:bg-accent focus:bg-accent"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              &gt;
            </button>
            <button
              className="cursor-pointer p-2 rounded hover:bg-accent focus:bg-accent"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              &gt;&gt;
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
