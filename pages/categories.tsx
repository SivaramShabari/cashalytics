import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import SidebarWithHeader from "../components/Sidenav";

const Categories: NextPage = () => {
	return (
		<>
			<SidebarWithHeader>
				<></>
			</SidebarWithHeader>
		</>
	);
};

export default Categories;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session)
		return {
			redirect: {
				destination: "/signin",
				permanent: true,
			},
		};
	return {
		props: {
			session,
		},
	};
};
