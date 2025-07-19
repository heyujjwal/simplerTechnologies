import * as React from "react"
import type { 
  ColumnDef, 
  ColumnFiltersState, 
  SortingState, 
  VisibilityState 
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"

import { Button } from "./components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Input } from "./components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"
import { cn } from "./lib/utils"
import { Badge } from "./components/ui/badge"
import { Skeleton } from "./components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip"

export type User = {
  id: number
  name: string
  email: string
  mobile: string
  status: "active" | "inactive"
  avatar: string
}

type RawUser = Omit<User, 'status'> & {
    status: "Active" | "Inactive";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold">Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          
        </div>
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-semibold">Email</span>,
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="lowercase truncate max-w-[180px]">
            {row.getValue("email")}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{row.getValue("email")}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "mobile",
    header: () => <span className="font-semibold">Mobile</span>,
    cell: ({ row }) => <div className="font-mono">{row.getValue("mobile")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === 'active';
      
      return (
        <Badge 
          variant={isActive ? "success" : "destructive"} 
          className="capitalize font-medium"
        >
          {isActive ? (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Active
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              Inactive
            </span>
          )}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-gray-100"
              aria-label="Open actions menu"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id.toString())}
              className="cursor-pointer"
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={cn(
                "cursor-pointer",
                user.status === 'active' ? "text-red-600" : "text-green-600"
              )}
            >
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function App() {
  const [data, setData] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const fetchData = React.useCallback(async () => {
    try {
      const loadingState = isRefreshing ? setIsRefreshing : setLoading;
      loadingState(true);
      
      const response = await fetch("http://localhost:3001/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawUsers: RawUser[] = await response.json();
      
      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const formattedUsers: User[] = rawUsers.map(user => ({
          ...user,
          status: user.status.toLowerCase() as "active" | "inactive",
      }));

      setData(formattedUsers);
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
          setError(`Failed to fetch data: ${e.message}`);
      } else {
          setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })


  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered users in the system</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-50 gap-20">
            <div className="w-50 lg:w-1/2 mx-auto">
              <div className="relative">
                <Input
                  placeholder="Search users by name..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className={cn(
                    "w-full h-12 pr-11 text-base", 
                    "border-3 border-black rounded-10", 
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    "transition-all duration-200 ease-in-out", 
                    "shadow-sm hover:shadow-md" 
                  )}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-1 w-1 text-gray-700 hover:text-black cursor-pointer" />
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 px-4 shadow-sm hover:bg-gray-50 border-gray-200"
                  >
                    <span className="mr-2">Columns</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 max-h-64 overflow-y-auto"
                >
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: boolean) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-auto">
            <Table className="min-w-[800px] sm:min-w-full">
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id}
                          className="text-gray-600 font-semibold"
                        >
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
                {loading && !isRefreshing ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      {table.getAllColumns().map((column) => (
                        <TableCell key={`skeleton-cell-${i}-${column.id}`}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-red-500 mb-2">Error loading data</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={fetchData}
                        >
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-gray-500 mb-2">No users found</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            table.resetColumnFilters()
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> of{" "}
              <span className="font-medium">{data.length}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 text-sm">
                <span>Page</span>
                <span className="font-medium">
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}