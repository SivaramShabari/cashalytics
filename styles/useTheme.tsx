import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export default function useTheme() {
	const bg = useColorModeValue("light", "dark");
	const text = useColorModeValue("gray.800", "gray.50");
	const border = useColorModeValue("gray.200", "gray.700");
	const primary = useColorModeValue("primary.500", "primary.600");
	const primaryFocus = useColorModeValue("primary.600", "primary.500");
	const secondary = useColorModeValue("blue.500", "blue.600");
	const secondaryFocus = useColorModeValue("blue.600", "blue.500");
	return { bg, text, border, primary, primaryFocus, secondary, secondaryFocus };
}
