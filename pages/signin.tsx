import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Divider,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import ToggleColorMode from "../components/ToggleColorMode";
import { signIn, getSession } from "next-auth/react";
import { GetServerSideProps, NextPage } from "next";

const Signin: NextPage = () => {
	const github = useColorModeValue("black", "white");
	const boxColor = useColorModeValue("white", "gray.700");
	const bg = useColorModeValue("gray.50", "gray.800");
	return (
		<>
			<Text
				align="center"
				fontSize="3xl"
				fontWeight="bold"
				w="100%"
				color="blue.500"
				mt={5}
			>
				Cashalytics
			</Text>
			<Box position="absolute" right="1" top="1">
				<ToggleColorMode />
			</Box>
			<Flex minH={"80vh"} align={"center"} justify={"center"} bg={bg}>
				<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
					<Stack align={"center"}>
						<Heading textAlign="center" fontSize={"4xl"}>
							Sign in to your account
						</Heading>
						<Text fontSize={"lg"} color={"gray.500"}>
							to enjoy all of our cool features ✌️
						</Text>
					</Stack>
					<Box rounded={"lg"} bg={boxColor} boxShadow={"lg"} p={8}>
						<Stack spacing={4}>
							<FormControl id="email">
								<FormLabel>Email address</FormLabel>
								<Input disabled type="email" />
							</FormControl>

							<Stack spacing={5}>
								<Button
									bg={"blue.400"}
									color={"white"}
									_hover={{
										bg: "blue.500",
									}}
									disabled
								>
									Magic Link Signin
								</Button>
								<div>
									<Divider />
								</div>
								<Text fontSize="sm" color="gray.400" align="center">
									Or Signin using:
								</Text>
								<Button
									onClick={() => signIn("google")}
									colorScheme="blue"
									variant="outline"
									display="flex"
								>
									<FcGoogle size={20} />
									<Flex justifyContent="center" fontSize={"lg"} ml={2}>
										<Text color="blue.500">G</Text>
										<Text color="red.500">o</Text>
										<Text color="yellow.500">o</Text>
										<Text color="blue.500">g</Text>
										<Text color="green.500">l</Text>
										<Text color="red.500">e</Text>
									</Flex>
								</Button>
								<Button
									onClick={() => signIn("github")}
									colorScheme="blue"
									variant="outline"
								>
									<Box color={github}>
										<ImGithub size={20} />
									</Box>
									<Text color={github} ml={2}>
										GitHub
									</Text>
								</Button>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Flex>
		</>
	);
};
export default Signin;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	return { props: {} };
};
