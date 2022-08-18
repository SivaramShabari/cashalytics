import { Transaction } from "@prisma/client";
import type { NextPage } from "next";
import SidebarWithHeader from "../components/Sidenav";
import TransactionsTable from "../components/table";
import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
type Props = {
	transactions: Transaction[];
};
const TableView: NextPage<Props> = ({ transactions }) => {
	return (
		<>
			<SidebarWithHeader>
				<TransactionsTable transactions={transactions} />
			</SidebarWithHeader>
		</>
	);
};

export default TableView;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session)
		return {
			redirect: {
				destination: "/signin",
				permanent: true,
			},
		};
	const prisma = new PrismaClient();
	const res = await prisma.transaction.findMany({
		// take: 25,
		// orderBy: { amount: "desc" },
	});
	const transactions = await JSON.parse(JSON.stringify(res));
	prisma.$disconnect();
	return {
		props: {
			transactions: transactions,
		},
	};
};
