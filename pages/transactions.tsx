import type { NextPage } from "next";
import {
	useEffect,
	useState,
	createContext,
	SetStateAction,
	Dispatch,
} from "react";
import SidebarWithHeader from "../components/Sidenav";
import TransactionList from "../components/List";
import { filters } from "../types/filter";
import {
	Button,
	Flex,
	Spinner,
	Text,
	chakra,
	Box,
	useColorModeValue,
	SimpleGrid,
	Skeleton,
} from "@chakra-ui/react";
import FiltersModal from "../components/FiltersModal";
import { useGetTags, useGetTransactions } from "../api";
import NewTransaction from "../components/NewTransactionModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface PageState {
	selectedIds: string[];
	filters: filters;
	setSelectedIds: Dispatch<SetStateAction<string[]>>;
	setFilters: Dispatch<SetStateAction<filters>>;
}
const initialState: PageState = {
	selectedIds: [],
	filters: {},
	setFilters: () => null,
	setSelectedIds: () => null,
};
export const DataContext = createContext<PageState>(initialState);

const ManageData: NextPage = () => {
	const session = useSession();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const tags = useGetTags();
	const windowWidth = typeof window !== "undefined" ? window.innerWidth : 500;
	const [filters, setFilters] = useState<filters>({
		paginate: { page: 1, perPage: windowWidth > 1000 ? 30 : 10 },
		orderBy: { field: "date", direction: "desc" },
	});
	const [page, pageNumber] = useState(filters.paginate!.page);
	const transactions = useGetTransactions(filters);
	useEffect(() => {
		if (session.status === "unauthenticated") {
			router.push("/signin");
		}
	}, [session, router]);
	useEffect(() => {
		transactions.refetch();
	}, [filters]);
	const numberOfPages = Math.round(
		(transactions.data?.data?.count &&
			transactions.data.data.count / filters.paginate!.perPage) ||
			1
	);
	const text = useColorModeValue("blue.500", "blue.300");
	return (
		<>
			{session.status === "loading" && (
				<Flex alignItems="center" justifyContent="center" w="100vw" h="100vh">
					<Spinner size="xl" />
				</Flex>
			)}
			<SidebarWithHeader>
				{session.status === "authenticated" &&
				!transactions.isLoading &&
				!tags.isLoading &&
				transactions.isSuccess ? (
					<DataContext.Provider
						value={{
							selectedIds,
							setSelectedIds,
							filters,
							setFilters,
						}}
					>
						<Flex>
							<FiltersModal
								filters={filters}
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								setFilters={setFilters}
							/>
							<NewTransaction />
							{transactions.isFetching && (
								<Button
									variant="ghost"
									colorScheme="blue"
									size="sm"
									mx={2}
									isLoading
								/>
							)}
							<Flex ml="auto" justifyContent={"right"}>
								<Text size="sm" color={text} mt={1}>
									Page {filters.paginate!.page} of {numberOfPages}
								</Text>
								<Button
									onClick={() => {
										setFilters((f) => ({
											...f,
											paginate: {
												page: Math.max(f.paginate!.page - 1, 1),
												perPage: f.paginate!.perPage,
											},
										}));
										console.log("Page", filters.paginate);
										// transactions.refetch();
									}}
									ml={2}
									variant="outline"
									colorScheme="blue"
									size="sm"
								>
									<chakra.span mr={2}>{"<"}</chakra.span>Prev
								</Button>
								<Button
									onClick={() => {
										setFilters((f) => ({
											...f,
											paginate: {
												page: Math.min(f.paginate!.page + 1, numberOfPages),
												perPage: f.paginate!.perPage,
											},
										}));
										console.log("Page", filters.paginate);
										// transactions.refetch();
									}}
									ml={2}
									variant="outline"
									colorScheme="blue"
									size="sm"
								>
									Next <chakra.span ml={2}>{">"}</chakra.span>
								</Button>
							</Flex>
						</Flex>
						<Box my={2}>
							<Flex
								sx={{
									justifyContent: ["space-between", null, "start"],
									fontSize: ["0.8em", "0.9em", "1em"],
									gap: [1, 8],
								}}
							>
								<Box color={text} fontWeight={"bold"}>
									Debit:
									<Flex fontWeight={"bold"} display="inline" ml={2}>
										₹
										{transactions.data.data.transactions
											.filter((t) => t.type === "Debit")
											.reduce((a, b) => a + b.amount, 0)
											.toLocaleString("en-IN")}
									</Flex>
								</Box>
								<Box color={text} fontWeight={"bold"}>
									Credit:
									<Flex fontWeight={"bold"} display="inline" ml={2}>
										₹
										{transactions.data.data.transactions
											.filter((t) => t.type === "Credit")
											.reduce((a, b) => a + b.amount, 0)
											.toLocaleString("en-IN")}
									</Flex>
								</Box>
								<Box color={text} fontWeight={"bold"}>
									Total:
									<Flex fontWeight={"bold"} display="inline" ml={2}>
										{transactions.data.data.count}
									</Flex>
								</Box>
							</Flex>
						</Box>
						<TransactionList
							tags={tags.data?.data || []}
							transactions={transactions.data.data.transactions || []}
						/>
					</DataContext.Provider>
				) : (
					<Flex mt={36} w="100%" h="100%">
						<SimpleGrid gap={6} columns={[1, 1, 1, 2, 3, 4]}>
							{Array.from(Array(10).keys()).map((a) => (
								<SkeletonCard key={a} />
							))}
						</SimpleGrid>
					</Flex>
				)}
			</SidebarWithHeader>
		</>
	);
};

export default ManageData;

const SkeletonCard = () => (
	<div>
		<Box p={3} borderRadius={8} border={"1px solid"} borderColor={"gray.800"}>
			<Flex gap={2} align={"stretch"}>
				<Skeleton flexGrow={1}>
					<h1>Name</h1>
				</Skeleton>
			</Flex>
			<Skeleton my={2}>
				<h1>Name</h1>
			</Skeleton>
			<Skeleton mt={2}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
			</Skeleton>
		</Box>
	</div>
);
