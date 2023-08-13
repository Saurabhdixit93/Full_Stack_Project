import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Divider,
  Stack,
  Center,
  Spinner,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  FormLabel,
  FormControl,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { getTokenCookie } from "../../AuthCookie/authToken";
import makeRequest from "../../Axios/axiosReq";
import { EditIcon } from "@chakra-ui/icons";
import Loader from "../Loader/loading";
const ProfilePage = () => {
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState({ status: "", text: "" });

  const handleEdit = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [personalData, setPersonalData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await makeRequest(`/user/get-user-datails/${userId}`, "GET", user, null)
          .then((data) => {
            if (data.success) {
              setUserData(data.details);
              setIsLoading(false);
            } else {
              alert(`${data.message}`);
              return;
            }
          })
          .catch((error) => {
            alert("Server Error");
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    const fetUserPersonal = async () => {
      try {
        await makeRequest(`/user/get-user/${userId}`, "GET", user, null).then(
          (data) => {
            if (data.success) {
              setPersonalData(data.userDetails);
              setIsLoading(false);
            } else {
              alert(`${data.message}`);
              return;
            }
          }
        );
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetUserPersonal();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // const formData = new FormData();
    // formData.append("name", personalData.name);
    // formData.append("email", personalData.email);
    // formData.append("phoneNumber", personalData.phoneNumber);
    // formData.append("profile_picture", selectedImage);
    const formData = {
      name: personalData.name,
      email: personalData.email,
      phoneNumber: personalData.phoneNumber,
      profile_picture: selectedImage,
    };

    try {
      await makeRequest(`/user/update-user/${userId}`, "PUT", user, formData)
        .then((data) => {
          if (data.success) {
            setMessage({
              status: "success",
              text: data.message,
            });
            setIsLoading(false);
            setTimeout(() => {
              setSelectedImage(null);
              setIsOpen(false);
              window.location.reload();
            }, 5000);
            return;
          } else {
            setMessage({
              status: "error",
              text: data.message,
            });
            setIsLoading(false);
            return;
          }
        })
        .catch((error) => {
          setMessage({
            status: "error",
            text: error.message,
          });
          setIsLoading(false);
          return;
        });
    } catch (error) {
      setMessage({
        status: "error",
        text: error.message,
      });
      setIsLoading(false);
      return;
    }
  };
  const about = userData && userData[0].about;
  const skills = userData && userData[0].skills;
  const experiences = userData && userData[0].experiences;
  const education = userData && userData[0].education;

  return (
    <Box textAlign={"center"} p={5}>
      <Center>
        <Flex direction="column" align="center">
          <Avatar
            size="2xl"
            name={personalData && personalData.name}
            src={personalData && personalData.profile_picture}
            mb={4}
          />
          <IconButton
            icon={<EditIcon />}
            onClick={handleEdit}
            position="absolute"
            top={20}
            right={2}
            aria-label="Edit"
          />
          <Heading as="h1" size="xl" mb={2}>
            {personalData && personalData.name}
          </Heading>
          <Text color="gray.500" mb={4}>
            {personalData && personalData.email}
          </Text>
          <Text mt={2}> {personalData && personalData.phoneNumber}</Text>
        </Flex>

        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {message.status && (
                <Alert status={message.status} mb={4}>
                  <AlertIcon />
                  {message.text}
                </Alert>
              )}
              <form onSubmit={updateDetails}>
                <FormControl mb={4}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={personalData && personalData.name}
                    onChange={(e) =>
                      setPersonalData({ ...personalData, name: e.target.value })
                    }
                    required
                    placeholder="Enter your Name"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={personalData && personalData.email}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        email: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter your valid email"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={personalData && personalData.phoneNumber}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        phoneNumber: e.target.value,
                      })
                    }
                    required
                    maxLength={10}
                    placeholder="Enter your valid phone number"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Profile Picture</FormLabel>
                  <Input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt={selectedImage}
                      style={{ maxWidth: "100%", marginTop: "10px" }}
                    />
                  )}
                </FormControl>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Button type="submit" colorScheme="blue" width="full">
                    Update Details
                  </Button>
                )}
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Center>

      <Divider my={6} />

      {isLoading ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Stack spacing={6}>
          <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              About Me
            </Heading>
            <Text>{about}</Text>
          </Box>

          <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              Skills
            </Heading>
            <Text>{skills}</Text>
          </Box>

          <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              Experiences
            </Heading>
            {experiences && experiences.length > 0 ? (
              experiences.map((experience, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="md"
                  mb={4}
                >
                  <Text fontWeight="bold" mb={2}>
                    Job Type: {experience.typeEx}
                  </Text>
                  <Text fontWeight="bold" mb={2}>
                    Company Name: {experience.companyName}
                  </Text>
                  <Text>Year: {experience.yearEx}</Text>
                  <Text>description:{experience.descriptionEx}</Text>
                </Box>
              ))
            ) : (
              <Text>No experiences to display.</Text>
            )}
          </Box>

          <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              Education
            </Heading>
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="md"
                  mb={4}
                >
                  <Text fontWeight="bold" mb={2}>
                    Degree: {edu.degreeType}
                  </Text>
                  <Text fontWeight="bold" mb={2}>
                    Institute: {edu.instituteName}
                  </Text>
                  <Text>
                    {edu.startYear} - {edu.endYear}
                  </Text>
                  <Text> description: {edu.descriptionInst}</Text>
                </Box>
              ))
            ) : (
              <Text>No education details to display.</Text>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default ProfilePage;
