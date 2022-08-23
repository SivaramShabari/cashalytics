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
} from "@chakra-ui/react";
import { MdOutlineOpenInNew } from "react-icons/md";
import { ReactNode } from "react";
import EditTransactionForm from "../EditTransactionForm";
import { Transaction } from "@prisma/client";

export default function Modal({
	title,
	transaction,
}: {
	title: string;
	transaction: Transaction;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<MdOutlineOpenInNew onClick={onOpen} />
			<ModalUI
				scrollBehavior={"inside"}
				onClose={onClose}
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<EditTransactionForm transaction={transaction} />
					</ModalBody>
					<ModalFooter>
						<Flex>
							<Button mr={3} onClick={onClose}>
								Close
							</Button>
							<Button variant="outline" colorScheme="green" onClick={onClose}>
								Save
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</ModalUI>
		</>
	);
}
