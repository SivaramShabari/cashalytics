import { Category, Transaction } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import SidebarWithHeader from "../components/Sidenav";
import TransactionList from "../components/List";
import { NEXT_URL } from "../config";
import axios, { AxiosResponse } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { filters } from "../types/filter";
import { Flex, Spinner } from "@chakra-ui/react";
import { getSession } from "next-auth/react";

const ManageData: NextPage = () => {
	const transactions = useGetTransactions({
		paginate: { page: 1, perPage: 15 },
	});
	const editTransactions = useEditTransactions();
	const categories = useGetCategories();
	useEffect(() => {}, []);
	return (
		<>
			<SidebarWithHeader>
				{transactions.isSuccess && categories.isSuccess ? (
					<TransactionList
						categories={categories.data.data}
						transactions={transactions.data.data}
					/>
				) : (
					<Flex alignItems="center" justifyContent="center" w="100%" h="100%">
						<Spinner size="xl" />
					</Flex>
				)}
			</SidebarWithHeader>
		</>
	);
};

export default ManageData;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session) {
		console.log("ManageData", session);

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
	if (filters.category) query = query + `&category=${filters.category}`;
	if (filters.categories)
		query = query + `&categories=${filters.categories.join(",")}`;
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
	return axios.get(`${NEXT_URL}/api/transactions/all?${query}`);
};

const editTransactions = async (
	transactions: Transaction[]
): Promise<AxiosResponse<Transaction[], any>> =>
	axios.put(`${NEXT_URL}/api/transactions/update`, transactions);

const getCategories = async (): Promise<AxiosResponse<Category[], any>> =>
	axios.get(`${NEXT_URL}/api/category/all`);

const useEditTransactions = () => {
	const client = useQueryClient();
	return useMutation(editTransactions, {
		onSuccess: () => client.invalidateQueries(["transactions"]),
	});
};

const useGetTransactions = (filters: filters) => {
	return useQuery(
		["transactions", { ...filters }],
		() => getAllTransactions(filters),
		{
			onSuccess: (data) => data.data,
		}
	);
};

const useGetCategories = () => {
	return useQuery(["categories"], () => getCategories(), {
		onSuccess: (data) => data.data,
	});
};
