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
  InputGroup,
  InputRightElement,
  FormHelperText,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { MdCancel } from "react-icons/md";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import makeRequest from "../../Axios/axiosReq";
import Loader from "../Loader/loading";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profile_picture: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ status: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profile_picture: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setMessage({ status: "error", text: "Passwords do not match." });
      return;
    }
    console.log("setProfile_picture", formData.profile_picture);
    await makeRequest("/user/sign_up", "POST", null, formData)
      .then((data) => {
        setIsLoading(false);
        if (data.success) {
          setMessage({
            status: "success",
            text: data.message,
          });
          setTimeout(() => {
            navigate("/login");
          }, 5000);
          return;
        } else {
          setIsLoading(false);
          setMessage({
            status: "error",
            text: data.message,
          });
          return;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setMessage({
          status: "error",
          text: error.message,
        });
        return;
      });
  };

  const handleImageDeselect = () => {
    setFormData({ ...formData, profile_picture: null });
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
        <Heading mb={4} textAlign="center">
          Sign Up
        </Heading>
        {message.status && (
          <Alert status={message.status} mb={4}>
            <AlertIcon />
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Enter your Name"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="Enter your valid email"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
              maxLength={10}
              placeholder="Enter your valid phone number"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="Enter your Password"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={handlePasswordToggle}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                placeholder="Enter your Confirm password"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={handleConfirmPasswordToggle}
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
            </InputGroup>
            {formData.password !== formData.confirmPassword && (
              <FormHelperText color="red">
                Passwords do not match.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Profile Picture</FormLabel>
            <Input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handlePicChange}
            />
            {formData.profile_picture && (
              <Box mt={4} position="relative">
                <Image
                  src={formData.profile_picture}
                  maxW="100%"
                  h="auto"
                  boxShadow="md"
                  borderRadius="md"
                  alt="Profile Picture Preview"
                />
                <IconButton
                  icon={<MdCancel />}
                  onClick={handleImageDeselect}
                  position="absolute"
                  top="0"
                  right="0"
                  size="sm"
                  colorScheme="red"
                  aria-label="Cancel"
                />
              </Box>
            )}
          </FormControl>
          {isLoading ? (
            <Loader />
          ) : (
            <Button type="submit" colorScheme="blue" width="full">
              Sign Up
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

export default SignupForm;
