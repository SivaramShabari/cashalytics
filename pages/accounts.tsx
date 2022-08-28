import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { MoneyAccount } from "@prisma/client";
import { NextPage } from "next";
import { useGetAccounts } from "../api";
import AccountCard from "../components/accounts/AccountCard";
import SidebarWithHeader from "../components/Sidenav";

const AccountsPage: NextPage = () => {
	const account = useGetAccounts();
	return (
		<>
			<SidebarWithHeader>
				<Text fontWeight="bold" ml={2} my={3} fontSize="3xl">
					Accounts
				</Text>
				<Box>
					<SimpleGrid columns={[1, 1, 1, 2, 3]}>
						{account.data?.data.map((account: MoneyAccount) => (
							<AccountCard key={account.id} account={account} />
						))}
					</SimpleGrid>
				</Box>
			</SidebarWithHeader>
		</>
	);
};

export default AccountsPage;
