import type { NextPage } from "next";
import {
  useEffect,
  useState,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";
import SidebarWithHeader from "../components/Sidenav";
import TransactionList from "../components/transactions";
import { filters } from "../types/filter";
import { Flex, Spinner, SimpleGrid } from "@chakra-ui/react";
import { useGetTags, useGetTransactions } from "../api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import FilterSection from "../components/transactions/FilterSection";
import StatsSection from "../components/transactions/StatsSection";
import SkeletonCard from "../components/transactions/SkeletonCard";

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
  const [filters, setFilters] = useState<filters>({
    paginate: { page: 1, perPage: 30 },
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
    // transactions.refetch();
  }, [filters]);
  const numberOfPages = Math.round(
    (transactions.data?.data?.count &&
      transactions.data.data.count / filters.paginate!.perPage) ||
      1
  );
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
            <FilterSection
              isFetchingTransactions={transactions.isFetching}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              numberOfPages={numberOfPages}
            />
            <StatsSection
              transactions={transactions.data.data.transactions}
              count={transactions.data.data.count}
            />
            <TransactionList
              tags={tags.data?.data || []}
              filters={filters}
              // transactions={transactions.data.data.transactions || []}
            />
          </DataContext.Provider>
        ) : (
          <Flex mt={24} w="100%" h="100%">
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
