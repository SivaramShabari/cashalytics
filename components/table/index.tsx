import { useMemo, useState } from "react";
import columnData from "./columns";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	ColumnOrderState,
} from "@tanstack/react-table";

import moment from "moment";
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from "@chakra-ui/react";
import DraggableColumnHeader from "./DraggableColumn";
import { Transaction } from "@prisma/client";

export default function TransactionsTable({
	transactions,
}: {
	transactions: Transaction[];
}) {
	const columns = useMemo(() => columnData, []);
	const data: Transaction[] = useMemo(() => transactions, [transactions]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		columns.map((column) => column.id as string) //must start out with populated columnOrder so we can splice
	);
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnOrder,
		},
		onColumnOrderChange: setColumnOrder,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
	return (
		<>
			<TableContainer sx={{}}>
				<Table variant="striped">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<DraggableColumnHeader
										key={header.id}
										header={header}
										table={table}
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
										fontWeight={cell.column.id === "type" ? "bold" : "normal"}
										color={
											cell.column.id === "type"
												? cell.getValue() === "INCOME"
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
