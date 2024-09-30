"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import React from "react"


import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClubMember = {
  nickname: string
  photoURL: string
  id:string 
  joiningDate:Date
  readBooksInMonth: number
  readBooksInWeek: number
   readBooksInDay: number
  readPagesInMonth:number
  readPagesInWeek: number
  readPagesInDay: number
  readPagesInYear: number
  readBooksInYear:number
}
 
export const columns: ColumnDef<ClubMember>[] = [
  {
    accessorKey: 'memberProfile',
    header: "Member",
  },
  {
    accessorKey: 'joiningDate',
    header: "Joined",
  },
    {
    accessorKey: 'readBookInDay',
    header: "Read Books (Week)",
  },
    {
    accessorKey: 'readBooksInWeek',
    header: "Read Books (Week)",
  },
  {
    accessorKey: 'readBooksInMonth',
    header: "Read Books (Month)",
  },
    {
    accessorKey: 'readBooksInYear',
    header: "Read Books (Year)",
  },
       {
    accessorKey: 'readPagesInDay',
    header: "Read Pages (Week)",
  },
    {
    accessorKey: 'readPagesInWeek',
    header: "Read Pages (Week)",
  },
  {
    accessorKey: 'readPagesInMonth',
    header: "Read Pages (Month)",
  },
    {
    accessorKey: 'readPagesInYear',
    header: "Read Pages (Year)",
  },
    {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
