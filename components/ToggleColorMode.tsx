import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { IconButton, useColorMode } from "@chakra-ui/react";
export default function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <IconButton
        size="lg"
        variant="ghost"
        aria-label="open menu"
        onClick={toggleColorMode}
        icon={
          colorMode === "light" ? <MdOutlineDarkMode /> : <MdOutlineLightMode />
        }
      />
    </>
  );
}
