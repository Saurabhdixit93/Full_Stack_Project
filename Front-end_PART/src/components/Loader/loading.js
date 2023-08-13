import React from "react";
import { Center, Spinner } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Center>
      <Spinner size="xl" color="blue.700" />
    </Center>
  );
};

export default Loader;
