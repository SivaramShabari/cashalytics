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
  Grid,
  GridItem,
  InputLeftAddon,
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
      <ModalUI
        size={{ base: "full", med: "xl", xl: "xl" }}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap={6} my={2}>
              <SimpleGrid columns={2} gap={5}>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Menu>
                    <Text>
                      <MenuButton
                        w={"100%"}
                        textAlign="left"
                        as={Button}
                        rightIcon={<AiFillCaretDown />}
                      >
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
                      <MenuButton
                        w={"100%"}
                        textAlign="left"
                        as={Button}
                        rightIcon={<AiFillCaretDown />}
                      >
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
                              field: "createdAt",
                              direction: "asc",
                            },
                          }))
                        }
                      >
                        Created Time (Asc)
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

                      <MenuItem
                        onClick={() =>
                          set((f) => ({
                            ...f,
                            orderBy: {
                              field: "createdAt",
                              direction: "desc",
                            },
                          }))
                        }
                      >
                        Created Time (Desc)
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </FormControl>
                <FormControl>
                  <FormLabel>Per page </FormLabel>
                  <Menu>
                    <MenuButton
                      w={"100%"}
                      textAlign="left"
                      as={Button}
                      rightIcon={<AiFillCaretDown />}
                    >
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
                    <MenuButton
                      w={"100%"}
                      textAlign="left"
                      as={Button}
                      rightIcon={<AiFillCaretDown />}
                    >
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

              <Grid templateColumns="repeat(12, 1fr)">
                <GridItem colSpan={3}>
                  <FormLabel mt={2}>From</FormLabel>
                </GridItem>
                <GridItem colSpan={9}>
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
                </GridItem>
              </Grid>
              <Grid templateColumns="repeat(12, 1fr)">
                <GridItem colSpan={3}>
                  <FormLabel mt={2}>To </FormLabel>
                </GridItem>
                <GridItem colSpan={9}>
                  <Input
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
                </GridItem>
              </Grid>
              <Grid templateColumns="repeat(12, 1fr)">
                <GridItem colSpan={3}>
                  <FormLabel mt={2}>Search </FormLabel>
                </GridItem>
                <GridItem colSpan={9}>
                  <InputGroup>
                    <InputLeftElement zIndex={-5} pointerEvents="none">
                      <AiOutlineSearch />
                    </InputLeftElement>
                    <Input
                      value={values.search}
                      onChange={(e) =>
                        set((f) => ({
                          ...f,
                          search: e.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Query"
                    />
                  </InputGroup>
                </GridItem>
              </Grid>
              <Grid templateColumns="repeat(24, 1fr)">
                <GridItem colSpan={6}>Amount</GridItem>
                <GridItem colSpan={9} mr={1}>
                  <InputGroup>
                    <InputLeftAddon children="Max" />
                    <Input
                      value={values.search}
                      onChange={(e) =>
                        set((f) => ({
                          ...f,
                          amount: {
                            ...f.amount,
                            min: parseFloat(e.target.value),
                          },
                        }))
                      }
                      type="number"
                      placeholder="Min"
                    />
                  </InputGroup>
                </GridItem>
                <GridItem colSpan={9} ml={1}>
                  <InputGroup>
                    <InputLeftAddon children="Max" />
                    <Input
                      value={values.search}
                      onChange={(e) =>
                        set((f) => ({
                          ...f,
                          amount: {
                            ...f.amount,
                            max: parseFloat(e.target.value),
                          },
                        }))
                      }
                      type="number"
                      placeholder="Max"
                    />
                  </InputGroup>
                </GridItem>
              </Grid>

              <FormControl>
                <FormLabel>Tags</FormLabel>

                <Box mt={0}>
                  <Menu>
                    <MenuButton>
                      <Tag size="lg" variant={"outline"} colorScheme="green">
                        <TagLabel display="flex">
                          <chakra.span>Add Tag To Filter </chakra.span>
                          <chakra.span mt={0.5}>
                            <AiFillCaretDown />
                          </chakra.span>
                        </TagLabel>
                      </Tag>
                    </MenuButton>

                    <MenuList position="absolute">
                      <Wrap p={2} w={340} maxH={180} overflowY="auto">
                        {tags
                          ?.filter((t) => !values.tags?.includes(t.id))
                          .map((tag) => (
                            <Tag
                              _hover={{
                                cursor: "pointer",
                                border: "1px solid",
                              }}
                              colorScheme="blue"
                              size="lg"
                              onClick={() => {
                                if (!values.tags?.includes(tag.id)) {
                                  set((v) => ({
                                    ...v,
                                    tags: v.tags
                                      ? [...v.tags, tag.id]
                                      : [tag.id],
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
                  <Wrap my={3}>
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
                </Box>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                set({
                  paginate: { page: 1, perPage: 30 },
                  orderBy: { field: "date", direction: "desc" },
                  date: {
                    from: new Date("2021-08-01"),
                    to: new Date(),
                  },
                  amount: undefined,
                  tags: undefined,
                  search: undefined,
                  categories: undefined,
                  type: undefined,
                  account: undefined,
                });
                setFilters(values);
                onClose();
              }}
              variant="outline"
              colorScheme="orange"
            >
              Clear Filters
            </Button>
            <Button
              mr={3}
              onClick={() => onClose()}
              variant="outline"
              colorScheme="red"
            >
              Close
            </Button>
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
