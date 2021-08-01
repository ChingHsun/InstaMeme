import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Container, Flex } from "@chakra-ui/layout";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { getUsersAction } from "../../redux/actions";
import defaultUser from "../../utils/imgs/catuser.png";
import MyCreated from "./MyCreated";
import MySaved from "./MySaved";
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import EditModal from "./EditModal";

const StyledProfie = styled(Box)`
  .intro__container {
    h3 {
      font-size: 1.5rem;
      font-weight: 900;
    }
    p {
    }
  }
`;

const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { userId, tab } = useParams();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();
  const users = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.auth);

  useEffect(() => {
    if (!users || !users[userId]) {
      dispatch(getUsersAction(userId));
    }
  }, [users, userId, dispatch]);
  useEffect(() => {
    if (tab === "myCreated") {
      setTabIndex(1);
    }
  }, [tab]);
  const onSettings = () => {
    onOpen();
  };

  return (
    <StyledProfie maxWidth="100vw" pt="100px" pb="5" width="100vw">
      <Container py="4" maxW="1200px" paddingX="10">
        <Flex marginBottom="10" justifyContent="center" alignItems="center">
          <Box>
            <Avatar
              name={users?.[userId]?.displayName}
              src={users?.[userId]?.image || defaultUser}
              size="2xl"
              margin="50px"
              bg="white"
            />
          </Box>

          <Box className="intro__container" flexBasis="20%">
            <h3>@{users?.[userId]?.displayName}</h3>
            <p>{users?.[userId]?.introduction}</p>
            {authUser && authUser.uid === userId && (
              <>
                <Button
                  bg="brand.yellow"
                  color="brand.dark"
                  onClick={onSettings}
                  m=" 20px 20px 20px 0"
                >
                  設定個人資料
                </Button>
              </>
            )}
          </Box>
        </Flex>
        <Tabs
          isLazy
          isFitted
          variant="enclosed"
          defaultIndex={tab === "myCreated" ? 1 : 0}
          onChange={(index) => {
            setTabIndex(index);
            if (index === 0) {
              history.push(`./mySaved`);
            } else if (index === 1) {
              history.push(`./myCreated`);
            }
          }}
        >
          <TabList mb="1em">
            <Tab color="white" _selected={{ color: "brand.dark", bg: "white" }}>
              我的收藏
            </Tab>
            <Tab color="white" _selected={{ color: "brand.dark", bg: "white" }}>
              我的創作
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MySaved
                tabIndex={tabIndex}
                userId={userId}
                data={users?.[userId]?.saved}
              ></MySaved>
            </TabPanel>
            <TabPanel>
              <MyCreated
                tabIndex={tabIndex}
                userId={userId}
                data={users?.[userId]?.created}
              ></MyCreated>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <EditModal onClose={onClose}></EditModal>
      </Modal>
    </StyledProfie>
  );
};

export default Profile;
