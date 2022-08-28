import {
	Flex,
	Stat,
	StatGroup,
	StatHelpText,
	StatLabel,
	StatNumber,
	useColorModeValue,
	Tag as TagUI,
	TagLabel,
	Wrap,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { Tag, Transaction } from "@prisma/client";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import moment from "moment";
import EditTransactionForm from "../EditTransactionForm";
import { useContext, useState } from "react";
import { DataContext } from "../../pages/transactions";
import { useEditAccount, useEditTransactions, useGetAccounts } from "../../api";
export default function TransactionListItem({
	transaction,
	tags,
}: {
	transaction: Transaction;
	tags: Tag[];
}) {
	const income = useColorModeValue("green.400", "green.500");
	const expense = useColorModeValue("yellow.500", "yellow.600");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [values, set] = useState<Transaction>(transaction);

	const updateTransaction = useEditTransactions();
	const updateAccount = useEditAccount();
	const accounts = useGetAccounts();
	const amountString = parseFloat(transaction.amount.toString()).toLocaleString(
		"en-in"
	);
	return (
		<>
			<Flex
				flexDirection="column"
				py={2}
				px={3}
				borderRadius="lg"
				borderWidth={1}
				onClick={onOpen}
				_hover={{ cursor: "pointer" }}
			>
				<StatGroup>
					<Stat>
						<StatNumber
							color={transaction.type === "Credit" ? income : expense}
						>
							{amountString.includes(".") ? amountString : amountString + ".00"}{" "}
							₹
						</StatNumber>
						<StatHelpText>
							<Flex gap={1} align="right">
								<BsFillCalendar2CheckFill style={{ margin: 3 }} />
								{moment(transaction.date).format("ll")}{" "}
								{moment(transaction.date).format("dddd")}
							</Flex>
						</StatHelpText>
					</Stat>
					<Stat>
						<StatLabel mt={1} sx={{ base: { ml: 2 }, md: { ml: 0 } }}>
							Tags
						</StatLabel>
						<StatNumber mt={2}>
							<Wrap gap={1}>
								{transaction.tags.map((tag, i) => (
									<TagUI key={i} variant="outline" size="sm" colorScheme="blue">
										<TagLabel>
											{tags.find((t) => t.id === tag)?.name || "INVALID"}
										</TagLabel>
									</TagUI>
								))}
							</Wrap>
						</StatNumber>
					</Stat>
				</StatGroup>
				<Stat mt={1}>
					<StatLabel>Description</StatLabel>
					<StatNumber></StatNumber>
					<StatHelpText>
						{transaction.description ||
							transaction.narration ||
							"No description"}
					</StatHelpText>
				</Stat>
			</Flex>
			<>
				<Modal
					scrollBehavior={"inside"}
					onClose={onClose}
					isOpen={isOpen}
					isCentered
					size="xl"
					id={transaction.id}
				>
					<ModalOverlay />
					<ModalContent id={transaction.id}>
						<ModalHeader>Edit Transaction</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<EditTransactionForm
								set={set}
								values={values}
								transaction={transaction}
								tags={tags}
							/>
						</ModalBody>
						<ModalFooter>
							<Flex>
								<Button
									variant="outline"
									colorScheme="red"
									mr={3}
									onClick={onClose}
								>
									Close
								</Button>
								<Button
									variant="outline"
									colorScheme="orange"
									mr={3}
									onClick={onClose}
								>
									Archive
								</Button>
								<Button
									isLoading={
										updateAccount.isLoading || updateTransaction.isLoading
									}
									variant="solid"
									colorScheme="green"
									onClick={() => {
										let amountDifference = transaction.amount - values.amount;
										const type = values.type === "Debit" ? -1 : 1;
										amountDifference *= type;
										const account = accounts.data?.data.find(
											(a) => a.id === values.accountId
										);
										const balance = account!.balance - amountDifference;
										updateTransaction
											.mutateAsync([{ ...values }])
											.then(() => {
												if (amountDifference > 0) {
													return updateAccount.mutateAsync({
														...(account as any),
														balance,
													});
												} else return null;
											})
											.then(() => {
												onClose();
											})
											.catch(console.log);
									}}
								>
									Save
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		</>
	);
}
