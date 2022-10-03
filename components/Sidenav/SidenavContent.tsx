import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import { FiTag } from "react-icons/fi";
import { TbTransferIn } from "react-icons/tb";
import { IconType } from "react-icons";
import NavItem from "./NavItem";
import { RiUserSettingsLine } from "react-icons/ri";
import { MdOutlineDashboard } from "react-icons/md";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: MdOutlineDashboard, route: "/" },
  { name: "Transactions", icon: TbTransferIn, route: "transactions" },
  { name: "Tags", icon: FiTag, route: "tags" },
  { name: "Account Settings", icon: RiUserSettingsLine, route: "settings" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box transition="2s ease-in-out">
      <Box
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.route} route={link.route} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    </Box>
  );
};

export default SidebarContent;
