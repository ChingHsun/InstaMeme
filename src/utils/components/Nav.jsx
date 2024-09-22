import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Avatar,
  Icon,
  Modal,
  ModalOverlay,
  useDisclosure,
  Box,
  Container,
  Grid,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
} from "@chakra-ui/react";
import { BiSearchAlt } from "react-icons/bi";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "../imgs/logoblack.png";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../imgs/catuser.png";
import SearchModal from "./SearchModal";
import NavMobile from "./NavMobile";
import { auth } from "../../firebase/auth";
import { getAuthAction, logoutAuthSavedAction } from "../../redux/actions";
import EditModal from "../../pages/profile/EditModal";

const StyledNav = styled(Grid)`
  position: fixed;
  z-index: 100;
  width: 100vw;
  img {
    display: inline-block;
    width: 100%;
    max-width: 180px;
  }
  .search__icon {
    transform: scaleX(-1);
  }
  .avatar__container {
    width: 100%;
    .avatar {
      align-self: center;
      margin: 0 auto;
      display: block;
      img {
        margin: 0 auto;
      }
    }
  }
`;

const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isTablet = useSelector((state) => state.device.isTablet);
  const location = useLocation();
  const initialRef = useRef();
  const finalRef = useRef();
  const [ui, setUi] = useState("explore");
  const [modal, setModal] = useState("login");
  const dispatch = useDispatch();
  const history = useHistory();
  const authUser = useSelector((state) => state.auth);
  const handleModalUi = (uiState) => {
    setModal(uiState);
    onOpen();
  };
  useEffect(() => {
    if (location.pathname.split("/")[1] === "create") {
      setUi("create");
    } else {
      setUi("explore");
    }
  }, [location]);
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
      {isTablet ? (
        <NavMobile></NavMobile>
      ) : (
        <StyledNav
          bg="white"
          templateColumns="minmax(min-content, 1fr) minmax(min-content,2fr) minmax(min-content, 1fr)"
          alignItems="center"
          py="2.5"
          px="10"
        >
          <Grid
            templateColumns="repeat(3, minmax(min-content, 1fr))"
            alignItems="center"
            gap={2}
          >
            <Link to="/explore">
              <Image src={logo} alt="insta梗" />
            </Link>
            <Link to="/explore">
              <Button
                width="100%"
                variant={ui === "explore" ? "solid" : "outline"}
              >
                探索
              </Button>
            </Link>
            <Link to="/create/all">
              <Button
                width="100%"
                variant={ui === "create" ? "solid" : "outline"}
              >
                創作
              </Button>
            </Link>
          </Grid>
          <Container maxW="100%">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={
                  <Icon
                    as={BiSearchAlt}
                    className="search__icon"
                    color="brand.dark"
                    w={6}
                    h={6}
                  />
                }
              />
              <Input
                borderRadius="full"
                placeholder="搜梗圖或模板"
                onClick={() => handleModalUi("search")}
              />
            </InputGroup>
          </Container>
          {authUser ? (
            <Grid
              templateColumns="repeat(2, minmax(min-content, 108px))"
              alignItems="center"
              gap={2}
              justifyContent="right"
            >
              <Link to={`/profile/${authUser?.uid}`}>
                <Button bg="brand.red">我的收藏</Button>
              </Link>

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
                  <PopoverContent color="brand.dark" maxWidth="250px">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody paddingX="0">
                      <Flex alignItems="center" flexDirection="column">
                        <Box
                          cursor="pointer"
                          w="70%"
                          textAlign="center"
                          borderColor="brand.dark"
                          borderWidth="2px"
                          paddingY="1"
                          borderRadius="full"
                          bg="brand.yellow"
                          color="brand.dark"
                          onClick={() => handleModalUi("settings")}
                          m=" 20px 2px 20px 0"
                          fontWeight="900"
                        >
                          設定個人資料
                        </Box>
                        <Box
                          fontWeight="900"
                          cursor="pointer"
                          variant="outline"
                          bg="white"
                          w="70%"
                          textAlign="center"
                          paddingX="3"
                          paddingY="1"
                          borderColor="brand.dark"
                          borderWidth="2px"
                          borderRadius="full"
                          color="brand.dark"
                          onClick={onSignout}
                          m=" 20px 2px 20px 0"
                        >
                          登出
                        </Box>
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Box>
            </Grid>
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
                //ref={finalRef}
                onClick={() => handleModalUi("signup")}
              >
                註冊
              </Button>
            </Grid>
          )}
        </StyledNav>
      )}
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
