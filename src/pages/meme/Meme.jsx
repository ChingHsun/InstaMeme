import {
  Box,
  Center,
  Container,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";

import MemeImg from "../../utils/components/MemeImg";
import MemeInfo from "../../utils/components/MemeInfo";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getMeme, updateAccCount } from "../../firebase/firestore";
import { useParams } from "react-router";
import { getMemeAction, getOneVisitedCountAction } from "../../redux/actions";
import { useHistory } from "react-router-dom";

const Meme = ({ isModal = false }) => {
  const { memeId } = useParams();
  const meme = useSelector((state) => state.memes[memeId]);
  const history = useHistory();
  const [ui, setUi] = useState("loading");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!meme) {
      getMeme(memeId)
        .then((response) => {
          dispatch(getMemeAction(response));
          setUi("success");
        })
        .catch((err) => {
          setUi("error");
        });
    }
  }, [memeId, meme]);
  useEffect(() => {
    if (meme) {
      updateAccCount("memes", memeId, "visited_count", "+");
      dispatch(getOneVisitedCountAction(meme.visited_count, memeId));
    }
  }, []);
  return (
    <>
      {isModal ? (
        <ModalContent width="1200px" maxWidth="1200px" bg="brand.dark">
          <ModalHeader color="brand.dark"></ModalHeader>
          <ModalCloseButton
            onClick={() => {
              history.goBack();
            }}
          />
          <ModalBody pb={6} color="brand.dark">
            <Flex marginBottom="10" color="white" justifyContent="space-evenly">
              {ui !== "error" ? (
                <>
                  <MemeInfo memeId={memeId}></MemeInfo>
                  <MemeImg memeId={memeId}></MemeImg>
                </>
              ) : (
                <Box>此梗圖已不存在</Box>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter borderTop="1px solid gray"></ModalFooter>
        </ModalContent>
      ) : (
        <Box maxWidth="100vw" pt="100px" pb="5" width="100vw">
          <Container py="4" maxW="1200px">
            <Flex marginBottom="10" color="white" justifyContent="space-evenly">
              {ui === "loading" ? (
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
              ) : ui === "success" ? (
                <>
                  <MemeInfo memeId={memeId}></MemeInfo>
                  <MemeImg memeId={memeId}></MemeImg>
                </>
              ) : (
                <Box>此梗圖已不存在</Box>
              )}
            </Flex>
          </Container>
        </Box>
      )}
    </>
  );
};

export default Meme;
