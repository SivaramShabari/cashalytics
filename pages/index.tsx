import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SidebarWithHeader from "../components/Sidenav";

const Home: NextPage = () => {
	const session = useSession();
	const router = useRouter();
	useEffect(() => {
		if (session.status === "unauthenticated") {
			router.push("/signin");
		}
	}, [session, router]);
	return (
		<>
			<SidebarWithHeader>
				<></>
			</SidebarWithHeader>
		</>
	);
};

export default Home;
