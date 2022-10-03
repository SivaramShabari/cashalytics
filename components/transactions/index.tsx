import { SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { Tag } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { useGetTransactions } from "../../api";
import { filters } from "../../types/filter";
import TransactionListItem from "./TransactionListItem";

export default function TransactionList({
  filters,
  tags,
}: {
  filters: filters;
  tags: Tag[];
}) {
  const listRef = useRef<any>();
  const transactions = useGetTransactions(filters);
  const [listHeight, setHeight] = useState(500);
  const border = useColorModeValue("gray.200", "gray.700");
  useEffect(() => {
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [filters]);
  useEffect(() => {
    if (listRef.current) {
      const tBodyY = listRef.current.getBoundingClientRect().y;
      let windowHeight = 400,
        windowWidth = 1000;
      if (typeof window !== "undefined") {
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
      }
      const offset = windowWidth < 500 ? -10 : 20;
      setHeight(windowHeight - tBodyY - offset);
      listRef.current.style.maxHeight = listHeight;
    }
  }, [listRef]);
  return (
    <>
      <SimpleGrid
        pt={2}
        gap={2}
        ref={listRef}
        maxH={listHeight}
        overflowY={"auto"}
        borderTop="1px solid"
        borderTopColor={border}
        columns={[1, 1, 1, 2, 3, 4]}
      >
        {transactions.data?.data.transactions.map((transaction) => (
          <TransactionListItem
            key={transaction.id}
            transaction={transaction}
            tags={tags}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
