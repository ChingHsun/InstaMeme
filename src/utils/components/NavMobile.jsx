import React, { useRef, useState } from "react";
import styled from "styled-components";

import {
  Avatar,
  Modal,
  ModalOverlay,
  useDisclosure,
  IconButton,
  Box,
  Grid,
  Button,
  Image,
  Flex,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import logo from "../imgs/logoblack.png";
import { BiSearchAlt } from "react-icons/bi";
import { MdExplore } from "react-icons/md";
import { CgAddR } from "react-icons/cg";
import EditModal from "../../pages/profile/EditModal";
import defaultUser from "../imgs/catuser.png";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SignupModal from "./SignupModal";
import SearchModal from "./SearchModal";
import LoginModal from "./LoginModal";
import { auth } from "../../firebase/auth";
import { getAuthAction, logoutAuthSavedAction } from "../../redux/actions";
const StyledNavMobileTop = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 100;
  width: 100vw;
`;
const StyledNavMobileBottom = styled(Flex)`
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100vw;
  justify-content: space-around;
  align-items: center;
  img {
    display: inline-block;
    width: 100%;
    max-width: 180px;
  }
  .search__icon {
    transform: scaleX(-1);
  }
`;
const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isTablet = useSelector((state) => state.device.isTablet);
  const isMobile = useSelector((state) => state.device.isMobile);
  const dispatch = useDispatch();
  const history = useHistory();
  const initialRef = useRef();
  const finalRef = useRef();
  const [modal, setModal] = useState("login");
  const authUser = useSelector((state) => state.auth);
  const handleModalUi = (uiState) => {
    setModal(uiState);
    onOpen();
  };

  const onSignout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(getAuthAction(null));
        dispatch(logoutAuthSavedAction());
        history.push("/explore");
      })
      .catch((err) => {
        console.log("signouterr", err);
      });
  };
  return (
    <>
      <StyledNavMobileTop bg="white" py="2.5" px="5">
        <Box maxW="100px">
          <Link to="/explore">
            <Image src={logo} alt="insta梗" w="100%" h="100%" />
          </Link>
        </Box>

        {authUser ? (
          <Flex
            maxW="50%"
            alignItems="center"
            gap={2}
            justifyContent="space-between"
          >
            <Box marginX="2">
              <Link to={`/profile/${authUser?.uid}`}>
                <Button bg="brand.red" p="6">
                  我的收藏
                </Button>
              </Link>
            </Box>

            <Box className="avatar__container">
              <Popover>
                <PopoverTrigger>
                  <Avatar
                    className="avatar"
                    src={authUser?.photoURL || defaultUser}
                    size="md"
                    bg="transparent"
                  ></Avatar>
                </PopoverTrigger>
                <PopoverContent color="brand.dark">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody padding="40px 5px 5px 5px">
                    <Flex alignItems="center">
                      <Box
                        cursor="pointer"
                        w="50%"
                        textAlign="center"
                        borderColor="brand.dark"
                        borderWidth="1px"
                        paddingY="1"
                        borderRadius="full"
                        bg="brand.yellow"
                        color="brand.dark"
                        onClick={() => handleModalUi("settings")}
                        fontWeight="900"
                      >
                        設定個人資料
                      </Box>
                      <Box
                        fontWeight="900"
                        cursor="pointer"
                        variant="outline"
                        bg="white"
                        w="50%"
                        textAlign="center"
                        paddingX="3"
                        paddingY="1"
                        borderColor="brand.dark"
                        borderWidth="1px"
                        borderRadius="full"
                        color="brand.dark"
                        onClick={onSignout}
                      >
                        登出
                      </Box>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Flex>
        ) : (
          <Grid
            templateColumns="repeat(2, minmax(min-content, 108px))"
            alignItems="center"
            gap={2}
            justifyContent="right"
          >
            <Button variant="outline" onClick={() => handleModalUi("login")}>
              登入
            </Button>
            <Button
              bg="brand.yellow"
              color="brand.dark"
              ref={finalRef}
              onClick={() => handleModalUi("signup")}
            >
              註冊
            </Button>
          </Grid>
        )}
      </StyledNavMobileTop>
      <StyledNavMobileBottom bg="white" alignItems="center" py="2.5" px="10">
        <Center>
          <Link to="/explore">
            <IconButton
              width="100%"
              bg="white"
              color="brand.dark"
              as={MdExplore}
            >
              探索
            </IconButton>
          </Link>
        </Center>
        <Center>
          <IconButton
            width="100%"
            bg="white"
            color="brand.dark"
            style={{ transform: "scaleX(-1)" }}
            as={BiSearchAlt}
            onClick={() => handleModalUi("search")}
            cursor="pointer"
          >
            搜尋
          </IconButton>
        </Center>
        <Center>
          <Link to="/create/all">
            <IconButton width="100%" bg="white" color="brand.dark" as={CgAddR}>
              創作
            </IconButton>
          </Link>
        </Center>
      </StyledNavMobileBottom>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        {(function () {
          switch (modal) {
            case "signup":
              return (
                <SignupModal
                  initialRef={initialRef}
                  onClose={onClose}
                ></SignupModal>
              );
            case "search":
              return (
                <SearchModal
                  initialRef={initialRef}
                  onClose={onClose}
                ></SearchModal>
              );
            case "settings":
              return (
                <EditModal
                  initialRef={initialRef}
                  onClose={onClose}
                ></EditModal>
              );
            default:
              return (
                <LoginModal
                  initialRef={initialRef}
                  onClose={onClose}
                ></LoginModal>
              );
          }
        })()}
      </Modal>
    </>
  );
};

export default Nav;
