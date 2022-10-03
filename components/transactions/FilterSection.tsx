import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { filters } from "../../types/filter";
import FiltersModal from "../FiltersModal";
import NewTransaction from "../NewTransactionModal";

function FilterSection({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  isFetchingTransactions,
  numberOfPages,
}: {
  filters: filters;
  numberOfPages: number;
  searchQuery: string;
  isFetchingTransactions: boolean;
  setFilters: Dispatch<SetStateAction<filters>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) {
  const text = useColorModeValue("blue.500", "blue.300");
  return (
    <Flex>
      <FiltersModal
        filters={filters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilters={setFilters}
      />
      <NewTransaction />
      {isFetchingTransactions && (
        <Button variant="ghost" colorScheme="blue" size="sm" mx={2} isLoading />
      )}
      <Flex ml="auto" justifyContent={"right"}>
        <Text fontSize="xs" color={text} mt={2} fontWeight="bold">
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
            // transactions.refetch();
          }}
          ml={2}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          {"<"}
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
            // transactions.refetch();
          }}
          ml={2}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          {">"}
        </Button>
      </Flex>
    </Flex>
  );
}

export default FilterSection;
