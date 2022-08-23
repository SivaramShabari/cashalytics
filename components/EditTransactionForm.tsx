import {
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Menu,
	MenuItem,
	MenuButton,
	MenuList,
	Textarea,
	Tag,
	TagLabel,
	Wrap,
	Flex,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { Transaction } from "@prisma/client";
import moment from "moment";
import { useContext, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { DataContext } from "../pages/table-view";

function EditTransactionForm({ transaction }: { transaction: Transaction }) {
	const [values, set] = useState<Transaction>(transaction);
	const { tags } = useContext(DataContext);
	const label = useColorModeValue("blue.600", "blue.300");
	return (
		<div>
			<Stack spacing={6}>
				<FormControl>
					<FormLabel color={label}>
						Transaction Id <i>(Read only)</i>
					</FormLabel>
					<Text>{transaction.id}</Text>
				</FormControl>
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
											<Text></Text>
											{tags?.find((tag) => t === tag.id)?.name}
											<MdClose style={{ marginTop: 1 }} />
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
							<MenuList overflow={"clip"} position={"fixed"}>
								<Wrap p={2}>
									{tags.map((tag) => (
										<Tag
											_hover={{ cursor: "pointer" }}
											colorScheme="blue"
											onClick={() => {
												if (!values.tags.includes(tag.id)) {
													set((v) => ({ ...v, tags: [...v.tags, tag.id] }));
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
					<Input value={values.amount} type="number" />
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
						type="number"
					/>
				</FormControl>
			</Stack>
		</div>
	);
}

export default EditTransactionForm;
