import { Tag, Transaction } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState, createContext } from "react";
import SidebarWithHeader from "../components/Sidenav";
import TransactionList from "../components/List";
import { NEXT_URL } from "../config";
import axios, { AxiosResponse } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { filters } from "../types/filter";
import { Flex, Spinner } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import moment from "moment";

export const DataContext = createContext<any>({
	selectedIds: "",
	setSelectedIds: () => null,
	rerenders: 0,
	setRerenders: null,
});
const ManageData: NextPage = () => {
	const [filters, setFilters] = useState<filters>({});
	const transactions = useGetTransactions({
		paginate: {
			page: 1,
			perPage: 30,
		},
		// type: "Credit",
		orderBy: {
			field: "amount",
			direction: "desc",
		},
		// search: "NSM",
		date: {
			from: new Date(
				moment("08/08/2022", "DD/MM/YYYY").toISOString()
			).getMilliseconds(),
			to: new Date().getMilliseconds(),
		},
	});
	const editTransactions = useEditTransactions();
	const tags = useGetTags();
	useEffect(() => {}, []);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [rerenders, setRerenders] = useState(0);
	return (
		<>
			<DataContext.Provider
				value={{ selectedIds, setSelectedIds, rerenders, setRerenders }}
			>
				<SidebarWithHeader>
					{transactions.isSuccess && tags.isSuccess ? (
						<TransactionList
							tags={tags.data.data}
							transactions={transactions.data.data}
						/>
					) : (
						<Flex alignItems="center" justifyContent="center" w="100%" h="100%">
							<Spinner size="xl" />
						</Flex>
					)}
				</SidebarWithHeader>
			</DataContext.Provider>
		</>
	);
};

export default ManageData;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: "/signin",
				permanent: false,
			},
		};
	}
	return {
		props: {
			session,
		},
	};
};

const getAllTransactions = async (
	filters: filters
): Promise<AxiosResponse<Transaction[], any>> => {
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

const editTransactions = async (
	transactions: Transaction[]
): Promise<AxiosResponse<Transaction[], any>> =>
	axios.put(`${NEXT_URL}/api/transaction/update`, transactions);

const getTags = async (): Promise<AxiosResponse<Tag[], any>> =>
	axios.get(`${NEXT_URL}/api/tag/all`);

const useEditTransactions = () => {
	const client = useQueryClient();
	return useMutation(editTransactions, {
		onSuccess: () => client.invalidateQueries(["transactions"]),
	});
};

const useGetTransactions = (filters: filters) => {
	return useQuery(["transactions"], () => getAllTransactions(filters), {
		onSuccess: (data) => data.data,
	});
};

const useGetTags = () => {
	return useQuery(["tags"], () => getTags(), {
		onSuccess: (data) => {
			return data.data;
		},
	});
};
