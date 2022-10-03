import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Transaction } from "@prisma/client";
import React from "react";

function StatsSection({
  transactions,
  count,
}: {
  transactions: Transaction[];
  count: number;
}) {
  const text = useColorModeValue("blue.500", "blue.300");
  return (
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
            {transactions
              .filter((t) => t.type === "Debit")
              .reduce((a, b) => a + b.amount, 0)
              .toLocaleString("en-IN")}
          </Flex>
        </Box>
        <Box color={text} fontWeight={"bold"}>
          Credit:
          <Flex fontWeight={"bold"} display="inline" ml={2}>
            ₹
            {transactions
              .filter((t) => t.type === "Credit")
              .reduce((a, b) => a + b.amount, 0)
              .toLocaleString("en-IN")}
          </Flex>
        </Box>
        <Box color={text} fontWeight={"bold"}>
          Total:
          <Flex fontWeight={"bold"} display="inline" ml={2}>
            {count}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default StatsSection;
