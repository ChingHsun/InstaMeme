import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { TiHeartFullOutline, TiEye } from "react-icons/ti";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { getMeme } from "../../firebase/firestore";
import { getMemeAction } from "../../redux/actions";

const StyledBg = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  transition: transform 1s;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => `url(${props.image})`};
    background-repeat: no-repeat;
    background-position: center;
  }
  &:before {
    background-size: cover;
    filter: blur(10px);
    -webkit-filter: blur(10px);
    transform: scale(1.1);
  }
  &:after {
    background-size: contain;
  }
`;
const StyledMemeContainer = styled.div`
  height: 100%;
  .meme__box {
    position: relative;
    .meme__info {
      display: none;
      .icon {
        display: inline-block;
      }
      p {
        display: inline-block;
      }
    }
    &:hover .meme__info {
      display: flex;
      position: absolute;
      top: 0px;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
    }
    &:hover ${StyledBg} {
      transform: scale(1.2);
    }
  }
`;

const MemeBox = ({ memeId, isInfo, template }) => {
  let location = useLocation();
  const meme = useSelector((state) => state.memes[memeId]);
  return (
    <>
      {meme && (
        <StyledMemeContainer>
          <Link
            to={{
              pathname: `/meme/${meme.meme_id}`,
              state: { background: location },
            }}
            style={{ height: "100%" }}
          >
            <Box
              className="meme__box"
              borderWidth="1px"
              borderRadius="lg"
              background="gray"
              max-width="100%"
              overflow="hidden"
              height="100%"
            >
              <StyledBg image={meme.image}></StyledBg>

              {isInfo && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  className="meme__info"
                >
                  <Flex alignItems="center" marginRight={3}>
                    <Icon
                      as={TiHeartFullOutline}
                      w={6}
                      h={6}
                      className="icon"
                    ></Icon>
                    <Text fontSize="xl" color="white" marginX={2}>
                      {meme.saved_count}
                    </Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Icon w={6} h={6} as={TiEye}></Icon>
                    <Text fontSize="xl" color="white" marginX={2}>
                      {meme.visited_count}
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Box>
          </Link>
        </StyledMemeContainer>
      )}
      {template && (
        <StyledMemeContainer>
          <Link
            to={`/create/${template.template_id}`}
            style={{ height: "100%" }}
          >
            <Box
              className="meme__box"
              borderWidth="1px"
              borderRadius="lg"
              background="gray"
              max-width="100%"
              overflow="hidden"
              height="100%"
            >
              <StyledBg image={template.image}></StyledBg>
            </Box>
          </Link>
        </StyledMemeContainer>
      )}
    </>
  );
};

export default MemeBox;
