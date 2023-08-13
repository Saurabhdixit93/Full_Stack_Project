import React from "react";
import { Box, Flex, Spacer, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getTokenCookie } from "../AuthCookie/authToken";

const Navbar = () => {
  const user = getTokenCookie();
  return (
    <Box bg="blue.500" py={3}>
      <Flex maxW="1200px" mx="auto" px={4}>
        <IconButton
          display={{ base: "block", md: "none" }}
          variant="ghost"
          size="md"
          ml={-2}
          mr={2}
        />
        <Link
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color="white"
        >
          Oru Phones
        </Link>
        <Spacer />
      </Flex>
    </Box>
  );
};

export default Navbar;
