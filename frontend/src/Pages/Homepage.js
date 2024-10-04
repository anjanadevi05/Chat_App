import { Box, Container, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // useHistory for React Router v5
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const Homepage = () => {
  const history = useHistory(); // useHistory for navigation

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats"); // use history.push to navigate
    }
  }, [history]); // Keep the dependency array with history

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="rgba(0, 0, 0, 0)"
        width="100%"
        m="10px 0 15px 0"
      >
        <Text
          fontSize="4xl"
          fontFamily="Sofadi One"
          color="whitesmoke"
          textAlign="center"
        >
          CHATSY
        </Text>
      </Box>
      <Box
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        bg="rgba(0, 0, 0, 0.3)"
        textColor="white"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" textColor="white">
              Login
            </Tab>
            <Tab width="50%" textColor="white">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login />}</TabPanel>
            <TabPanel>{<Signup />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
