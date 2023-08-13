import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Spacer,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Cookies from "js-cookie";
import { getTokenCookie } from "../../AuthCookie/authToken";

const SideBar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [icon, setIcon] = useState(<FiChevronLeft />);
  const user = getTokenCookie();
  const toggleIcon = () => {
    setIcon(isOpen ? <FiChevronLeft /> : <FiChevronRight />);
  };
  const logOut = async (e) => {
    e.preventDefault();
    alert("Are you sure to logout");
    try {
      if (user) {
        Cookies.remove("token");
        alert("Logout Success");
        window.location.reload();
        return;
      }
    } catch (error) {
      alert(`${error.message}`);
      return;
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="row">
      <Collapse in={isOpen} style={{ width: isOpen ? "250px" : "20px" }}>
        <VStack spacing={2} flex="1" align="stretch">
          <Button
            as={RouterLink}
            to={"/add-details"}
            colorScheme="blue"
            mb={4}
            alignSelf="start"
          >
            Dashboard
          </Button>
          <Button as={RouterLink} to="/my-connections" variant="outline">
            My Connections
          </Button>
          <Button as={RouterLink} to="/my-profile" variant="outline">
            My Profile
          </Button>
          <Spacer />
          <Button onClick={logOut} colorScheme="red" alignSelf="start">
            Logout
          </Button>
        </VStack>
      </Collapse>
      <Button
        onClick={() => {
          onToggle();
          toggleIcon();
        }}
        alignSelf="flex-start"
        variant="ghost"
        marginRight={"40px"}
      >
        {icon}
      </Button>
    </Box>
  );
};

export default SideBar;
