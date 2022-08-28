import { Box, SimpleGrid } from "@chakra-ui/react";
import { Tag, Transaction } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import TransactionListItem from "./TransactionListItem";

export default function TransactionList({
	transactions,
	tags,
}: {
	transactions: Transaction[];
	tags: Tag[];
}) {
	const listRef = useRef<any>();
	const [listHeight, setHeight] = useState(500);
	useEffect(() => {
		if (listRef.current) {
			const tBodyY = listRef.current.getBoundingClientRect().y;
			let windowHeight = 400;
			if (typeof window !== "undefined") {
				windowHeight = window.innerHeight;
			}
			setHeight(windowHeight - tBodyY - 20);
			listRef.current.style.maxHeight = listHeight;
		}
	}, [listRef]);
	return (
		<>
			<SimpleGrid
				mt={5}
				pr={2}
				gap={2}
				columns={[1, 1, 1, 2, 3, 4]}
				maxH={listHeight}
				ref={listRef}
				overflowY={"auto"}
			>
				{transactions.map((transaction) => (
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
