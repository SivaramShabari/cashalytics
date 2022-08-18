import { Transaction } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { Text } from "@chakra-ui/react";
const columnHelper = createColumnHelper<Transaction>();

const columns = [
	columnHelper.accessor("type", {
		id: "type",
		header: "Type",
	}),
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
];

export default columns;
