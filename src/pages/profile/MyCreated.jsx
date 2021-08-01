import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Button,
  IconButton,
  Select,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  deleteSaved,
  deleteSavedByCategory,
  getMeme,
  deleteMeme,
} from "../../firebase/firestore";
import {
  deleteOneCreateByCategoryAction,
  getMemeAction,
  getOneCreateAction,
} from "../../redux/actions";
import { DeleteIcon } from "@chakra-ui/icons";
import { useQuery } from "../../utils/hooks/useQuery";
import styled from "styled-components";
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
const MyCreated = ({ userId, data }) => {
  const isMobile = useSelector((state) => state.device.isMobile);
  const authCreate = useSelector((state) => state.authCreate);
  const memes = useSelector((state) => state.memes);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const [createdMemes, setCreatedMemes] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectTheme, setSelectTheme] = useState("所有");
  let location = useLocation();
  const isTablet = useSelector((state) => state.device.isTablet);
  const history = useHistory();
  useEffect(() => {
    setThemes(authCreate.map((createInfo) => createInfo.docId));
  }, [userId, authCreate]);
  useEffect(() => {
    if (authCreate.length !== 0) {
      const memesId = authCreate.filter(
        (saveInfo) => saveInfo.docId === selectTheme
      )[0].memes;
      Promise.all(
        memesId.map(async (memeId) => {
          if (memes[memeId]) {
            return memes[memeId];
          } else {
            const response = await getMeme(memeId);
            dispatch(getMemeAction(response));
            return response[memeId];
          }
        })
      ).then((selectedSave) => {
        setCreatedMemes(selectedSave);
      });
    }
  }, [selectTheme, authCreate]);

  const onThemeChange = (e) => {
    const newtheme = e.target.value;
    setSelectTheme(newtheme);
  };

  const onDelete = async (e, memeId, imageId) => {
    if (e.target.tagName !== "DIV") {
      if (selectTheme === "所有") {
        await deleteSaved("users", authUser.uid, "created_theme", memeId);
        await deleteMeme(memeId, selectTheme, imageId);
        dispatch(getOneCreateAction(memeId, "delete"));
      } else {
        await deleteSavedByCategory(
          "users",
          authUser.uid,
          "created_theme",
          selectTheme,
          memeId
        );
        await deleteMeme(memeId, selectTheme);
        dispatch(deleteOneCreateByCategoryAction(memeId, selectTheme));
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
          主題分類：
        </Box>

        <Select
          color="brand.dark"
          bg="white"
          value={selectTheme}
          onChange={onThemeChange}
          width="150px"
          cursor="pointer"
        >
          <option disabled>選擇主題</option>
          {themes.length !== 0 ? (
            themes.map((category, index) => {
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
          if (createdMemes) {
            if (createdMemes.length !== 0) {
              return (
                <>
                  {createdMemes.map((meme) => (
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
                          onDelete(e, meme.meme_id, meme.image_id)
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
                                  selectTheme === "所有"
                                    ? "在所有主題裡刪除此梗圖"
                                    : "只在此主題中移除梗圖"
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
              let type = "創作";
              let link = "create/all";
              let buttonText = "創作";

              if (authUser == null || authUser?.uid !== userId) {
                return (
                  <GridItem colSpan={4}>這位使用者還沒有{type}喔</GridItem>
                );
              } else {
                return (
                  <GridItem colSpan={4}>
                    你還沒有任何{type}喔
                    <Link to={`/${link}`}>
                      <Button margin="10px 0" color="brand.blue" bg="white">
                        {buttonText}去！
                      </Button>
                    </Link>
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

export default MyCreated;
