import {
	Flex,
	Text,
	Box,
	Button,
	Input,
	Textarea,
	FormControl,
	FormLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { MoneyAccount } from "@prisma/client";
import { useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useEditAccount } from "../../api";

const AccountCard = ({ account }: { account: MoneyAccount }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const edit = useEditAccount();
	const [values, set] = useState({
		name: account.name,
		bankName: account.bankName || "",
		balance: account.balance,
		description: account.description,
	});
	const blue = useColorModeValue("blue.500", "blue.300");
	const gray = useColorModeValue("gray.300", "gray.600");
	return (
		<>
			<Flex
				flexDirection="column"
				gap={4}
				p={5}
				border="1px solid"
				borderColor={gray}
				borderRadius={8}
			>
				<Flex color={blue}>
					<MdOutlineAccountBalanceWallet
						style={{ marginTop: 5, marginRight: 5 }}
						size={28}
					/>
					<Text fontWeight="bold" fontSize="2xl">
						{account.name}
					</Text>
				</Flex>
				<Flex gap={3}>
					<Text fontSize="md" mt={2} fontWeight="bold">
						Balance :
					</Text>
					<Text fontSize="2xl">
						₹ {account.balance.toLocaleString("en-in")}
					</Text>
				</Flex>
				<Flex gap={3}>
					<Text fontWeight="bold">Bank name :</Text>
					<Text>{account.bankName || "No Bank name given"}</Text>
				</Flex>
				<Box>
					<Text fontWeight="bold" fontSize="md">
						Description
					</Text>
					<Text color="gray.500" fontSize="md">
						{account.description}
					</Text>
				</Box>
				<Flex align="stretch" w="100%">
					<Button
						onClick={onOpen}
						flexGrow={1}
						mr={2}
						variant="outline"
						colorScheme="blue"
					>
						Edit
					</Button>
				</Flex>
			</Flex>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Account: {account.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDirection="column">
							<FormControl>
								<FormLabel>Name</FormLabel>
								<Input
									placeholder="Account name"
									value={values.name}
									onChange={(e) => set((v) => ({ ...v, name: e.target.value }))}
									type="text"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Balance</FormLabel>
								<Input
									placeholder="Account balance"
									value={values.balance}
									type="number"
									onChange={(e) =>
										set((v) => ({ ...v, balance: parseFloat(e.target.value) }))
									}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Bank Name</FormLabel>
								<Input
									placeholder="Account Bank name"
									value={values.bankName || ""}
									type="text"
									onChange={(e) =>
										set((v) => ({ ...v, bankName: e.target.value }))
									}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder="Account description"
									value={values.description}
									onChange={(e) =>
										set((v) => ({ ...v, description: e.target.value }))
									}
								/>
							</FormControl>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={async () => {
								await edit.mutateAsync({ ...account, ...values });
								onClose();
							}}
							variant="solid"
							colorScheme="green"
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AccountCard;
