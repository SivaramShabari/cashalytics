import { Box, Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import SidebarWithHeader from "../components/Sidenav";

export default function NotFound() {
	return (
		<SidebarWithHeader>
			<Box
				textAlign="center"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				minH={"80vh"}
				py={10}
				px={6}
			>
				<Heading display="inline-block" as="h2" size="2xl" color="blue.500">
					404
				</Heading>
				<Text fontSize="18px" mt={3} mb={2}>
					Page Not Found
				</Text>
				<Text color={"gray.500"} mb={6}>
					The page you{"'"}re looking for does not seem to exist
				</Text>
				<Box>
					<Link href="/">
						<Button colorScheme="blue" variant="outline">
							Go to Home
						</Button>
					</Link>
				</Box>
			</Box>
		</SidebarWithHeader>
	);
}
