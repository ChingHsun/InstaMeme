import React, { useEffect, useRef, useState } from "react";
import {
  Icon,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import { BiSearchAlt } from "react-icons/bi";
import { queryString, queryTemplate } from "../../firebase/firestore";
import MemeBox from "./MemeBox";
import { useDispatch } from "react-redux";
import { getMemeAction } from "../../redux/actions";

const SearchModal = () => {
  const [searchUi, setSearchUi] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [memeResult, setMemeResult] = useState([]);
  const [templateResult, setTemplateResult] = useState([]);
  const dispatch = useDispatch();

  const rightRef = useRef();
  const rightTemplateRef = useRef();

  const lastRef = useRef(null);

  const optionRef = useRef();
  const optionTemplateRef = useRef();
  const lastTemplateRef = useRef(null);

  const onSearchInputValue = (e) => {
    setSearchInputValue(e.target.value);
  };
  const onSearch = async (e) => {
    if (e.key === "Enter") {
      const { arrayData, lastDoc, objectData, memesId } = await queryString(
        searchInputValue
      );
      const { arrayData: templateData, lastDoc: templateLast } =
        await queryTemplate(searchInputValue);

      if (arrayData.length === 0 && templateData.length === 0) {
        setSearchUi("notFound");
      } else {
        setSearchUi(searchInputValue);
        lastRef.current = lastDoc;
        lastTemplateRef.current = templateLast;
        dispatch(getMemeAction(objectData));
        setMemeResult(memesId);
        setTemplateResult(templateData);
      }
    }
  };

  return (
    <>
      <ModalContent maxWidth="1200px">
        <ModalHeader color="brand.dark">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                <Icon
                  as={BiSearchAlt}
                  color="brand.dark"
                  w={8}
                  h={8}
                  style={{ transform: "scaleX(-1)" }}
                />
              }
            />
            <Input
              marginLeft="2"
              fontSize="1.2rem"
              border="none"
              focusBorderColor="none"
              placeholder="搜尋梗圖或模板"
              onChange={onSearchInputValue}
              onKeyPress={onSearch}
              maxLength="15"
            />
          </InputGroup>
        </ModalHeader>

        {(function () {
          if (searchUi)
            switch (searchUi) {
              case "notFound":
                return (
                  <>
                    <Divider></Divider>
                    <ModalBody pb={6} color="brand.dark">
                      <Flex marginBottom="10">
                        沒有找到任何相關梗圖或模板喔！ＱＱ
                      </Flex>
                    </ModalBody>
                  </>
                );
              default:
                return (
                  <>
                    <Divider></Divider>
                    <ModalBody pb={6} color="brand.dark">
                      <Box p={4}>
                        <Box>
                          <Text>Meme梗圖</Text>
                        </Box>
                        <Flex
                          flexDirection="row"
                          overflowX="scroll"
                          ref={optionRef}
                        >
                          {memeResult.length !== 0 ? (
                            memeResult.map((memeId) => (
                              <Box
                                flexShrink="0"
                                overflow="hidden"
                                borderWidth="1px"
                                borderRadius="lg"
                                width={["100px", "150px", "250px"]}
                                height={["100px", "150px", "250px"]}
                              >
                                <MemeBox memeId={memeId}></MemeBox>
                              </Box>
                            ))
                          ) : (
                            <Box>沒有任何相關梗圖~</Box>
                          )}
                          <Divider
                            orientation="vertical"
                            ref={rightRef}
                          ></Divider>
                        </Flex>
                      </Box>
                      <Box p={4}>
                        <Box>
                          <Text>模板</Text>
                        </Box>

                        <Flex
                          flexDirection="row"
                          overflowX="scroll"
                          ref={optionTemplateRef}
                        >
                          {templateResult.length !== 0 ? (
                            templateResult.map((template) => (
                              <Box
                                flexShrink="0"
                                overflow="hidden"
                                borderWidth="1px"
                                borderRadius="lg"
                                width={["100px", "150px", "250px"]}
                                height={["100px", "150px", "250px"]}
                              >
                                <MemeBox template={template}></MemeBox>
                              </Box>
                            ))
                          ) : (
                            <Box>沒有任何相關模板~</Box>
                          )}
                          <Divider
                            orientation="vertical"
                            ref={rightTemplateRef}
                          ></Divider>
                        </Flex>
                      </Box>
                    </ModalBody>
                  </>
                );
            }
        })()}
      </ModalContent>
    </>
  );
};
export default SearchModal;
