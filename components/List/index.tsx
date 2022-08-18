import { Box, Flex, Text } from "@chakra-ui/react";
import { Category, Transaction } from "@prisma/client";
import { useState } from "react";
import TransactionListItem from "./TransactionListItem";

export default function TransactionList({
	transactions,
	categories,
}: {
	transactions: Transaction[];
	categories: Category[];
}) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	return (
		<>
			<Box m={3}>
				<Box>
					<Flex>
						<Text color="blue.500" fontWeight={"bold"} variant={"h3"}>
							Selected:
						</Text>
						<Text ml={2} fontWeight={"bold"} variant={"h3"}>
							{selectedIds.length}
						</Text>
					</Flex>
				</Box>
			</Box>
			{transactions.map((transaction, i) => (
				<TransactionListItem
					key={i}
					isSelected={selectedIds?.includes(transaction.id)}
					transaction={transaction}
					setSelectedIds={setSelectedIds}
					categories={categories}
				/>
			))}
		</>
	);
}
