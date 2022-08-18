import { Flex, Icon, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import Link from "next/link";
interface NavItemProps extends FlexProps {
	icon: IconType;
	children: any;
	route: string;
}
const NavItem = ({ icon, route, children, ...rest }: NavItemProps) => {
	return (
		<Link href={route} style={{ textDecoration: "none" }}>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: "blue.600",
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};
export default NavItem;
