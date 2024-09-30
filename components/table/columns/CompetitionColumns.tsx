"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Competitior = {
  memberProfile:React.ReactNode
  joiningDate:string
  readBooksInMonth: number
  readBooksInWeek: number
   readBooksInDay: number
  readPagesInMonth:number
  readPagesInWeek: number
  readPagesInDay: number
  readPagesInYear: number
  readBooksInYear: number
  pointsAmount: number
}
 
export const columns: ColumnDef<Competitior>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },

]
