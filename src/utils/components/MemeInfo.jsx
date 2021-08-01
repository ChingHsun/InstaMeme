import { Link } from "react-router-dom";
import styled from "styled-components";
import defaultUser from "../imgs/catuser.png";
import { Tag, Flex, useDisclosure, Box, Avatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import MessagesAll from "../../pages/meme/MessagesAll";
import SaveButton from "./SaveButton";

const StyledInfo = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  //position: relative;
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  .user__container {
    margin: 10px 0;
    display: flex;
    align-items: center;
    .avatar {
      height: 1.2rem;
      width: 1.2rem;
    }
    p {
      font-size: 1rem;
      line-height: 16px;
    }
  }
  .theme__container {
    margin: 10px 0;

    display: flex;
    align-items: center;
  }
  .message__container {
    letter-spacing: 0.1em;
    a {
      font-weight: 900;
      display: inline-block;
    }
  }
  .all__container {
    letter-spacing: 0.2em;
    a {
      font-weight: 900;
    }
  }
  .pointer__icon {
    cursor: pointer;
  }

  .toggle__container {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 100;
  }
`;

const MemeInfo = ({ memeId }) => {
  const meme = useSelector((state) => state.memes[memeId]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <StyledInfo color="white">
      {meme && (
        <>
          <Box>
            <h3>{meme.title}</h3>
            <Link to={`/profile/${meme.user_id}`} className="user__container">
              <Avatar
                className="avatar"
                bg="white"
                src={meme.user_image || defaultUser}
              />
              <p>{meme.user_name}</p>
            </Link>
            <Box className="theme__container">
              <p>主題：</p>
              {meme.themes?.map((theme, index) => {
                return (
                  <Link to={`/explore/${theme}`} key={index}>
                    <Tag> {theme}</Tag>
                  </Link>
                );
              })}
            </Box>
            <Box className="theme__container">
              <p>模板：</p>
              <Link to={`/create/${meme.template_id}`}>
                <Tag> {meme.template_name}</Tag>
              </Link>
            </Box>
          </Box>

          <Box>
            <SaveButton meme={meme}></SaveButton>
          </Box>
          <Box marginY={3} color="brand.yellow" letterSpacing="0.2em">
            <p>{meme.visited_count}個瀏覽</p>
            <p>{meme.saved_count}個收藏</p>
          </Box>

          <MessagesAll memeId={memeId} onOpen={onOpen}></MessagesAll>
        </>
      )}
    </StyledInfo>
  );
};

export default MemeInfo;
