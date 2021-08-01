import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icons";
import { Container, Box, Flex, Text, Center } from "@chakra-ui/layout";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { BsPlusCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getFirestoreByBatch, getFirestoreDoc } from "../../firebase/firestore";
import { nanoid } from "nanoid";

import {
  getSelectedTemplateAction,
  getTemplateAction,
} from "../../redux/actions";
import _ from "lodash";
import { fabric } from "fabric";
import InputSection from "./InputSection";
import useCanvas from "../../utils/hooks/useCanvas";
import { Checkbox, Modal, ModalOverlay, Spinner, Tag } from "@chakra-ui/react";
import DoneModal from "./DoneModal";
import { useDisclosure } from "@chakra-ui/hooks";
import LoginModal from "../../utils/components/LoginModal";

const StyledCreate = styled(Box)`
  letter-spacing: 0.2em;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
  }
  .input__group {
    display: inline-block;
    margin-right: 10px;
    color: black;
  }
  .icon__style {
    border-radius: 100%;
    border: 1px solid rgba(255, 255, 255, 1);
  }
`;
const StyledCanvaImg = styled(Box)`
  .canvas__container {
    width: 100%;
    max-width: 800px;
  }

  .canvas-container {
    margin: 0 auto;
  }
`;
const Create = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const templates = useSelector((state) => state.templates);
  const template = useSelector((state) => state.selectedTemplate);
  const containerRef = useRef();

  const { canvasData, textChange, img, isZoom } = useCanvas(containerRef, {
    image: null,
    template: template,
  });
  const { templateId } = useParams();
  const [textInput, setTextInput] = useState({});
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const [textSettings, setTextSettings] = useState({});
  const [ui, setUi] = useState("loading");
  const isTablet = useSelector((state) => state.device.isTablet);
  const isMobile = useSelector((state) => state.device.isMobile);

  useEffect(() => {
    console.log("getTemplate useEffect", templateId);
    getTemplate();
  }, [templateId]);
  useEffect(() => {
    if (canvasData) {
      if (isMobile) {
        if (canvasData?.getZoom() !== 1) {
          canvasData.setZoom(1);
          const ratio = 300 / img.width;
          canvasData.setWidth(300);
          canvasData.setHeight(img.height * ratio);
        }
      } else {
        if (canvasData?.getZoom() !== 2) {
          canvasData.setZoom(2);
          const ratio = 600 / img.width;
          canvasData.setWidth(600);
          canvasData.setHeight(img.height * ratio);
        }
      }
    }
  }, [isMobile]);
  useEffect(() => {
    console.log("canvasData", canvasData);
    const objs = canvasData?.getObjects();
    console.log("canvasDatagetZoom", canvasData?.getZoom());

    let initTextInput = {};
    let initTextSettings = {};

    objs?.forEach((obj) => {
      if (obj.type === "textbox") {
        const inputId = nanoid();
        obj.id = inputId;
        initTextInput = { ...initTextInput, [inputId]: obj.text };
        initTextSettings = { ...initTextSettings, [inputId]: obj };
      }
    });
    setTextInput({ ...initTextInput });
    setTextSettings({ ...initTextSettings });
    if (canvasData) setUi("success");
  }, [canvasData]);
  useEffect(() => {
    textChange &&
      setTextInput({ ...textInput, [textChange?.id]: textChange?.value });
  }, [textChange]);

  const getTemplate = async () => {
    if (_.isEmpty(templates)) {
      const { objectData, arrayData } = await getFirestoreByBatch(
        "templates",
        "created_time",
        "desc",
        15
      );
      if (arrayData[templateId]) {
        dispatch(getTemplateAction(objectData, templateId));
      } else {
        const response = await getFirestoreDoc("templates", templateId);
        dispatch(getTemplateAction(objectData));
        const data = response[templateId];
        dispatch(getSelectedTemplateAction(data));
      }
    } else {
      const data = templates[templateId];
      dispatch(getSelectedTemplateAction(data));
    }
  };
  const onAddText = (signature) => {
    const inputId = signature?.inputId || nanoid();
    const defaultValue = signature?.value || "輸入文字";
    setTextInput({ ...textInput, [inputId]: defaultValue });

    const itext = new fabric.Textbox(defaultValue, {
      id: inputId,
      fill: "rgba(255,255,255,1)",
      fontWeight: 900,
      strokeWidth: 5,
      stroke: "rgba(0,0,0,1)",
      backgroundColor: "rgba(255,255,255,0)",
      linethrough: false,
      fontStyle: "normal",
      fontFamily:
        '"Noto Sans TC","pt Arial", "微軟正黑體", "WenQuanYi Zen Hei", "儷黑 Pro", "LiHei Pro", "文泉驛正黑", "Microsoft JhengHei", sans-serif',
      paintFirst: "stroke",
      fontSize: 24,
    });

    setTextSettings({
      ...textSettings,
      [inputId]: {
        fill: "rgba(255,255,255,1)",
        fontWeight: 900,
        strokeWidth: 5,
        stroke: "rgba(0,0,0,1)",
        backgroundColor: "rgba(255,255,255,0)",
        linethrough: false,
        fontStyle: "normal",
        fontSize: 24,
        fontFamily:
          '"Noto Sans TC","pt Arial", "微軟正黑體", "WenQuanYi Zen Hei", "儷黑 Pro", "LiHei Pro", "文泉驛正黑", "Microsoft JhengHei", sans-serif',
      },
    });
    canvasData.add(itext);
    canvasData.renderAll();
  };
  const handleInputChange = (e, id) => {
    setTextInput({ ...textInput, [id]: e.target.value });
    const objs = canvasData.getObjects();
    objs.forEach(function (obj) {
      if (obj.id === id) {
        obj.text = e.target.value;
      }
    });
    canvasData.renderAll();
  };
  const handleTextSettingsChange = (e, id, setting) => {
    let setValue;
    if (setting === "bgOpacity") {
      setting = "backgroundColor";
      let colorOnly = textSettings[id].backgroundColor
        .substring(
          textSettings[id].backgroundColor.indexOf("(") + 1,
          textSettings[id].backgroundColor.lastIndexOf(")")
        )
        .split(/,\s*/);

      setValue =
        "rgb(" +
        `${colorOnly[0]}, ${colorOnly[1]},${colorOnly[2]},` +
        e.target.value * 0.01 +
        ")";
    } else if (setting === "textAlign") {
      setValue = e;
    } else if (setting === "strokeWidth" || setting === "fontSize") {
      setValue = +e.target.value;
    } else if (setting === "linethrough") {
      setValue = !textSettings[id].linethrough;
    } else if (setting === "fontStyle") {
      setValue = textSettings[id].fontStyle === "normal" ? "italic" : "normal";
    } else {
      setValue =
        "rgb(" +
        e.target.value
          .match(/[A-Za-z0-9]{2}/g)
          .map(function (v) {
            return parseInt(v, 16);
          })
          .join(",") +
        ")";
    }
    setTextSettings({
      ...textSettings,
      [id]: { ...textSettings[id], [setting]: setValue },
    });
    const objs = canvasData.getObjects();
    objs.forEach(function (obj) {
      if (obj.id === id) {
        obj.set(setting, setValue);
      }
    });
    canvasData.renderAll();
  };
  const handleInputDelete = (id) => {
    let cloneInput = Object.assign({}, textInput);
    delete cloneInput[id];
    setTextInput(cloneInput);
    const objs = canvasData.getObjects();
    objs.forEach(function (obj) {
      if (obj.id === id) {
        canvasData.remove(obj);
        canvasData.requestRenderAll();
      }
    });
  };
  const onSignChange = (e) => {
    if (authUser) {
      if (e.target.checked) {
        onAddText({
          inputId: "signature",
          value: `@${authUser?.displayName}`,
        });
      } else {
        handleInputDelete("signature");
      }
    } else {
      onOpen();
    }
  };
  const onSaveSerialize = (e) => {
    onOpen();
  };

  return (
    <StyledCreate
      maxWidth="100vw"
      pt={["35px !important", "60px"]}
      pb="5"
      width="100vw"
    >
      <Container
        p={isMobile ? "0" : "10"}
        maxW={isTablet ? (isMobile ? "300px" : "700px") : "1200px"}
      >
        <Flex
          marginY="10"
          color="white"
          flexDirection={isTablet ? "column" : "row"}
          justifyContent="space-between"
        >
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            w={isTablet ? "70%" : "30%"}
            minW="200px"
            marginBottom={isTablet ? "20px" : "0"}
          >
            <Box>
              <Box marginY="6">
                <Link to="../create_all">模板</Link>&nbsp;&#62;&nbsp;
                <Tag>{template?.title}</Tag>
              </Box>
              {Object.entries(textInput).map(([inputId, value], index) => {
                return (
                  <InputSection
                    key={inputId}
                    id={inputId}
                    index={index}
                    value={value}
                    textSettings={textSettings[inputId]}
                    onTextSettingsChange={(e, id, setting) => {
                      handleTextSettingsChange(e, id, setting);
                    }}
                    onInputChange={(e) => handleInputChange(e, inputId)}
                    onInputDelete={() => handleInputDelete(inputId)}
                  ></InputSection>
                );
              })}
              <Box marginY="6">
                <Button
                  leftIcon={<Icon as={BsPlusCircle} color="white" />}
                  bg="brand.blue"
                  w="80%"
                  onClick={() => onAddText()}
                >
                  新增文字區塊
                </Button>
              </Box>
            </Box>

            <Box>
              <Box>
                <Checkbox onChange={onSignChange} marginY="4">
                  是否新增簽名檔
                </Checkbox>
              </Box>
              <Box>
                <Button
                  bg="brand.green"
                  color="white"
                  onClick={onSaveSerialize}
                  w="80%"
                >
                  完成梗圖
                </Button>
              </Box>
            </Box>
          </Flex>
          <StyledCanvaImg flexBasis="600px">
            {ui === "loading" && (
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
            {templateId && (
              <Box
                className="canvas__container"
                key={templateId}
                ref={containerRef}
              >
                <canvas id="canvas"></canvas>
              </Box>
            )}
          </StyledCanvaImg>
        </Flex>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {authUser ? (
          <DoneModal
            onClose={onClose}
            img={img}
            canvasData={canvasData}
          ></DoneModal>
        ) : (
          <LoginModal onClose={onClose}></LoginModal>
        )}
      </Modal>
    </StyledCreate>
  );
};

export default Create;
