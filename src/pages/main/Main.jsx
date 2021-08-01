import {
  Box,
  Center,
  Container,
  Divider,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import MainMobile from "./MainMobile";
import { useParams } from "react-router";
import { memesTheme } from "../../utils/memesThemes";
import styled from "styled-components";
import useSelect from "../../utils/hooks/useSelect";
import MainDesktop from "./MainDesktop";
const StyledMain = styled(Box)`
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
  .select__outside {
    position: relative;
    height: 10vh;
  }
  .select__container {
    position: ${(props) => (props.display ? "fixed" : "absolute")};

    top: ${(props) => (props.display ? "10%" : "0")};
    transition: all 0.5s ease-in-out;
    left: calc(50% - 135px);
    z-index: 70;
    transform: translate3d(0, 0, 0);
    .theme__select {
      border-radius: 20px 0 0 20px;
      margin-left: 2px;
      background-color: white;
      color: #023047;
      font-weight: 900;
      border: none;
      max-width: 130px;
    }
    .chakra-select__wrapper {
      display: inline-block;
    }
    .order__select {
      border-radius: 0 20px 20px 0;
      background-color: white;
      color: #023047;
      font-weight: 900;
      border: none;
      max-width: 130px;
      margin-left: 10px;
    }
  }
`;
const Main = () => {
  const { theme } = useParams();
  const isMobile = useSelector((state) => state.device.isMobile);

  const {
    onThemeChange,
    onSelectOrder,
    selectOrder,
    selectionUi,
    ui,
    topRef,
    bottomRef,
  } = useSelect({ theme });
  return (
    <StyledMain
      maxWidth="100vw"
      width="100vw"
      pt={["35px !important", "60px"]}
      pb="5"
      display={selectionUi}
    >
      <Container bg="brand.blue" py="12" maxWidth="100vw">
        <Container minH="15vh">
          <h2>收藏你愛的梗圖吧！</h2>
          <Divider></Divider>

          <Center marginTop="30px" className="select__outside">
            <Box className="select__container">
              <Select
                color="brand.dark"
                bg="white"
                value={theme}
                onChange={onThemeChange}
                w="130px"
                cursor="pointer"
                className="theme__select"
                h="40px"
                fontSize="15px"
                letterSpacing="0.2em"
              >
                <option disabled>選擇主題</option>

                <option value="所有">所有</option>
                {memesTheme.map((theme, index) => {
                  return (
                    <option key={index} value={theme}>
                      {theme}
                    </option>
                  );
                })}
              </Select>
              <Select
                fontSize="15px"
                letterSpacing="0.2em"
                h="40px"
                color="brand.dark"
                bg="white"
                value={selectOrder}
                onChange={onSelectOrder}
                w="130px"
                cursor="pointer"
                className="order__select"
              >
                <option disabled>選擇排序</option>
                {["created_time", "saved_count", "visited_count"].map(
                  (order, index) => {
                    return (
                      <option key={order} value={order}>
                        {(function () {
                          switch (order) {
                            case "saved_count":
                              return "最多收藏";
                            case "visited_count":
                              return "最多瀏覽";
                            default:
                              return "最新";
                          }
                        })()}
                      </option>
                    );
                  }
                )}
              </Select>
            </Box>
          </Center>
        </Container>
      </Container>
      <Divider ref={topRef}></Divider>

      <Box
        margin="0 auto"
        width="80vw"
        maxWidth={isMobile ? "400px" : "1200px"}
        py="10"
      >
        {!isMobile ? (
          <MainDesktop ui={ui}></MainDesktop>
        ) : (
          <MainMobile ui={ui}></MainMobile>
        )}
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
      </Box>
    </StyledMain>
  );
};

export default Main;
