import { MoneyAccount, Tag, Transaction, Type } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { filters } from "../types/filter";

let queryCount = 0;
function CallQuery(type: string) {
  queryCount++;
  console.log("QueryCount", queryCount, type);
}

const getAllTransactions = async (
  filters: filters
): Promise<
  AxiosResponse<{ transactions: Transaction[]; count: number }, any>
> => {
  CallQuery("getAllTransactions");
  let query = "";
  if (filters.count) query = query + `&count=${filters.count}`;
  if (filters.search) query = query + `&search=${filters.search}`;
  if (filters.tags) query = query + `&tags=${filters.tags.join(",")}`;
  if (filters.paginate) {
    const { page, perPage } = filters.paginate;
    query = query + `&page=${page}&perPage=${perPage}`;
  }
  if (filters.date) {
    const { from, to } = filters.date;
    query = query + `&from=${from}&to=${to}`;
  }
  if (filters.amount) {
    const { minAmount, maxAmount } = filters.amount;
    query = query + `&minAmount=${minAmount}&maxAmount=${maxAmount}`;
  }
  if (filters.orderBy) {
    const { field, direction } = filters.orderBy;
    query = query + `&orderBy=${field}&direction=${direction}`;
  }
  if (filters.type) query = query + `&type=${filters.type}`;
  return axios.get(`/api/transaction/all?${query}`);
};

const editTransactions = (
  transactions: Transaction[]
): Promise<AxiosResponse<Transaction[], any>> => {
  CallQuery("editTransactions");
  return axios.put(`/api/transaction`, transactions);
};

const getTags = (): Promise<AxiosResponse<Tag[], any>> => {
  CallQuery("getTags");
  return axios.get(`/api/tag/all`);
};

const createTag = (name: string) => {
  CallQuery("createTag");
  return axios.post(`/api/tag`, { name });
};

const updateTag = (tag: Tag) => {
  CallQuery("updateTag");
  return axios.put(`/api/tag`, tag);
};

const deleteTag = (id: string) => {
  CallQuery("deleteTag");
  return axios.delete(`/api/tag?id=${id}`);
};

const getAccounts = (): Promise<AxiosResponse<MoneyAccount[], any>> => {
  CallQuery("getAccounts");
  return axios.get(`/api/account`);
};

const createAccount = (account: {
  name: string;
  bankName?: string;
  description: string;
  balance: number;
}) => {
  CallQuery("createAccount");
  return axios.post(`/api/account`, account);
};

const editAccount = (account: MoneyAccount) => {
  CallQuery("editAccount");
  return axios.put(`/api/account`, account);
};

const createTransaction = (
  t: {
    amount: number;
    type: Type;
    date: Date;
    tags: string[];
    reference?: string;
    description: string;
    accountId: string;
    closingBalance?: number;
    isArchived: boolean;
  }[]
) => {
  CallQuery("createTransaction");
  return axios.post(`/api/transaction`, t);
};

export const useCreateTransaction = () => {
  const client = useQueryClient();
  return useMutation(createTransaction, {
    onSuccess: () => client.invalidateQueries(["transactions"]),
  });
};

export const useCreateTag = () => {
  const client = useQueryClient();
  return useMutation(createTag, {
    onSuccess: () => client.invalidateQueries(["tags"]),
  });
};

export const useUpdateTag = () => {
  const client = useQueryClient();
  return useMutation(updateTag, {
    onSuccess: () => client.invalidateQueries(["tags"]),
  });
};

export const useDeleteTag = () => {
  const client = useQueryClient();
  return useMutation(deleteTag, {
    onSuccess: () => client.invalidateQueries(["tags"]),
  });
};

export const useEditTransactions = () => {
  const client = useQueryClient();
  return useMutation(editTransactions, {
    onSuccess: () => client.invalidateQueries(["transactions"]),
  });
};

export const useCreateAccount = () => {
  const client = useQueryClient();
  return useMutation(createAccount, {
    onSuccess: () => client.invalidateQueries(["accounts"]),
  });
};

export const useEditAccount = () => {
  const client = useQueryClient();
  return useMutation(editAccount, {
    onSuccess: () => client.invalidateQueries(["accounts"]),
  });
};

export const useGetTransactions = (filters: filters) => {
  return useQuery(
    ["transactions", { ...filters }],
    () => getAllTransactions(filters),
    {
      onSuccess: (data) => data.data,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
};

export const useGetTags = () => {
  return useQuery(["tags"], () => getTags(), {
    onSuccess: (data) => {
      return data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 1000 * 60 * 2, // every 2 mins
  });
};

export const useGetAccounts = () => {
  return useQuery(["accounts"], () => getAccounts(), {
    onSuccess: (data) => {
      return data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 1000 * 60 * 2, // every 2 mins
  });
};
