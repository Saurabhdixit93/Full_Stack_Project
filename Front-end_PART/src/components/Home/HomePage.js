import React from "react";
import { Box, Button, Heading, Center, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getTokenCookie } from "../../AuthCookie/authToken";
import makeRequest from "../../Axios/axiosReq";

const HomePage = () => {
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId;
  }
  const hndleGet = async (e) => {
    e.preventDefault();
    // const friendId = "64d754689db6f9315bc4ed3e";
    // await makeRequest(
    //   `/user/${friendId}/add-friend?loggedUserId=${userId}`,
    //   "GET",
    //   user,
    //   null
    // ); //add friend
    // await makeRequest(
    //   `/user/users-friends?loggedUserId=${userId}`,
    //   "GET",
    //   user,
    //   null
    // ) // users and friends fetch /get-user-datails

    await makeRequest(`/user/get-user-datails/${userId}`, "GET", user, null)
      .then((data) => {
        if (data.success) {
          console.log(data);
          return;
        }
        console.log(data.message);
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Center minHeight={"50vh"}>
      <Box textAlign="center">
        <Heading as="h1" mb={10}>
          Welcome to Our Website!
        </Heading>
        {!user && (
          <>
            <VStack spacing={4}>
              <Button as={RouterLink} to="/login" colorScheme="blue" size="lg">
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme="green"
                size="lg"
              >
                Sign Up
              </Button>
            </VStack>
          </>
        )}
      </Box>
    </Center>
  );
};

export default HomePage;
