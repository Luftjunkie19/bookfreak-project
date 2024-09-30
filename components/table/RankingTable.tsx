"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
      VisibilityState,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnFiltersState
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Button from "components/buttons/Button"
import { useState } from "react"



 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>();
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  const table = useReactTable({
    data,
    columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
      state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })
 
    return (
      <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={()=> table.previousPage()} disableState={!table.getCanPreviousPage()} type='black'>Previous</Button>
                <Button onClick={()=> table.nextPage()} disableState={!table.getCanNextPage()} type='black'>Next</Button>
            </div>
      </>
  )
}