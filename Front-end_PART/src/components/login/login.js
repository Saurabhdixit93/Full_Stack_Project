import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  Alert,
  AlertIcon,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Loader from "../Loader/loading";
import makeRequest from "../../Axios/axiosReq";
import Cookies from "js-cookie";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ status: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await makeRequest("/user/login", "POST", null, formData)
      .then((data) => {
        if (data.success) {
          setMessage({
            status: "success",
            text: data.message,
          });
          const token = data.token;
          Cookies.set("token", token, { expires: 7 });
          setTimeout(() => {
            navigate("/add-details");
            window.location.reload();
          }, 5000);
          return;
        } else {
          setMessage({
            status: "error",
            text: data.message,
          });
          return;
        }
      })
      .catch((error) => {
        setMessage({
          status: "error",
          text: error.message,
        });
        return;
      });
  };

  return (
    <Center minHeight="100vh">
      <Box
        borderWidth={1}
        px={4}
        width={{ base: "100%", sm: "400px" }}
        py={8}
        rounded="lg"
        boxShadow="lg"
      >
        <Heading as="h1" mb={6} textAlign="center">
          Log In
        </Heading>

        {message.status && (
          <Alert status={message.status} mb={4}>
            <AlertIcon />
            {message.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="Enter Valid email ."
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="Enter Valid password ."
            />
          </FormControl>

          {isLoading ? (
            <Loader />
          ) : (
            <Button type="submit" colorScheme="blue" width="full">
              Log In
            </Button>
          )}
        </form>
        <IconButton
          as={RouterLink}
          to="/"
          icon={<ArrowBackIcon />}
          aria-label="Back to Home"
          mr={2}
          mt={4}
        />
      </Box>
    </Center>
  );
};

export default LoginForm;
