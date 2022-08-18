import {
	Flex,
	Stat,
	StatGroup,
	StatHelpText,
	StatLabel,
	StatNumber,
	useColorModeValue,
	Tag,
	TagLabel,
	TagRightIcon,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Box,
	Text,
	Wrap,
} from "@chakra-ui/react";
import { Category, Transaction } from "@prisma/client";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import { BsPlusLg } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";
import moment from "moment";
import { IconType } from "react-icons";
import { TransactionTypes } from "../../types/transaction";
export default function TransactionListItem({
	isSelected,
	transaction,
	setSelectedIds,
	categories,
}: {
	isSelected: boolean;
	transaction: Transaction;
	setSelectedIds: any;
	categories: Category[];
}) {
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const bg = useColorModeValue("blue.50", "blue.900");

	return (
		<>
			<Flex
				flexDirection="column"
				m={3}
				p={5}
				borderRadius="lg"
				borderWidth={2}
				bg={isSelected ? bg : undefined}
				borderColor={isSelected ? "blue.500" : borderColor}
				onDoubleClick={() => {
					alert("double click");
				}}
				onClick={() =>
					isSelected
						? setSelectedIds((ids: string[]) =>
								ids.filter((id) => id !== transaction.id)
						  )
						: setSelectedIds((ids: string[]) => [...ids, transaction.id])
				}
			>
				<StatGroup>
					<Stat>
						<StatLabel>
							<TransactionTypeMenu
								selectedType={transaction.type}
								types={TransactionTypes}
							/>
						</StatLabel>
						<StatNumber>
							{parseFloat(transaction.amount.toString()).toFixed(2)} ₹
						</StatNumber>
						<StatHelpText>
							<Flex gap={1} align="right">
								<BsFillCalendar2CheckFill style={{ margin: 3 }} />
								{moment(transaction.date).format("ll")}
							</Flex>
						</StatHelpText>
					</Stat>
					<Stat>
						<StatLabel sx={{ base: { ml: 2 }, md: { ml: 0 } }}>
							Category
						</StatLabel>
						<StatNumber mt={2}>
							<Wrap gap={1}>
								{transaction.categories.map((category, i) => (
									<Tag key={i} variant="outline" size="md" colorScheme="blue">
										<TagLabel>
											{categories.find((t) => t.id === category)?.name ||
												"INVALID"}
										</TagLabel>
									</Tag>
								))}
							</Wrap>
						</StatNumber>
					</Stat>
				</StatGroup>
				<Stat mt={3}>
					<StatLabel>Description</StatLabel>
					<StatNumber></StatNumber>
					<StatHelpText>
						{transaction.description ||
							transaction.narration ||
							"No description"}
					</StatHelpText>
				</Stat>
				<Flex gap={2} w={["full", 200]}>
					<Button
						onClick={(e: any) => e.stopPropagation()}
						size="sm"
						colorScheme="blue"
						flexGrow={{ base: 1, md: 1 }}
					>
						Edit
					</Button>
					<Button
						onClick={(e: any) => e.stopPropagation()}
						size="sm"
						colorScheme="orange"
						variant="outline"
						flexGrow={{ base: 1, md: 1 }}
					>
						Archive
					</Button>
				</Flex>
			</Flex>
		</>
	);
}

const TransactionTypeMenu = ({
	selectedType,
	types,
}: {
	selectedType: string;
	types: string[];
}) => {
	const income = useColorModeValue("green.400", "green.600");
	const expense = useColorModeValue("yellow.500", "yellow.600");
	return (
		<Menu>
			<MenuButton onClick={(e: any) => e.stopPropagation()}>
				<Flex>
					<Text color={selectedType === "INCOME" ? income : expense}>
						{selectedType}
					</Text>
					<Box mt={1} ml={1}>
						<AiFillCaretDown />
					</Box>
				</Flex>
			</MenuButton>
			<MenuList>
				{types.map((type, i) => (
					<MenuItem onClick={(e: any) => e.stopPropagation()} key={i}>
						{type}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};
