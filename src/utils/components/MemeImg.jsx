import { Box } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Image, Skeleton } from "@chakra-ui/react";

const StyledMemeImg = styled(Box)`
  /* background-color: rgba(255, 255, 255, 0.5); */
  overflow-y: scroll;

  img {
    margin: 0 auto;
  }
`;
const MemeImg = ({ memeId }) => {
  const meme = useSelector((state) => state.memes[memeId]);

  return (
    <StyledMemeImg w="100%" maxW="450px">
      {meme && (
        <Image
          src={meme.image}
          alt={memeId}
          w="100%"
          fallback={<Skeleton height="350px" width="350px"></Skeleton>}
        />
      )}
    </StyledMemeImg>
  );
};

export default MemeImg;
