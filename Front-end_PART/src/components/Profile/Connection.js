import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Stack,
  Text,
  Button,
  useColorModeValue,
  useToast,
  VStack,
  Heading,
  Divider,
} from "@chakra-ui/react";
import makeRequest from "../../Axios/axiosReq";
import { getTokenCookie } from "../../AuthCookie/authToken";

const ConnectionsPage = () => {
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId;
  }
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await makeRequest(
          `/user/users-friends?loggedUserId=${userId}`,
          "GET",
          user,
          null
        ).then((data) => {
          setUsers(data.users);
          setFriends(data.friends);
          return;
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  //   const handleFriendAction = async (friendId, isFriend) => {
  //     try {
  //       const response = await makeRequest(
  //         `/user/${action}-friend/${friendId}`,
  //         "POST",
  //         user,
  //         null
  //       );
  //       // Update the UI or show a toast message based on the response
  //       if (response.success) {
  //         // Update the user's friend status in the state
  //         setUsers((prevUsers) =>
  //           prevUsers.map((u) =>
  //             u._id === friendId ? { ...u, isFriend: !isFriend } : u
  //           )
  //         );
  //       } else {
  //         // Handle the error case
  //         // Show an error toast message or handle it in another way
  //       }
  //     } catch (error) {
  //       console.error("Friend action error:", error);
  //       // Handle error
  //     }
  //   };
  const handleFriendAction = async (friendId) => {
    try {
      await makeRequest(
        `/user/${friendId}/add-friend?loggedUserId=${userId}`,
        "GET",
        user,
        null
      )
        .then((data) => {
          if (data.isFriend) {
            setIsFriend(true);
            window.location.reload();
          } else {
            setIsFriend(false);
            window.location.reload();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
          return;
        });
    } catch (error) {
      alert(`${error.message}`);
      return;
    }
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} minH="100vh" p={6}>
      <VStack spacing={4} alignItems="stretch">
        {users || !isFriend ? (
          users.map((user) => (
            <Box
              key={user._id}
              p={4}
              borderWidth={1}
              borderColor="gray.200"
              borderRadius="md"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">{user.name}</Heading>
                <Button
                  colorScheme={user.isFriend ? "red" : "green"}
                  onClick={() => handleFriendAction(user._id)}
                >
                  {isFriend ? "Remove connection" : "Add connection"}
                </Button>
              </Flex>
              <Text mt={2} color="gray.600">
                {user.email}
              </Text>
            </Box>
          ))
        ) : (
          <Heading> No User Availabe</Heading>
        )}
        <Divider my={6} />
        <Heading as={"h2"} textAlign={"center"}>
          {" "}
          All Connection
        </Heading>
        {friends.length !== 0 ? (
          friends.map((friend) => (
            <Box
              key={friend._id}
              p={4}
              borderWidth={1}
              borderColor="gray.200"
              borderRadius="md"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">{friend.friend_name}</Heading>
                <Button
                  colorScheme={"green"}
                  onClick={() => handleFriendAction(friend._id)}
                >
                  {isFriend ? "Add connection" : "Remove connection"}
                </Button>
              </Flex>
            </Box>
          ))
        ) : (
          <Heading> no Friend</Heading>
        )}
      </VStack>
    </Box>
  );
};

export default ConnectionsPage;
