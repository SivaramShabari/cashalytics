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
} from "@chakra-ui/react";
import moment from "moment";
import React, { Dispatch, SetStateAction } from "react";
import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import { FcClearFilters } from "react-icons/fc";
import { FiFilter } from "react-icons/fi";
import { filters } from "../../types/filter";

function Filters({
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

	return (
		<>
			<Button
				my={2}
				onClick={onOpen}
				variant="outline"
				colorScheme="blue"
				size="sm"
			>
				Filters{" "}
				<chakra.span ml={2}>
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
							<Flex
								sx={{
									flexDirection: "column",
								}}
								gap={5}
							>
								<Box>
									<Menu>
										<Text>
											Transaction Type:
											<MenuButton
												ml={2}
												as={Button}
												rightIcon={<AiFillCaretDown />}
											>
												{filters.type ? filters.type : "All"}
											</MenuButton>
										</Text>
										<MenuList>
											<MenuItem
												onClick={() =>
													setFilters((f) => ({ ...f, type: "Debit" }))
												}
											>
												Debit
											</MenuItem>
											<MenuItem
												onClick={() =>
													setFilters((f) => ({ ...f, type: "Credit" }))
												}
											>
												Credit
											</MenuItem>
											<MenuItem
												onClick={() =>
													setFilters((f) => ({ ...f, type: undefined }))
												}
											>
												All
											</MenuItem>
										</MenuList>
									</Menu>
								</Box>
								{/* <Flex
									sx={{
										flexDirection: {
											base: "column",
											lg: "row",
										},
									}}
									gap={3}
								><Text mt={2} ml={1}>
										Page: {filters.paginate!.page}
									</Text>
									<Button
										disabled={filters.paginate!.page <= 1}
										onClick={() =>
											setFilters((f) => ({
												...f,
												paginate: {
													page: f.paginate!.page - 1,
													perPage: f.paginate!.perPage,
												},
											}))
										}
									>
										Prev Page
									</Button>
									<Button
										disabled={filters.paginate!.page >= 100}
										onClick={() =>
											setFilters((f) => ({
												...f,
												paginate: {
													page: f.paginate!.page + 1,
													perPage: f.paginate!.perPage,
												},
											}))
										}
									>
										Next Page
									</Button> */}
								<Box>
									<Menu>
										<MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
											Per Page:{" "}
											{filters.paginate!.perPage <= 100
												? filters.paginate!.perPage
												: "All (Slowed Perfomance)"}
										</MenuButton>
										<MenuList>
											{[10, 20, 30, 50, 75, 100, 50000].map((n) => (
												<MenuItem
													key={n}
													onClick={() =>
														setFilters((f) => ({
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
								</Box>
								{/* </Flex> */}
								<Flex
									sx={{
										flexDirection: {
											base: "column",
											md: "column",
										},
									}}
									gap={2}
								>
									<Flex>
										<FormLabel mt={2}>From</FormLabel>
										<Input
											value={moment(filters.date?.from).format("YYYY-MM-DD")}
											onChange={(e) =>
												setFilters((f) => ({
													...f,
													date: {
														from: new Date(
															moment(e.target.value).toDate()
														).toISOString(),
														to: f.date?.to || new Date().toISOString(),
													},
												}))
											}
											style={{
												padding: 4,
												borderRadius: 4,
												paddingLeft: 20,
												paddingRight: 20,
											}}
											type="date"
										/>
									</Flex>
									<Flex>
										<FormLabel mt={2} mr={{ base: 8, md: 0 }}>
											To{" "}
										</FormLabel>
										<Input
											ml={{ base: 0, md: 8 }}
											value={moment(filters.date?.from).format("YYYY-MM-DD")}
											onChange={(e) => {
												setFilters((f) => ({
													...f,
													date: {
														to: new Date(
															moment(e.target.value).toDate()
														).toISOString(),
														from:
															f.date?.from ||
															new Date("08-08-2021").toISOString(),
													},
												}));
											}}
											style={{
												padding: 4,
												borderRadius: 4,
												paddingLeft: 20,
												paddingRight: 20,
											}}
											type="date"
										/>
									</Flex>
								</Flex>
							</Flex>
							<Flex>
								<FormControl
									onSubmit={() => {
										setFilters((f) => ({
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
												setFilters((f) => ({
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
												setFilters((f) => ({
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
						</Flex>
					</ModalBody>
				</ModalContent>
			</ModalUI>
		</>
	);
}

export default Filters;
