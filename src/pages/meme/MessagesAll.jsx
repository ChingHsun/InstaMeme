import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Icon,
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  addFirestoreData,
  timestamp,
  deleteFirestoreField,
  updateAccCount,
  getMessage,
  getLikedMessage,
} from "../../firebase/firestore";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { IoPaperPlane } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList } from "react-window";

const MessagesAll = ({ onOpen, memeId }) => {
  const authUser = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [likedMessages, setLikedMessages] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const listRef = useRef();
  const isMobile = useSelector((state) => state.device.isMobile);

  useEffect(() => {
    if (authUser) {
      getLikedMessage("users", authUser.uid, "liked_messages", memeId).then(
        (resp) => {
          setLikedMessages(resp);
        }
      );
    }
  }, [memeId, authUser]);
  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const onInputKeydown = (e) => {
    if (e.key === "Enter") {
      if (authUser !== null) {
        onSentMessage();
      }
    }
  };
  const onSentMessage = () => {
    if (authUser === null) {
      onOpen();
    } else {
      if (inputValue !== "") {
        const data = {
          content: inputValue,
          created_time: timestamp.fromDate(new Date()),
          like_count: 0,
          user_id: authUser.uid,
          user_name: authUser.displayName,
        };
        addFirestoreData(data, "memes", memeId, "messages");
        setMessages([{ ...data, message_id: nanoid() }, ...messages]);
        setInputValue("");
      }
    }
  };
  const onLikeMessage = async (messageId) => {
    if (authUser === null) {
      onOpen();
    } else {
      setLikedMessages([...likedMessages, messageId]);

      await addFirestoreData(
        {
          [messageId]: true,
        },
        "users",
        authUser.uid,
        "liked_messages",
        memeId
      );

      await updateAccCount(
        "memes",
        memeId,
        "like_count",
        "+",
        "messages",
        messageId
      );
    }
  };
  const onDislikeMessage = async (messageId) => {
    setLikedMessages(likedMessages.filter((message) => message !== messageId));
    await deleteFirestoreField(
      "users",
      authUser.uid,
      "liked_messages",
      memeId,
      messageId
    );
    await updateAccCount(
      "memes",
      memeId,
      "like_count",
      "-",
      "messages",
      messageId
    );
  };

  const loadNextPage = async (...args) => {
    const { arrayData, lastDoc } = await getMessage(
      memeId,
      5,
      "created_time",
      "desc",
      lastKey
    );
    setLastKey(lastDoc);
    setHasNextPage(arrayData.length !== 0);
    setIsNextPageLoading(false);
    setMessages((preItem) => [...preItem].concat(arrayData));
  };
  const isItemLoaded = (index) => {
    return !hasNextPage || index < messages.length;
  };
  const itemCount = hasNextPage ? messages.length + 1 : messages.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const Item = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <Spinner></Spinner>
        </div>
      );
    } else {
      return (
        <div style={style}>
          {
            <Flex marginY={2} justifyContent="space-between" w="100%">
              <Box width="100%">
                <Link
                  to={`/profile/${messages[index].user_id}`}
                  style={{ display: "inline-block" }}
                >
                  {messages[index].user_name}
                </Link>
                <span>:{messages[index].content}</span>
              </Box>

              <Box>
                {likedMessages?.find(
                  (likedMessage) => likedMessage === messages[index].message_id
                ) ? (
                  <Icon
                    as={TiHeartFullOutline}
                    className="pointer__icon"
                    onClick={() => onDislikeMessage(messages[index].message_id)}
                  />
                ) : (
                  <Icon
                    as={TiHeartOutline}
                    className="pointer__icon"
                    onClick={() => onLikeMessage(messages[index].message_id)}
                  />
                )}
              </Box>
            </Flex>
          }
        </div>
      );
    }
  };
  return (
    <>
      <Box className="list__container">
        <InfiniteLoader
          ref={listRef}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => {
            return (
              <FixedSizeList
                className="List"
                height={isMobile ? 60 : 150}
                itemCount={itemCount}
                itemSize={isMobile ? 25 : 30}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={isMobile ? "70%" : 300}
              >
                {Item}
              </FixedSizeList>
            );
          }}
        </InfiniteLoader>
      </Box>

      <Box marginTop={isMobile ? 2 : 10}>
        <InputGroup w="70%">
          <Input
            borderRadius="full"
            placeholder="留言．．．"
            bg="white"
            color="brand.dark"
            onChange={onInputChange}
            onKeyPress={onInputKeydown}
            value={inputValue}
          />
          <InputRightElement
            children={
              <Icon
                as={IoPaperPlane}
                className="pointer__icon"
                color="brand.blue"
                w={5}
                h={5}
              />
            }
            onClick={onSentMessage}
          />
        </InputGroup>
      </Box>
    </>
  );
};

export default MessagesAll;
