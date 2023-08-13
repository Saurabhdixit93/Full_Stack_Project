import React from "react";
import { Box, Flex, Text, IconButton, Icon } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box bg="gray.200" py={4}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text>
          &copy; {new Date().getFullYear()} Saurabh Dixit. All rights reserved.
        </Text>
        <IconButton
          icon={<Icon as={ChevronUpIcon} />}
          variant="ghost"
          size="md"
          aria-label="Back to Top"
          onClick={handleScrollToTop}
        />
      </Flex>
    </Box>
  );
};

export default Footer;
