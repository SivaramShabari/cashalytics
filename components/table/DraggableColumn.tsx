import { FC } from "react";

import {
	Column,
	ColumnOrderState,
	flexRender,
	Header,
	Table,
} from "@tanstack/react-table";
import { Th } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";

const reorderColumn = (
	draggedColumnId: string,
	targetColumnId: string,
	columnOrder: string[]
): ColumnOrderState => {
	columnOrder.splice(
		columnOrder.indexOf(targetColumnId),
		0,
		columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
	);
	return [...columnOrder];
};

const DraggableColumnHeader: FC<{
	header: Header<any, unknown>;
	table: Table<any>;
}> = ({ header, table }) => {
	const { getState, setColumnOrder } = table;
	const { columnOrder } = getState();
	const { column } = header;

	const [, dropRef] = useDrop({
		accept: "column",
		drop: (draggedColumn: Column<any>) => {
			const newColumnOrder = reorderColumn(
				draggedColumn.id,
				column.id,
				columnOrder
			);
			setColumnOrder(newColumnOrder);
		},
	});

	const [{ isDragging }, dragRef, previewRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: () => column,
		type: "column",
	});

	return (
		<Th
			colSpan={header.colSpan}
			ref={dropRef}
			sx={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<div ref={previewRef}>
				{header.isPlaceholder ? null : (
					<div
						ref={dragRef}
						{...{
							className: header.column.getCanSort()
								? "cursor-pointer select-none"
								: "",
							onClick: header.column.getToggleSortingHandler(),
						}}
					>
						{flexRender(header.column.columnDef.header, header.getContext())}
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[header.column.getIsSorted() as string] ?? null}
					</div>
				)}
			</div>
		</Th>
	);
};

export default DraggableColumnHeader;
