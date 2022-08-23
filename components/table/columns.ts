import { Transaction } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
const columnHelper = createColumnHelper<Transaction>();

const columns = [
	columnHelper.accessor("date", {
		id: "date",
		header: "Date",
		cell: (info) => moment(info.getValue()).format("ll"),
	}),
	columnHelper.accessor("amount", {
		id: "amount",
		header: "Amount",
	}),
	columnHelper.accessor("closingBalance", {
		id: "closingBalance",
		header: "Closing Balance",
	}),
	columnHelper.accessor("reference", {
		id: "reference",
		header: "Reference",
	}),
	columnHelper.accessor("description", {
		id: "description",
		header: "Description",
	}),
	columnHelper.accessor("narration", {
		id: "narration",
		header: "Narration",
	}),
];

export default columns;
