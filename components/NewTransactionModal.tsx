import {
	Modal as ModalUI,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Flex,
	FormLabel,
	FormControl,
	Input,
	Textarea,
	MenuItem,
	MenuList,
	MenuButton,
	Tag,
	Menu,
	Box,
	TagLabel,
	Text,
	Stack,
	Wrap,
	useColorModeValue,
	chakra,
	IconButton,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { useCreateTransaction, useGetAccounts, useGetTags } from "../api";
import { AiFillCaretDown } from "react-icons/ai";
import moment from "moment";
import { BiPlus } from "react-icons/bi";
import { MoneyAccount, Type } from "@prisma/client";

export default function NewTransaction() {
	const label = useColorModeValue("blue.600", "blue.300");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const accounts = useGetAccounts();
	const tagsQuery = useGetTags();
	const createTransaction = useCreateTransaction();
	const tags = tagsQuery.data?.data || [];
	const [values, set] = useState<{
		amount: number;
		type: Type;
		date: Date;
		tags: string[];
		reference?: string;
		description: string;
		accountId: string;
		closingBalance?: number;
		isArchived: boolean;
	}>({
		amount: 0,
		type: "Debit",
		date: new Date(),
		tags: [tags.find((t) => t.name === "Unknown")?.id || ""],
		reference: "",
		description: "",
		accountId:
			accounts.data?.data.find((a: any) => a.name === "Default")?.id || "",
		isArchived: false,
		closingBalance: 0,
	});

	return (
		<>
			<Button
				onClick={onOpen}
				variant="outline"
				colorScheme="blue"
				mx={2}
				size="sm"
				aria-label="plus"
			>
				<BiPlus size={18} />
			</Button>
			<ModalUI
				scrollBehavior={"inside"}
				onClose={onClose}
				isOpen={isOpen}
				isCentered
				size="xl"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>New Transaction</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={6}>
							<FormControl>
								<FormLabel color={label}>Tags</FormLabel>
								<Wrap>
									{values.tags.map((t) => {
										return (
											<Tag
												_hover={{ cursor: "pointer" }}
												colorScheme="blue"
												variant="solid"
												onClick={() => {
													set((v) => ({
														...v,
														tags: [...v.tags.filter((tag) => tag !== t)],
													}));
												}}
												key={t}
											>
												<TagLabel>
													<Flex gap={1}>
														<Text _hover={{ color: "white" }}>
															{tags?.find((tag) => t === tag.id)?.name}
														</Text>
														<Text mt={0.5} fontWeight={"bold"}>
															<MdClose />
														</Text>
													</Flex>
												</TagLabel>
											</Tag>
										);
									})}
								</Wrap>
								<Box mt={3}>
									<Menu>
										<MenuButton>
											<Tag variant={"outline"} colorScheme="green">
												<TagLabel>
													Add Tag <b>+</b>
												</TagLabel>
											</Tag>
										</MenuButton>

										<MenuList position={"fixed"}>
											<Wrap p={2}>
												{tags.map((tag) => (
													<Tag
														_hover={{ cursor: "pointer", border: "1px solid" }}
														colorScheme="blue"
														onClick={() => {
															if (!values.tags.includes(tag.id)) {
																set((v) => ({
																	...v,
																	tags: [...v.tags, tag.id],
																}));
															}
														}}
														key={tag.id}
													>
														{tag.name}
													</Tag>
												))}
											</Wrap>
										</MenuList>
									</Menu>
								</Box>
								{/* <Tag my={2} variant={"outline"} colorScheme="yellow">
									<TagLabel>
										Create New Tag <b>+</b>
									</TagLabel>
								</Tag> */}
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Type</FormLabel>
								<Menu>
									<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
										{values.type}
									</MenuButton>
									<MenuList>
										<MenuItem
											onClick={() =>
												set((t) => ({
													...t,
													type: "Debit",
												}))
											}
										>
											Debit
										</MenuItem>
										<MenuItem
											onClick={() =>
												set((t) => ({
													...t,
													type: "Credit",
												}))
											}
										>
											Credit
										</MenuItem>
									</MenuList>
								</Menu>
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Amount</FormLabel>
								<Input
									value={values.amount || undefined}
									onChange={(e) => {
										set((v) => ({
											...v,
											amount: parseFloat(e.target.value),
										}));
									}}
									type="number"
								/>
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Account</FormLabel>
								<Menu>
									<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
										{accounts.data?.data.find(
											(accnt: any) => accnt.id === values.accountId
										)?.name || "Select"}{" "}
										Account
									</MenuButton>
									<MenuList>
										{accounts.data?.data.map((account: MoneyAccount) => (
											<MenuItem
												key={account.id}
												onClick={() =>
													set((t) => ({
														...t,
														accountId: account.id,
													}))
												}
											>
												{account.name}
											</MenuItem>
										))}
									</MenuList>
								</Menu>
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Description</FormLabel>
								<Textarea
									resize={"none"}
									placeholder="Description"
									value={values.description}
									onChange={(e: any) => {
										set((v) => ({
											...v,
											description: e.target.value,
										}));
									}}
								/>
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Transaction Date</FormLabel>
								<Input
									type="date"
									value={moment(values.date).format("YYYY-MM-DD")}
									onChange={(e) => {
										set((v) => ({ ...v, date: e.target.value as any }));
									}}
								/>
							</FormControl>
							<FormControl>
								<FormLabel color={label}>Reference</FormLabel>
								<Input
									value={values.reference || ""}
									onChange={(e) => {
										set((v) => ({ ...v, reference: e.target.value }));
									}}
									type="text"
								/>
							</FormControl>
						</Stack>
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
								disabled={
									!(
										values.accountId &&
										values.amount &&
										values.date &&
										values.description
									)
								}
								isLoading={createTransaction.isLoading}
								variant="solid"
								colorScheme="green"
								onClick={async () => {
									let transaction = {
										...values,
									};
									await createTransaction.mutateAsync([{ ...transaction }]);
									set({
										amount: 0,
										description: "",
										type: "Debit",
										date: new Date(),
										closingBalance: 0,
										tags: [],
										isArchived: false,
										accountId: "",
										reference: "",
									});
									onClose();
								}}
							>
								Save
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</ModalUI>
		</>
	);
}
