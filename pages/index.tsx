import { Grid } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession, getSession } from "next-auth/react";
import SidebarWithHeader from "../components/Sidenav";

const Home: NextPage = () => {
	const { data: session } = useSession();
	return (
		<>
			<SidebarWithHeader>
				<Grid></Grid>
			</SidebarWithHeader>
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		const session = await getSession(context);
		if (!session)
			return {
				redirect: {
					destination: "/signin",
					permanent: false,
				},
			};
		return {
			props: {
				session,
			},
		};
	} catch (err) {
		console.log(err);
		alert(err);
		return {
			props: {},
		};
	}
};
