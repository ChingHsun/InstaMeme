import {
  useDisclosure,
  ChakraProvider,
  Modal,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Create from "./pages/create/Create";
import CreateAll from "./pages/createAll/CreateAll";
import Main from "./pages/main/Main";
import Meme from "./pages/meme/Meme";
import Profile from "./pages/profile/Profile";
import Nav from "./utils/components/Nav";
import { extendTheme } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getDeviceAction,
  getAuthSavedAction,
  getAuthAction,
  getAuthCreateAction,
} from "./redux/actions";
import { auth } from "./firebase/auth";
import CreateTemplate from "./pages/create/CreateTemplate";

const Button = {
  baseStyle: {
    borderRadius: "full",
  },
  sizes: {
    sm: {
      fontSize: "sm",
      px: 3.5,
      py: 1,
      letterSpacing: "0.2em",
      textIndent: "0.2em",
    },
    md: {
      fontSize: "md",
      px: 4,
      py: 3.5,
      letterSpacing: "0.2em",
      textIndent: "0.2em",
    },
    lg: {
      fontSize: "lg",
      px: 10,
      py: 3,
      letterSpacing: "0.2em",
      textIndent: "0.2em",
    },
  },
  variants: {
    solid: {
      bg: "brand.dark",
      color: "white",
    },
    outline: {
      border: "2px solid",
      borderColor: "brand.dark",
      color: "brand.dark",
      _hover: {},
    },
    solid_red: {
      bg: "brand.red",
      color: "white",
    },
    outline_red: {
      border: "2px solid",
      borderColor: "brand.red",
      color: "brand.red",
    },
  },
  defaultProps: {
    size: "md",
    variant: "solid",
  },
};

const theme = extendTheme({
  colors: {
    brand: {
      dark: "#023047",
      blue: "#00A3C4",
      green: "#06D6A0",
      red: "#EF476F",
      yellow: "#FFD166",
    },
  },
  components: {
    Button,
  },
  styles: {
    global: {
      "html, body": {
        color: "white",
        letterSpacing: "0.2em",
        fontSize: ["10px", "12px", "16px"],
        backgroundColor: "brand.dark",
        boxSizing: "border-box",
        maxWidth: "100vw",
        overflowX: "hidden",
      },
      section: {
        opacity: "100 !important",
        visibility: "inherit !important",
      },
    },
  },
});

const App = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 996px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 996px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 650px)" });
  const dispatch = useDispatch();
  let location = useLocation();
  let history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  let background = location.state && location.state.background;
  useEffect(() => {
    dispatch(
      getDeviceAction({
        isDesktop: isDesktop,
        isTablet: isTablet,
        isMobile: isMobile,
      })
    );
  }, [isDesktop, isTablet, isMobile]);

  useEffect(() => {
    history.replace();
    console.log("locat", location);
  }, []);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(getAuthAction(user));
        dispatch(getAuthSavedAction(auth.currentUser.uid));
        dispatch(getAuthCreateAction(auth.currentUser.uid));
      }
    });
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Nav></Nav>
      {/* {isTablet ? <NavMobile></NavMobile> : <Nav></Nav>} */}

      <Switch location={background || location}>
        <Route path="/explore/:theme">
          <Main></Main>
        </Route>
        <Route path="/meme/:memeId">
          <Meme></Meme>
        </Route>
        <Route path="/create/all" exact>
          <CreateAll></CreateAll>
        </Route>
        <Route path="/create/template" exact>
          <CreateTemplate></CreateTemplate>
        </Route>

        <Route path="/create/:templateId">
          <Create></Create>
        </Route>
        <Route path="/profile/:userId/:tab">
          <Profile></Profile>
        </Route>
        <Redirect from="/profile/:userId" to="/profile/:userId/mySaved">
          <Profile></Profile>
        </Redirect>

        <Redirect from="/" to="/explore/所有"></Redirect>
      </Switch>
      {background && (
        <Route
          path="/meme/:memeId"
          children={
            <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={true}>
              <ModalOverlay onClose={onClose} />
              <Meme isModal={true}></Meme>
            </Modal>
          }
        />
      )}
    </ChakraProvider>
  );
};

export default App;
