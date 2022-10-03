import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import ToggleColorMode from "../ToggleColorMode";
interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session } = useSession();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="3xl"
        fontWeight="bold"
        color="blue.500"
      >
        Cashalytics
      </Text>

      <HStack spacing={{ base: "1", md: "6" }}>
        <ToggleColorMode />
        {/* <IconButton
					size="lg"
					variant="outline"
					aria-label="open menu"
					icon={<FiBell />}
				/> */}
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={session?.user?.image || ""} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{session?.user?.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {session?.user?.email}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList borderColor={useColorModeValue("gray.200", "gray.700")}>
              <VStack
                display={{ base: "flex", md: "none" }}
                alignItems="flex-start"
                spacing="1px"
                m="2"
              >
                <Text fontSize="sm">{session?.user?.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {session?.user?.email}
                </Text>
              </VStack>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
