import { Box, Flex } from "@chakra-ui/react";
import MemeInfo from "../../utils/components/MemeInfo";
import { useSelector } from "react-redux";
import { useState } from "react";
import { IconButton, Center, Spinner } from "@chakra-ui/react";
import styled from "styled-components";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import SaveButton from "../../utils/components/SaveButton";

const StyledBg = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: white;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => `url(${props.image})`};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    filter: blur(10px);
    transform: scale(1.1);
  }
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => `url(${props.image})`};
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .icon__container {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 100;
  }
`;

const StyledBox = styled(Box)`
  background-color: transparent;
  width: 100%;
  height: 450px;
  perspective: 1000px;
  margin-bottom: 30px;

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transform: ${(props) => (props.$isflip ? "rotateY(-180deg)" : "none")};
  }

  .flip-card-front,
  .flip-card-back {
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .flip-card-front {
    background-color: #00a3c4;
    color: black;
    transform: rotateY(0deg);
  }

  .flip-card-back {
    color: white;
    transform: rotateY(180deg);
  }
  .rotate {
    transition: transform 0.6s;

    &:hover {
      background-color: #023047;
      transform: rotate(180deg);
    }
  }
  .meme__info {
    position: relative;
  }
  .toggle__container {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 999;
    cursor: pointer;
  }
`;

const MainMobile = ({ ui }) => {
  const memesOrder = useSelector((state) => state.memesOrder.memes);
  const memes = useSelector((state) => state.memes);

  const [cardUi, setCardUi] = useState({ memeId: null });

  const onShowToggle = (e, memeId) => {
    memeId === cardUi.memeId
      ? setCardUi({ ...cardUi, memeId: null })
      : setCardUi({ ...cardUi, memeId: memeId });
  };

  return (
    <>
      {ui.main === "success" ? (
        memesOrder
          .map((memeId) => memes[memeId])
          .map((meme) => {
            return (
              <StyledBox
                key={meme.meme_id}
                marginY={8}
                $isflip={cardUi.memeId === meme.meme_id}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <StyledBg image={meme.image}>
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        className="icon__container"
                        marginBottom="10px"
                      >
                        <Box marginRight="10px">
                          <SaveButton meme={meme}></SaveButton>
                        </Box>
                        <Box marginRight="10px">
                          <IconButton
                            onClick={(e) => {
                              onShowToggle(e, meme.meme_id);
                            }}
                            className="rotate"
                            w="40px"
                            h="40px"
                            borderRadius="full"
                            icon={<AddIcon />}
                          ></IconButton>
                        </Box>
                      </Flex>
                    </StyledBg>
                  </div>
                  <Box bg="brand.blue" className="flip-card-back">
                    <Box p={8} h="100%" className="inner-back-container">
                      <Box h="100%" w="100%" className="meme__info">
                        {meme.meme_id === cardUi.memeId && (
                          <MemeInfo memeId={meme.meme_id}></MemeInfo>
                        )}
                        <Box className="toggle__container" marginRight="10px">
                          <IconButton
                            onClick={(e) => {
                              onShowToggle(e, meme.meme_id);
                            }}
                            className="rotate"
                            w="40px"
                            h="40px"
                            borderRadius="full"
                            icon={<CloseIcon />}
                          ></IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </StyledBox>
            );
          })
      ) : (
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
    </>
  );
};

export default MainMobile;
