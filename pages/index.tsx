import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MonthlyExpendiuteCard from "../components/dashboard/MonthlyExpendiuteCard";
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
      {session.status === "loading" && (
        <Flex alignItems="center" justifyContent="center" w="100vw" h="100vh">
          <Spinner size="xl" />
        </Flex>
      )}
      {session.status === "authenticated" && (
        <SidebarWithHeader>
          <Container maxW={window?.innerWidth - 200}>
            <Box>
              <MonthlyExpendiuteCard />
            </Box>
          </Container>
        </SidebarWithHeader>
      )}
    </>
  );
};

export default Home;
