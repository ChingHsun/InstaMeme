import {
  Button,
  Box,
  Center,
  Container,
  Divider,
  Grid,
  Text,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getTemplates } from "../../firebase/firestore";
import { getTemplateAction } from "../../redux/actions";
import MemeBox from "../../utils/components/MemeBox";
import { pulse } from "react-animations";
import _ from "lodash";

const StyledCreateAll = styled(Box)`
  letter-spacing: 0.2em;
  a {
    display: block;
  }
  h2 {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
  }
`;

const StyledButton = styled(Button)`
  animation: 1s ${keyframes`${pulse}`};

  &:hover {
    background-color: #ffd166 !important;
    animation: 1s ${keyframes`${pulse}`} infinite;
  }
`;

const CreateAll = () => {
  const isTablet = useSelector((state) => state.device.isTablet);
  const isMobile = useSelector((state) => state.device.isMobile);
  const templates = useSelector((state) => state.templates);
  // const [templates, setTemplates] = useState(null);
  const lastRef = useRef(null);
  const [ui, setUi] = useState({ main: "loading", lazyload: "loading" });
  const history = useHistory();
  const dispatch = useDispatch();
  const bottomRef = useRef();

  useEffect(() => {
    if (_.isEmpty(templates)) {
      getTemplates("created_time", "desc", 12).then(
        ({ arrayData, objectData, lastDoc }) => {
          lastRef.current = lastDoc;
          dispatch(getTemplateAction(objectData));
          // setTemplates(Object.values(objectData));
          setUi({ ...ui, main: "success" });
        }
      );
    } else {
      setUi({ ...ui, main: "success" });
    }
  }, []);
  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (lastRef.current && bottomRef.current) {
            getTemplates("created_time", "desc", 12, lastRef.current)
              .then(({ arrayData, lastDoc, objectData }) => {
                if (arrayData.length === 0) {
                  observer.unobserve(entry.target);
                  setUi({ ...ui, lazyload: "success" });
                } else {
                  dispatch(getTemplateAction(objectData));
                  lastRef.current = lastDoc;
                  //setTemplates((pre) => [...pre].concat(arrayData));
                }
              })
              .catch((err) => {
                console.log("e", err);
              });
          }
        }
      });
    };
    const options = {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    };
    let observer = null;
    if (ui.main === "success") {
      observer = new IntersectionObserver(callback, options);
    }
    const prey = bottomRef?.current;
    if (prey && templates?.length !== 0 && ui.main === "success") {
      observer.observe(prey);
    }
    return () => {
      prey && observer?.unobserve(prey);
    };
  }, [ui.main]);

  return (
    <StyledCreateAll
      maxWidth="100vw"
      pt={["35px !important", "60px"]}
      pb="5"
      width="100vw"
    >
      <Container bg="brand.blue" py="12" maxWidth="100vw">
        <Container>
          <h2>創作屬於你自己的梗圖吧！</h2>
          <Divider></Divider>
          <Center marginTop="30px">
            <Link to="./template">
              <Text>找不到想要的梗圖嗎？</Text>

              <Text fontWeight="900">點我可以創作模板喔！</Text>
            </Link>
          </Center>
        </Container>
      </Container>
      <Container p="10" maxW="1200px" marginY="10">
        <Grid
          marginX={3}
          color="white"
          templateColumns={
            isMobile
              ? "repeat(2, 1fr)"
              : isTablet
              ? "repeat(3, 1fr)"
              : "repeat(4, 1fr)"
          }
          columnGap={isMobile ? "3vw" : isTablet ? "20px" : "30px"}
          rowGap={isMobile ? "3vw" : isTablet ? "20px" : "30px"}
        >
          {ui.main === "loading" ? (
            <Center gridColumn="span 4">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="brand.blue"
                size="xl"
                marginTop={5}
              />
            </Center>
          ) : ui.main === "success" ? (
            Object.values(templates).map((template) => {
              return (
                <Box key={template.template_id}>
                  <Box height={isMobile ? "40vw" : isTablet ? "25vw" : "20vw"}>
                    <MemeBox template={template}></MemeBox>
                  </Box>
                  <Center my={3}>
                    <StyledButton
                      variant="outline"
                      bg="brand.yellow"
                      w="70%"
                      onClick={() => {
                        history.push(`${template.template_id}`);
                      }}
                    >
                      創作
                    </StyledButton>
                  </Center>
                </Box>
              );
            })
          ) : (
            <GridItem rowSpan={4}>
              <Text>Oops! 有東西出錯囉！</Text>
            </GridItem>
          )}
        </Grid>
        {ui?.main === "success" && ui?.lazyload === "loading" && (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="brand.blue"
              size="xl"
              marginTop={5}
            />
          </Center>
        )}
        <Divider ref={bottomRef} style={{ visibility: "hidden" }}></Divider>
      </Container>
    </StyledCreateAll>
  );
};

export default CreateAll;
