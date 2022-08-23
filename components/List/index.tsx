import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Tag, Transaction } from "@prisma/client";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../pages/manage-data";
import TransactionListItem from "./TransactionListItem";

export default function TransactionList({
	transactions,
	tags,
}: {
	transactions: Transaction[];
	tags: Tag[];
}) {
	const text = useColorModeValue("blue.500", "blue.300");
	return (
		<>
			<Box m={3}>
				<Box>
					<Flex
						gap={3}
						alignItems="stretch"
						justifyContent="space-between"
						w="100%"
					>
						<Box color={text} fontWeight={"bold"}>
							Selected:
							<Flex fontWeight={"bold"} display="inline" ml={2}>
								0
							</Flex>
						</Box>
						<Box color={text} fontWeight={"bold"}>
							Total:
							<Flex fontWeight={"bold"} display="inline" ml={2}>
								{transactions.length}
							</Flex>
						</Box>
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
					</Flex>
				</Box>
			</Box>
			{transactions.map((transaction, i) => (
				<TransactionListItem key={i} transaction={transaction} tags={tags} />
			))}
		</>
	);
}
