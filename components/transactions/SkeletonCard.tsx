import { Box, Flex, Skeleton, useColorModeValue } from "@chakra-ui/react";

const SkeletonCard = () => {
  const border = useColorModeValue("gray.100", "gray.700");
  return (
    <div>
      <Box p={3} borderRadius={8} border={"1px solid"} borderColor={border}>
        <Flex gap={2} align={"stretch"}>
          <Skeleton flexGrow={1}>
            <h1>Name</h1>
          </Skeleton>
        </Flex>
        <Skeleton my={2}>
          <h1>Name</h1>
        </Skeleton>
        <Skeleton mt={2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
        </Skeleton>
      </Box>
    </div>
  );
};

export default SkeletonCard;
