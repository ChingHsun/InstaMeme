import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Icon,
  Modal,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { deleteSaved, updateAccCount } from "../../firebase/firestore";
import { getOneSavedAction, getOneSavedCountAction } from "../../redux/actions";
import SaveModal from "./SaveModal";
import LoginModal from "./LoginModal";
import styled, { keyframes } from "styled-components";
import { bounceIn, pulse } from "react-animations";
import { useEffect } from "react";
const StyledSaveButton = styled(Button)`
  animation: 2s ${keyframes`${bounceIn}`};
  &:hover {
    animation: 2s ${keyframes`${pulse}`};
  }
`;
const SaveButton = ({ meme }) => {
  const authSavedMemes = useSelector((state) => state.authSave[0]?.["memes"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const authUser = useSelector((state) => state.auth);

  const onSave = () => {
    onOpen();
  };

  const onSaveDelete = async (meme) => {
    await deleteSaved("users", authUser.uid, "saved_category", meme.meme_id);
    dispatch(getOneSavedAction(meme.meme_id, "delete"));
    toast({
      title: `取消收藏${meme.title}`,
      status: "error",
      isClosable: true,
      position: "top",
      duration: 3000,
    });
    await updateAccCount("memes", meme.meme_id, "saved_count", "-");
    dispatch(getOneSavedCountAction(meme.saved_count, meme.meme_id, "delete"));
  };
  return (
    <>
      {authSavedMemes?.find((savedId) => savedId === meme.meme_id) ? (
        <StyledSaveButton
          variant="outline"
          color="brand.blue"
          borderColor="brand.blue"
          bg="white"
          leftIcon={<Icon as={TiHeartFullOutline} />}
          h="40px"
          fontSize="15px"
          onClick={() => onSaveDelete(meme)}
        >
          已收藏
        </StyledSaveButton>
      ) : (
        <StyledSaveButton
          className="heart__button"
          leftIcon={<Icon as={TiHeartOutline} />}
          bg="brand.red"
          size="lg"
          fontSize="15px"
          h="40px"
          onClick={() => onSave(meme)}
        >
          收藏
        </StyledSaveButton>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {authUser ? (
          <SaveModal
            onClose={onClose}
            memeId={meme.meme_id}
            memeImage={meme.image}
            memeTitle={meme.title}
            saveCount={meme.saved_count}
          ></SaveModal>
        ) : (
          <LoginModal onClose={onClose}></LoginModal>
        )}
      </Modal>
    </>
  );
};

export default SaveButton;
