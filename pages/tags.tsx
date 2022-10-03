import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineCloseCircle } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { BsFillTrashFill, BsPlusCircle } from "react-icons/bs";
import {
  useGetTags,
  useCreateTag,
  useDeleteTag,
  useUpdateTag,
  useGetTransactions,
} from "../api";
import SidebarWithHeader from "../components/Sidenav";

const Tags: NextPage = () => {
  const [editingTag, setEditingTag] = useState<string | undefined>();
  const [value, set] = useState("");
  const [newTag, setNewTag] = useState("");
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();
  const transactionsQuery = useGetTransactions({
    paginate: { perPage: 5000, page: 1 },
  });
  const transactions = transactionsQuery.data?.data.transactions;
  const tags = useGetTags();
  useEffect(() => console.log("TagsUseEffect"));
  // useEffect(() => {
  //   if (createTag.isSuccess) setNewTag("");
  // }, [createTag.isSuccess]);
  // useEffect(() => {
  //   if (updateTag.isSuccess) {
  //     set("");
  //     setEditingTag(undefined);
  //   }
  // }, [updateTag.isSuccess]);
  return (
    <>
      <SidebarWithHeader>
        <Box>
          <TableContainer mb={2} overflowY={"auto"}>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Debit</Th>
                  <Th>Credit</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <i>Unknown</i>
                  </Td>
                  <Td>
                    {transactions
                      ?.filter(
                        (t) =>
                          t.tags.includes(
                            tags.data?.data.find(
                              (tag) => tag.name === "Unknown"
                            )?.id || ""
                          ) && t.type === "Debit"
                      )
                      ?.map((t) => t.amount)
                      ?.reduce((prev, curr) => prev + curr)
                      ?.toLocaleString("en-in")}
                  </Td>
                  <Td>
                    {transactions
                      ?.filter(
                        (t) =>
                          t.tags.includes(
                            tags.data?.data.find(
                              (tag) => tag.name === "Unknown"
                            )?.id || ""
                          ) && t.type === "Credit"
                      )
                      ?.map((t) => t.amount)
                      ?.reduce((prev, curr) => prev + curr)
                      ?.toLocaleString("en-in")}
                  </Td>
                  <Td color="gray.400">
                    <i>default</i>
                  </Td>
                </Tr>
                {tags.data?.data
                  .filter((tag) => tag.name !== "Unknown")
                  .map((tag) => {
                    return (
                      <Tr key={tag.id}>
                        <Td>
                          {editingTag === tag.id ? (
                            <>
                              <Input
                                w="70%"
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                borderColor="blue.500"
                              />
                              <IconButton
                                onClick={() => {
                                  updateTag.mutate({ ...tag, name: value });
                                }}
                                variant="outline"
                                colorScheme="green"
                                icon={<TiTick />}
                                aria-label="Edit"
                                mb={1.5}
                                ml={2}
                              />
                              <IconButton
                                onClick={() => {
                                  setEditingTag(undefined);
                                  set("");
                                }}
                                variant="outline"
                                colorScheme="red"
                                icon={<AiOutlineCloseCircle />}
                                aria-label="Edit"
                                mb={1.5}
                                ml={2}
                              />
                            </>
                          ) : (
                            tag.name
                          )}
                        </Td>
                        <Td>
                          {transactions
                            ?.filter(
                              (t) =>
                                t.tags.includes(tag.id) && t.type === "Debit"
                            )
                            ?.map((t) => t.amount)
                            ?.reduce((prev, curr) => prev + curr, 0)
                            ?.toLocaleString("en-in")}
                        </Td>
                        <Td>
                          {transactions
                            ?.filter(
                              (t) =>
                                t.tags.includes(tag.id) && t.type === "Credit"
                            )
                            ?.map((t) => t.amount)
                            ?.reduce((prev, curr) => prev + curr, 0)
                            ?.toLocaleString("en-in")}
                        </Td>
                        <Td>
                          <ButtonGroup variant="solid" size="sm" spacing={3}>
                            <IconButton
                              onClick={() => {
                                if (editingTag !== tag.id) {
                                  setEditingTag(tag.id);
                                  set(tag.name);
                                } else {
                                  setEditingTag(undefined);
                                  set("");
                                }
                              }}
                              variant="outline"
                              colorScheme="blue"
                              icon={<AiFillEdit />}
                              aria-label="Edit"
                            />
                            <IconButton
                              colorScheme="red"
                              variant="outline"
                              icon={<BsFillTrashFill />}
                              aria-label="Delete"
                              onClick={() => {
                                deleteTag.mutate(tag.id);
                              }}
                            />
                          </ButtonGroup>
                        </Td>
                      </Tr>
                    );
                  })}
                <Tr>
                  <Td>
                    <Input
                      border="1px solid"
                      borderColor="blue.500"
                      placeholder="New tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        createTag.mutate(newTag);
                      }}
                      colorScheme="green"
                    >
                      <BsPlusCircle style={{ marginRight: 2 }} />
                      Add
                    </Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </SidebarWithHeader>
    </>
  );
};

export default Tags;
