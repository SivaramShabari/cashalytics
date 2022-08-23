import { useContext, useEffect, useMemo, useState } from "react";
import columnData from "./columns";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	ColumnOrderState,
	PaginationState,
} from "@tanstack/react-table";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Td,
	TableContainer,
	Button,
	chakra,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Text,
	Flex,
} from "@chakra-ui/react";
import DraggableColumnHeader from "./DraggableColumn";
import { Transaction } from "@prisma/client";
import IndeterminateCheckbox from "./IndeterminiateCheckBox";
import Modal from "./EditTransactionModal";
import SelectColumnModal from "./SelectColumnModal";
import TagsColumn from "./TagsColumn";
import { DataContext } from "../../pages/table-view";
import { FcDown } from "react-icons/fc";
import { BsArrowDown } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";
export default function TransactionsTable({
	page,
	perPage,
	transactions,
}: {
	page: number;
	perPage: number;
	transactions: Transaction[];
}) {
	const [columnVisibility, setColumnVisibility] = useState({});
	const { count, setPage } = useContext(DataContext);
	const maxPages = (count || 100) / perPage;
	const columns = useMemo(
		() => [
			{
				id: "select",
				header: ({ table }: any) => (
					<IndeterminateCheckbox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate: table.getIsSomeRowsSelected(),
							onChange: table.getToggleAllRowsSelectedHandler(),
						}}
					/>
				),
				cell: ({ row }: any) => (
					<div className="px-1">
						<IndeterminateCheckbox
							{...{
								checked: row.getIsSelected(),
								indeterminate: row.getIsSomeSelected(),
								onChange: row.getToggleSelectedHandler(),
							}}
						/>
					</div>
				),
			},
			{
				id: "edit",
				header: "Edit",
				cell: ({ row }: any) => (
					<Modal title={"Edit Transaction"} transaction={row.original} />
				),
			},
			{
				id: "tags",
				header: "Tags",
				cell: ({ row }: any) => <TagsColumn tagIds={row.original.tags} />,
			},
			...columnData,
		],
		[]
	);
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	);
	const data: Transaction[] = useMemo(() => transactions, [transactions]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		columns.map((column) => column.id as string) //must start out with populated columnOrder so we can splice
	);
	const table = useReactTable({
		data,
		columns,
		manualPagination: true,
		pageCount: -1,
		state: {
			sorting,
			columnOrder,
			pagination,
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onColumnOrderChange: setColumnOrder,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
	useEffect(() => {
		table.setPageIndex(page);
		table.setPageSize(perPage);
	}, [table, page, perPage]);
	return (
		<>
			<SelectColumnModal table={table} />
			<Menu>
				<MenuButton
					ml={2}
					variant={"outline"}
					colorScheme="blue"
					size="sm"
					as={Button}
				>
					<Flex>
						Page {page}
						<chakra.span ml={2} mt={0.5}>
							<AiFillCaretDown />
						</chakra.span>
					</Flex>
				</MenuButton>
				<MenuList>
					{Array.from({ length: maxPages || 1 }, (_, i) => i + 1).map((i) => (
						<MenuItem onClick={() => setPage(i)} key={i}>
							{i}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			<Button
				onClick={() => setPage(Math.max(page - 1, 1))}
				ml={2}
				variant="outline"
				colorScheme="blue"
				size="sm"
			>
				<chakra.span mr={2}>{"<"}</chakra.span>Previous Page
			</Button>
			<Button
				onClick={() => setPage(page + 1)}
				ml={2}
				variant="outline"
				colorScheme="blue"
				size="sm"
			>
				Next Page <chakra.span ml={2}>{">"}</chakra.span>
			</Button>
			<TableContainer>
				<Table variant="striped">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<DraggableColumnHeader
										key={header.id}
										header={header as any}
										table={table as any}
									/>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody sx={{ overflow: "auto" }}>
						{table.getRowModel().rows.map((row) => (
							<Tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<Td
										key={cell.id}
										fontWeight={cell.column.id === "amount" ? "bold" : "normal"}
										color={
											cell.column.id === "amount"
												? cell.row.original.type === "Credit"
													? "green.500"
													: "orange.500"
												: ""
										}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Td>
								))}
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
}
