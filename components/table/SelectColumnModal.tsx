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
	chakra,
	Flex,
	Checkbox,
} from "@chakra-ui/react";
import { MdOutlineOpenInNew } from "react-icons/md";
import { ReactNode } from "react";
import { Table } from "@tanstack/react-table";
import { Transaction } from "@prisma/client";
import { AiOutlineSearch } from "react-icons/ai";
import { FcClearFilters } from "react-icons/fc";
import { FiFilter } from "react-icons/fi";

export default function SelectColumnModal({
	table,
}: {
	table: Table<Transaction>;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button
				ml={3}
				onClick={onOpen}
				variant="outline"
				colorScheme="blue"
				size="sm"
			>
				Columns{" "}
				<chakra.span color={"blue.300"} ml={2}>
					<FiFilter />
				</chakra.span>
			</Button>
			<ModalUI onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Select Columns to be displayed</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDirection="column" gap={3}>
							{table.getAllLeafColumns().map((column: any) => {
								if (column.id !== "select" && column.id !== "edit")
									return (
										<label key={column.id}>
											<Checkbox
												{...{
													type: "checkbox",
													isChecked: column.getIsVisible(),
													onChange: column.getToggleVisibilityHandler(),
													size: "lg",
												}}
											/>{" "}
											{column.id}
										</label>
									);
							})}
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Flex>
							<Button onClick={onClose}>Close</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</ModalUI>
		</>
	);
}
