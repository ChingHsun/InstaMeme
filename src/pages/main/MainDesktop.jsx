import { Center, Grid, GridItem, Text, Spinner, Box } from "@chakra-ui/react";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { useSelector } from "react-redux";
import MemeBox from "../../utils/components/MemeBox";

const MainDesktop = ({ ui }) => {
  const isTablet = useSelector((state) => state.device.isTablet);
  const memesOrder = useSelector((state) => state.memesOrder.memes);

  return (
    <Grid
      my={10}
      color="white"
      templateColumns={isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)"}
      columnGap="30px"
      rowGap="30px"
    >
      {(function () {
        if (ui?.main === "loading") {
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
        } else if (ui?.main === "success") {
          return memesOrder.map((meme, index) => {
            return (
              <Box key={meme} height={isTablet ? "25vw" : "20vw"} maxH="275px">
                <MemeBox memeId={meme} isInfo="true" />
              </Box>
            );
          });
        } else {
          return (
            <GridItem colSpan="full">
              <Text>Oops! 有東西出錯囉！</Text>
            </GridItem>
          );
        }
      })()}
    </Grid>
  );
};

export default MainDesktop;
