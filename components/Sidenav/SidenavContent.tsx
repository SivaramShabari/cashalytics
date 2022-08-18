import {
	Box,
	CloseButton,
	Flex,
	useColorModeValue,
	Text,
	BoxProps,
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";
import NavItem from "./NavItem";

interface SidebarProps extends BoxProps {
	onClose: () => void;
}
interface LinkItemProps {
	name: string;
	icon: IconType;
	route: string;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: "Dashboard", icon: FiHome, route: "/" },
	{ name: "Table View", icon: FiTrendingUp, route: "table-view" },
	{ name: "Manage Data", icon: FiCompass, route: "manage-data" },
	{ name: "Settings", icon: FiSettings, route: "settings" },
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
