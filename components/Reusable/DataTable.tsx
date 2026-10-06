"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  RowData,
  SortingState,
  Table as TableData,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface UseReactTableOption<TData extends RowData> {
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}
export function useDataTable<TData, TCols extends ColumnDef<TData>[]>(
  initialData: TData[],
  columns: TCols,
  options?: UseReactTableOption<TData>,
) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: initialData, // ✅ always fresh
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: options?.getRowId,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return { table };
}

interface DataTableProps<TData> {
  table: TableData<TData>;
  headerTitle?: React.ReactNode;
  headerControls?: React.ReactNode;
  datapicker?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  headerTitle,
  headerControls,
  datapicker,
}: DataTableProps<TData>) {
  return (
    <div className="overflow-hidden mt-[14px]">
      <div className="pb-[32px] flex justify-between items-center ">


        <p className="text-2xl text-[#1E1E20] font-semibold">{headerTitle}</p>
        <p className="text-2xl text-[#1E1E20] font-semibold">{datapicker}</p>
        {headerControls}
      </div>

      <Table className="accent-primary">
        <TableHeader className="text-[#1D1F2C] font-sfpro text-[14px] font-medium leading-[140%] tracking-[0.07px] not-italic">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-b-0!" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="text-sm  last:pr-4 font-medium text-[#1D1F2C] bg-[#F6F8FA]"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className=" py-[7px] md:py-[10px] px-4 " key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getRowModel().rows?.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* table footer controls */}
      <div className="flex items-center gap-3 justify-between py-4 border-t text-sm text-[#0D0D12]">
        {/* show selection count */}
        {/* <div className="text-muted-foreground hidden flex-1 text-sm lg:flex"> */}
        {/*   {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
        {/*   {table.getFilteredRowModel().rows.length} row(s) selected. */}
        {/* </div> */}

        <div className="mr-auto flex items-center gap-2">
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <EllipsisPagination
            pageIndex={table.getState().pagination.pageIndex + 1}
            pageCount={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>

        <div className="hidden lg:flex">
          {(() => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const totalRows = table.getFilteredRowModel().rows.length;
            const start = pageIndex * pageSize + 1;
            const end = Math.min((pageIndex + 1) * pageSize, totalRows);

            return (
              <span className="text-[#687588]">
                Showing {start} to {end} of {totalRows} entries
              </span>
            );
          })()}
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-2 lg:flex">
            <Label
              htmlFor="rows-per-page"
              className="text-sm sr-only font-medium"
            >
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-26" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPages(
  pageIndex: number,
  pageCount: number,
  maxVisible: number = 3,
) {
  const pages: (number | string)[] = [];

  if (pageCount <= maxVisible + 2) {
    // Show all pages if few total
    for (let i = 1; i <= pageCount; i++) pages.push(i);
    return pages;
  }

  const left = Math.floor(maxVisible / 2);
  const right = maxVisible - left - 1;

  let startPage = Math.max(2, pageIndex - left);
  let endPage = Math.min(pageCount - 1, pageIndex + right);

  if (pageIndex <= left + 1) {
    startPage = 2;
    endPage = maxVisible + 1;
  }

  if (pageIndex >= pageCount - right) {
    startPage = pageCount - maxVisible;
    endPage = pageCount - 1;
  }

  // Always include first page
  pages.push(1);

  if (startPage > 2) pages.push("...");

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  if (endPage < pageCount - 1) pages.push("...");

  // Always include last page
  pages.push(pageCount);

  return pages;
}

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function EllipsisPagination({
  pageIndex,
  pageCount,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {getPages(pageIndex, pageCount).map((page, idx) => {
        return (
          <Button
            variant="ghost"
            key={idx}
            disabled={page == "..."}
            onClick={() => onPageChange(Number(page))}
            className={cn(
              "size-8 text-foreground text-sm font-medium enabled:cursor-pointer rounded-xl",
              { "bg-primary text-white hover:bg-primary hover:text-white": pageIndex === page },
            )}
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
}
