import { Tag, Transaction } from "@prisma/client";
import type { NextPage } from "next";
import SidebarWithHeader from "../components/Sidenav";
import TransactionsTable from "../components/table";
import { useEffect, useState, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { filters } from "../types/filter";
import axios, { AxiosResponse } from "axios";
import { NEXT_URL } from "../config";
import { Button, Flex, Text, chakra } from "@chakra-ui/react";
import Filters from "../components/table/FiltersModal";
export const DataContext = createContext<{
	tags: Tag[];
	page: number;
	count: number;
	setPage: (n: number) => void;
}>({
	tags: [],
	page: 1,
	count: 100,
	setPage: (n: number) => {},
});
type Props = {
	transactions: Transaction[];
};
const TableView: NextPage<Props> = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<filters>({
		paginate: {
			page: 1,
			perPage: 30,
		},
	});
	const transactions = useGetTransactions({ ...filters });
	const tags = useGetTags();
	const count = transactions.data?.data.count;
	useEffect(() => {
		transactions.refetch();
		const maxPage = Math.floor((count || 100) / filters.paginate!.perPage);
		if (filters.paginate!.page > maxPage) {
			setFilters((f) => ({
				...f,
				paginate: {
					page: Math.max(1, maxPage),
					perPage: f.paginate!.perPage,
				},
			}));
		}
	}, [filters]);
	const setPage = (n: number) => {
		setFilters((f) => ({
			...f,
			paginate: {
				perPage: f.paginate!.perPage,
				page: n,
			},
		}));
	};
	return (
		<>
			<DataContext.Provider
				value={{
					tags: tags.data?.data || ([] as any),
					page: filters.paginate!.page,
					count: count || 100,
					setPage,
				}}
			>
				<SidebarWithHeader>
					<Flex>
						<Text fontWeight="bold">
							Total Transactions: {transactions.data?.data.count || "0"}{" "}
						</Text>
						<Text ml={5} fontWeight="bold">
							Total Credit Amount:{" "}
							{transactions.data?.data.transactions
								.filter((t) => t.type === "Credit")
								.map((t) => t.amount)
								.reduce((prev, curr) => prev + curr, 0)
								.toLocaleString("en-in")}{" "}
						</Text>
						<Text ml={5} fontWeight="bold">
							Total Debit Amount:{" "}
							{transactions.data?.data.transactions
								.filter((t) => t.type === "Debit")
								.map((t) => t.amount)
								.reduce((prev, curr) => prev + curr, 0)
								.toLocaleString("en-in")}{" "}
						</Text>
					</Flex>
					<Filters
						filters={filters}
						searchQuery={searchQuery}
						setFilters={setFilters}
						setSearchQuery={setSearchQuery}
					/>
					<TransactionsTable
						page={filters.paginate!.page}
						perPage={filters.paginate!.perPage}
						transactions={transactions?.data?.data.transactions || []}
					/>
				</SidebarWithHeader>
			</DataContext.Provider>
		</>
	);
};

export default TableView;

const getAllTransactions = async (
	filters: filters
): Promise<
	AxiosResponse<{ transactions: Transaction[]; count: number }, any>
> => {
	let query = "";
	if (filters.count) query = query + `&count=${filters.count}`;
	if (filters.search) query = query + `&search=${filters.search}`;
	if (filters.tags) query = query + `&tags=${filters.tags.join(",")}`;
	if (filters.paginate) {
		const { page, perPage } = filters.paginate;
		query = query + `&page=${page}&perPage=${perPage}`;
	}
	if (filters.date) {
		const { from, to } = filters.date;
		query = query + `&from=${from}&to=${to}`;
	}
	if (filters.amount) {
		const { minAmount, maxAmount } = filters.amount;
		query = query + `&minAmount=${minAmount}&maxAmount=${maxAmount}`;
	}
	if (filters.orderBy) {
		const { field, direction } = filters.orderBy;
		query = query + `&orderBy=${field}&direction=${direction}`;
	}
	if (filters.type) query = query + `&type=${filters.type}`;
	return axios.get(`${NEXT_URL}/api/transaction/all?${query}`);
};

const useGetTransactions = (filters: filters) => {
	return useQuery(
		["transactions", filters],
		() => getAllTransactions(filters),
		{
			onSuccess: (data) => data.data,
		}
	);
};

const getAllTags = (): Promise<AxiosResponse<Tag[], any>> => {
	return axios.get(`${NEXT_URL}/api/tag/all`);
};

const useGetTags = () => {
	return useQuery(["tags"], () => getAllTags(), {
		onSuccess: (data) => data.data,
	});
};
