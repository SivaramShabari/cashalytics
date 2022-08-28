import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Flex,
	Text,
	FormLabel,
	InputGroup,
	InputLeftElement,
	Input,
	FormControl,
	Modal as ModalUI,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	chakra,
	useColorModeValue,
	SimpleGrid,
	Tag,
	TagLabel,
	Wrap,
	ModalFooter,
} from "@chakra-ui/react";
import { MoneyAccount } from "@prisma/client";
import moment from "moment";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import { FcClearFilters } from "react-icons/fc";
import { FiFilter } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useGetAccounts, useGetTags, useGetTransactions } from "../api";
import { filters } from "../types/filter";

function FiltersModal({
	filters,
	searchQuery,
	setFilters,
	setSearchQuery,
}: {
	filters: filters;
	searchQuery: string;
	setFilters: Dispatch<SetStateAction<filters>>;
	setSearchQuery: Dispatch<SetStateAction<string>>;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const label = useColorModeValue("blue.600", "blue.300");
	const accounts = useGetAccounts();
	const tagsQuery = useGetTags();
	const transactions = useGetTransactions(filters);
	const tags = tagsQuery.data?.data;
	const [values, set] = useState(filters);
	return (
		<>
			<Button
				onClick={onOpen}
				variant="outline"
				colorScheme="blue"
				maxW={120}
				size="sm"
			>
				<chakra.span>
					<FiFilter />
				</chakra.span>
			</Button>
			<ModalUI size={"xl"} onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent m={3}>
					<ModalHeader>Filters</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							flexDirection="column"
							gap={5}
							my={5}
							border={"1px solid"}
							p={3}
							borderRadius={10}
							borderColor={"gray.600"}
						>
							<SimpleGrid columns={2} gap={5}>
								<FormControl>
									<FormLabel>Type</FormLabel>
									<Menu>
										<Text>
											<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
												{values.type ? values.type : "All"}
											</MenuButton>
										</Text>
										<MenuList>
											<MenuItem
												onClick={() => set((f) => ({ ...f, type: "Debit" }))}
											>
												Debit
											</MenuItem>
											<MenuItem
												onClick={() => set((f) => ({ ...f, type: "Credit" }))}
											>
												Credit
											</MenuItem>
											<MenuItem
												onClick={() => set((f) => ({ ...f, type: undefined }))}
											>
												All
											</MenuItem>
										</MenuList>
									</Menu>
								</FormControl>
								<FormControl>
									<FormLabel>Sort By </FormLabel>
									<Menu>
										<Text>
											<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
												{values.orderBy
													? `${
															values.orderBy!.field!.charAt(0).toUpperCase() +
															values.orderBy.field?.slice(1)
													  } ${values.orderBy.direction} `
													: "None"}
											</MenuButton>
										</Text>
										<MenuList>
											<MenuItem
												onClick={() =>
													set((f) => ({
														...f,
														orderBy: {
															field: "date",
															direction: "asc",
														},
													}))
												}
											>
												Date (Asc)
											</MenuItem>
											<MenuItem
												onClick={() =>
													set((f) => ({
														...f,
														orderBy: {
															field: "amount",
															direction: "asc",
														},
													}))
												}
											>
												Amount (Asc)
											</MenuItem>
											<MenuItem
												onClick={() =>
													set((f) => ({
														...f,
														orderBy: {
															field: "date",
															direction: "desc",
														},
													}))
												}
											>
												Date (Desc)
											</MenuItem>
											<MenuItem
												onClick={() =>
													set((f) => ({
														...f,
														orderBy: {
															field: "amount",
															direction: "desc",
														},
													}))
												}
											>
												Amount (Desc)
											</MenuItem>
										</MenuList>
									</Menu>
								</FormControl>
								<FormControl>
									<FormLabel>Per page </FormLabel>
									<Menu>
										<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
											{values.paginate!.perPage <= 100
												? values.paginate!.perPage
												: "All (Slowed Perfomance)"}
										</MenuButton>
										<MenuList>
											{[10, 20, 30, 50, 75, 100, 50000].map((n) => (
												<MenuItem
													key={n}
													onClick={() =>
														set((f) => ({
															...f,
															paginate: { page: f.paginate!.page, perPage: n },
														}))
													}
												>
													{n <= 100 ? n : "All (Slowed Perfomance)"}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</FormControl>
								<FormControl>
									<FormLabel>Account</FormLabel>
									<Menu>
										<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
											All Accounts
										</MenuButton>
										<MenuList>
											{accounts.data?.data.map((account: MoneyAccount) => (
												<MenuItem
													key={account.id}
													onClick={() =>
														set((f) => ({
															...f,
															account: account.id,
														}))
													}
												>
													{account.name}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</FormControl>
							</SimpleGrid>

							<Flex flexDirection="column" gap={2}>
								<Flex>
									<FormLabel mt={2}>From</FormLabel>
									<Input
										value={moment(values.date?.from).format("YYYY-MM-DD")}
										onChange={(e) =>
											set((f) => ({
												...f,
												date: {
													from: new Date(
														moment(e.target.value).format("YYYY-MM-DD")
													),
													to: f.date?.to || new Date(),
												},
											}))
										}
										type="date"
									/>
								</Flex>
								<Flex>
									<FormLabel mt={2} mr={{ base: 8, md: 0 }}>
										To{" "}
									</FormLabel>
									<Input
										ml={{ base: 0, md: 8 }}
										value={moment(values.date?.to).format("YYYY-MM-DD")}
										onChange={(e) => {
											set((f) => ({
												...f,
												date: {
													to: new Date(
														moment(e.target.value).format("YYYY-MM-DD")
													),
													from:
														f.date?.from ||
														new Date("2021-08-08").toISOString(),
												},
											}));
										}}
										type="date"
									/>
								</Flex>
							</Flex>
							<Flex>
								<FormControl
									onSubmit={() => {
										set((f) => ({
											...f,
											search: searchQuery || undefined,
										}));
									}}
								>
									<InputGroup>
										<InputLeftElement zIndex={-5} pointerEvents="none">
											<AiOutlineSearch />
										</InputLeftElement>
										<Input
											value={searchQuery}
											onSubmit={() => {
												set((f) => ({
													...f,
													search: searchQuery || undefined,
												}));
											}}
											onChange={(e) => setSearchQuery(e.target.value)}
											type="text"
											placeholder="Search"
											w="400px"
										/>
										<Button
											type="submit"
											ml={2}
											colorScheme="blue"
											onClick={() => {
												set((f) => ({
													...f,
													search: searchQuery || undefined,
												}));
											}}
										>
											<AiOutlineSearch style={{ marginRight: 5 }} />
											Search
										</Button>
									</InputGroup>
								</FormControl>
							</Flex>
							<FormControl>
								<FormLabel color={label}>Tags</FormLabel>
								<Wrap>
									{values.tags?.map((t) => {
										return (
											<Tag
												_hover={{ cursor: "pointer" }}
												colorScheme="blue"
												variant="solid"
												onClick={() => {
													set((f) => ({
														...f,
														tags: f.tags?.filter((tag) => tag !== t),
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
												{tags?.map((tag) => (
													<Tag
														_hover={{ cursor: "pointer", border: "1px solid" }}
														colorScheme="blue"
														onClick={() => {
															if (!values.tags?.includes(tag.id)) {
																set((v) => ({
																	...v,
																	tags: v.tags ? [...v.tags, tag.id] : [tag.id],
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
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={() => {
								setFilters(values);
								onClose();
							}}
						>
							Apply Filters
						</Button>
					</ModalFooter>
				</ModalContent>
			</ModalUI>
		</>
	);
}

export default FiltersModal;
