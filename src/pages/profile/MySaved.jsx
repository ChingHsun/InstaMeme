import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Tooltip,
  Spinner,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Select } from "@chakra-ui/select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  deleteNotExsit,
  deleteSaved,
  deleteSavedByCategory,
  getMeme,
  onDeleteCategory,
  updateAccCount,
} from "../../firebase/firestore";
import {
  deleteOneSavedByCategoryAction,
  getMemeAction,
  getOneSavedAction,
  getOneSavedCountAction,
} from "../../redux/actions";
import styled from "styled-components";
import { AiOutlineConsoleSql } from "react-icons/ai";

const StyledGrid = styled(Grid)`
  .meme__container {
    position: relative;
  }
  .delete__button {
    position: absolute;
    right: 0;
    top: 0;
  }
`;
const StyledBg = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => `url(${props.image})`};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    -webkit-filter: blur(10px);

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
`;
const MySaved = () => {
  const isMobile = useSelector((state) => state.device.isMobile);
  const isTablet = useSelector((state) => state.device.isTablet);
  const history = useHistory();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const authSave = useSelector((state) => state.authSave);
  const memes = useSelector((state) => state.memes);
  const [savedMemes, setSavedMemes] = useState([]);
  const [savedCategory, setSavedCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("所有");
  const [ui, setUi] = useState("loading");

  let location = useLocation();

  useEffect(() => {
    setSavedCategory(authSave.map((saveInfo) => saveInfo.docId));
  }, [userId, authSave]);

  useEffect(() => {
    if (authSave.length !== 0) {
      const memesId = authSave.filter(
        (saveInfo) => saveInfo.docId === selectCategory
      )[0].memes;
      Promise.all(
        memesId.map(async (memeId) => {
          if (memes[memeId]) {
            return memes[memeId];
          } else {
            const response = await getMeme(memeId);
            if (response) {
              dispatch(getMemeAction(response));
              return response[memeId];
            } else {
              deleteNotExsit(authUser.uid, selectCategory, memeId);
            }
          }
        })
      )
        .then((selectedSave) => {
          setSavedMemes(selectedSave.filter((meme) => meme));
          setUi("success");
        })
        .catch((err) => {
          console.log("e", err);
        });
    } else {
      setUi("success");
    }
  }, [selectCategory, authSave]);

  const onCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectCategory(newCategory);
  };

  const onDelete = async (e, memeId, savedCount) => {
    if (e.target.tagName !== "DIV") {
      if (selectCategory === "所有") {
        await deleteSaved("users", authUser.uid, "saved_category", memeId);
        dispatch(getOneSavedAction(memeId, "delete"));
        await updateAccCount("memes", memeId, "saved_count", "-");
        dispatch(getOneSavedCountAction(savedCount, memeId, "delete"));
      } else {
        await deleteSavedByCategory(
          "users",
          authUser.uid,
          "saved_category",
          selectCategory,
          memeId
        );
        dispatch(deleteOneSavedByCategoryAction(memeId, selectCategory));
      }
    } else {
      history.push({
        pathname: `/meme/${memeId}`,
        state: { background: location },
      });
    }
  };

  return (
    <>
      <Flex marginBottom={6}>
        <Box fontWeight="900" fontSize="lg" marginRight={4}>
          我的收藏分類：
        </Box>

        <Select
          color="brand.dark"
          bg="white"
          value={selectCategory}
          onChange={onCategoryChange}
          width="150px"
          cursor="pointer"
        >
          <option disabled>選擇收藏分類</option>
          {savedCategory.length !== 0 ? (
            savedCategory.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category}
                </option>
              );
            })
          ) : (
            <option value="所有">所有</option>
          )}
        </Select>
      </Flex>
      <StyledGrid
        marginBottom="10"
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
        {(function () {
          if (ui !== "loading") {
            if (savedMemes.length !== 0) {
              return (
                <>
                  {savedMemes.map((meme) => (
                    <Box key={meme.meme_id}>
                      <Box
                        className="meme__container"
                        borderRadius="lg"
                        border="1px solid white"
                        background="gray"
                        width="100%"
                        overflow="hidden"
                        display="flex"
                        height={isMobile ? "40vw" : isTablet ? "25vw" : "20vw"}
                        onClick={(e) =>
                          onDelete(e, meme.meme_id, meme.saved_count)
                        }
                      >
                        <StyledBg image={meme.image}></StyledBg>

                        {authUser?.uid === userId && (
                          <IconButton
                            variant="outline"
                            borderColor="brand.red"
                            bg="white"
                            aria-label="delete text"
                            borderRadius="100%"
                            className="delete__button"
                            icon={
                              <Tooltip
                                label={
                                  selectCategory === "所有"
                                    ? "刪除此梗圖的所有收藏"
                                    : "只在此收藏分類中移除收藏"
                                }
                                fontSize="md"
                              >
                                <DeleteIcon
                                  className="delete__icon"
                                  color="brand.red"
                                />
                              </Tooltip>
                            }
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </>
              );
            } else {
              let type = "收藏";
              let link = "explore";
              let buttonText = "逛逛";
              if (authUser == null || authUser?.uid !== userId) {
                return (
                  <GridItem colSpan={4}>這位使用者還沒有{type}喔</GridItem>
                );
              } else {
                return (
                  <GridItem colSpan={4}>
                    此分類:{selectCategory} 還沒有任何{type}喔
                    <Link to={`/${link}`}>
                      <Button margin="10px 0" color="brand.blue" bg="white">
                        {buttonText}去！
                      </Button>
                    </Link>
                    {selectCategory !== "所有" && (
                      <IconButton
                        variant="outline"
                        borderColor="brand.red"
                        bg="white"
                        aria-label="delete text"
                        borderRadius="100%"
                        marginLeft={5}
                        onClick={() => {
                          onDeleteCategory(authUser?.uid, selectCategory);
                        }}
                        icon={
                          <Tooltip
                            label={`刪除${selectCategory}`}
                            fontSize="md"
                          >
                            <DeleteIcon color="brand.red" />
                          </Tooltip>
                        }
                      />
                    )}
                  </GridItem>
                );
              }
            }
          } else {
            return (
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
            );
          }
        })()}
      </StyledGrid>
    </>
  );
};

export default MySaved;
