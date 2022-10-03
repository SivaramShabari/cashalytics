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
  chakra,
} from "@chakra-ui/react";
import { Tag, Transaction } from "@prisma/client";
import {
  BsCardText,
  BsFillCalendar2CheckFill,
  BsFillChatSquareDotsFill,
  BsReverseLayoutTextWindowReverse,
} from "react-icons/bs";
import moment from "moment";
import EditTransactionForm from "../EditTransactionForm";
import { useContext, useState } from "react";
import { DataContext } from "../../pages/transactions";
import { useEditAccount, useEditTransactions, useGetAccounts } from "../../api";
import { MdOutlineTextsms } from "react-icons/md";
export default function TransactionListItem({
  transaction,
  tags,
}: {
  transaction: Transaction;
  tags: Tag[];
}) {
  const income = useColorModeValue("green.400", "green.500");
  const expense = useColorModeValue("yellow.500", "yellow.600");
  const date = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, set] = useState<Transaction>(transaction);
  const truncate = (input: string, length: number) =>
    input.length > length ? `${input.substring(0, length)}...` : input;
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
        py={1}
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
              <Flex gap={1} color={date} align="right">
                <BsFillCalendar2CheckFill style={{ marginRight: 2 }} />
                <chakra.span mt={-0.5}>
                  {moment(transaction.date).format("dddd").substring(0, 3)}
                  {", "}
                  {moment(transaction.date).format("ll").split(",")[0]}
                </chakra.span>
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
        <Stat>
          <StatHelpText display="flex">
            <chakra.span mt={1} ml={0} mr={2}>
              <BsFillChatSquareDotsFill size={14} />
            </chakra.span>
            {truncate(
              transaction.description ||
                transaction.narration ||
                "No description",
              30
            )}
          </StatHelpText>
        </Stat>
      </Flex>
      <>
        <Modal
          scrollBehavior={"inside"}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
          size={{ base: "full", med: "xl", xl: "xl" }}
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
                      .catch(console.error);
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
