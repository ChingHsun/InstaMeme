import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Modal,
  ModalOverlay,
  Button,
  Icon,
  Container,
  Box,
  Flex,
  Text,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { BsPlusCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { addFirestoreData, timestamp } from "../../firebase/firestore";
import { nanoid } from "nanoid";
import { BiCloudUpload } from "react-icons/bi";
import { AiOutlineFileImage, AiOutlineSetting } from "react-icons/ai";
import { fabric } from "fabric";
import InputSection from "./InputSection";
import useCanvas from "../../utils/hooks/useCanvas";
import { useDisclosure } from "@chakra-ui/hooks";
import LoginModal from "../../utils/components/LoginModal";
import ImageUploading from "react-images-uploading";
import { addDataUrl } from "../../firebase/storage";
import { Form, Formik } from "formik";
import ValidateTextInput from "../../utils/components/ValidateTextInput";
import { getTemplateMoreAction } from "../../redux/actions";

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
    border: 1px solid white;
  }
  .content__container {
    position: relative;
  }

  .step__icon__container {
    position: absolute;
    bottom: -12%;
    .step__icon {
      display: block;
    }
  }

  .image__upload__container {
    .area {
      border: 3px dashed gray;
      padding: 100px 50px;
      margin: 0 auto;
      cursor: pointer;
      .icon {
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
      }
      .text {
        text-align: center;
      }
    }
  }
`;
const StyledPreImage = styled(Box)`
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
const StyledCanvas = styled.div`
  .canvas-container {
    margin: 0 auto !important;
  }
`;
const CreateTemplate = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useSelector((state) => state.device.isMobile);
  const isTablet = useSelector((state) => state.device.isTablet);

  const templates = useSelector((state) => state.templates);
  const template = useSelector((state) => state.selectedTemplate);
  const dispatch = useDispatch();
  const containerRef = useRef();
  const doneRef = useRef();
  const initialRef = useRef();
  const toast = useToast();
  const { templateId } = useParams();
  const [textInput, setTextInput] = useState({});
  const authUser = useSelector((state) => state.auth);
  const [image, setImage] = useState([]);
  const [preImage, setPreImage] = useState(null);
  const [stepUi, setStepUi] = useState(1);
  const [buttonUi, setButtonUi] = useState(false);
  const [textSettings, setTextSettings] = useState({});

  const { canvasData, textChange, img } = useCanvas(containerRef, {
    image: image,
    template: null,
  });
  const [templateData, setTemplateData] = useState({
    created_time: null,
    creator_id: null,
    done_count: 0,
    saved_count: 0,
    title: null,
    query_string: null,
    default: null,
    image: null,
  });
  useEffect(() => {
    console.log("getTemplate useEffect");
    const objs = canvasData?.getObjects();
    let initTextInput = {};
    objs?.forEach((obj) => {
      if (obj.type === "textbox") {
        const inputId = nanoid();
        obj.id = inputId;
        initTextInput = { ...initTextInput, [inputId]: obj.text };
      }
    });
    setTextInput({ ...initTextInput });
  }, [templateId, canvasData]);
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
    textChange &&
      setTextInput({ ...textInput, [textChange?.id]: textChange?.value });
  }, [textChange]);

  useEffect(() => {
    if (stepUi === 3) setImage(preImage);
  }, [stepUi]);
  const onAddText = (canvasData) => {
    const inputId = nanoid();
    const defaultValue = "輸入文字";
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
        canvasData.renderAll();
      }
    });
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
  const handleInputDelete = (e, id) => {
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
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("此為必填欄位").max(15, "不可超過15個字元"),
  });

  const onTemplateUpload = async (e) => {
    setButtonUi(true);
    const templateId = nanoid();
    addDataUrl(canvasData.backgroundImage.toDataURL(), "templates").then(
      ({ fileUrl, fileId }) => {
        canvasData.setBackgroundImage(null);
        const savedData = JSON.stringify(canvasData);
        const data = {
          ...templateData,
          default: savedData,
          creator_id: authUser.uid,
          created_time: timestamp.fromDate(new Date()),
          image: fileUrl,
          image_id: fileId,
        };
        addFirestoreData(data, "templates", templateId)
          .then((resp) => {
            setButtonUi(false);
            dispatch(
              getTemplateMoreAction({
                [templateId]: { ...data, template_id: templateId },
              })
            );
            toast({
              title: "上傳成功",
              description: "圖片上傳成功！",
              status: "success",
              duration: 3000,
              position: "top",
            });
            onClose();
            setStepUi(1);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    );
  };

  const onFormSubmit = ({ title }, { setSubmitting }) => {
    let query = {};
    [...title].forEach((node) => {
      query = { ...query, [node]: true };
    });
    setTemplateData({
      ...templateData,
      title: title,
      query_string: query,
    });
    setStepUi(3);
  };
  return (
    <StyledCreate
      maxWidth="100vw"
      pt={["35px !important", "60px"]}
      pb="5"
      width="100vw"
    >
      <Container py="10" maxW="1200px">
        <Container
          mt="10"
          maxW={["320px", "700px", "1000px"]}
          p="0"
          borderRadius="lg"
          overflow="hidden"
        >
          <Box bg="brand.blue" className="content__container">
            <Text textAlign="center" py="10" fontSize="2xl" fontWeight="bold">
              創建一個新的梗圖模板吧
            </Text>
            <Text textAlign="center" pb="12">
              上傳的模板會提供給大家使用喔！
            </Text>
            <Flex
              className="step__icon__container"
              justifyContent="space-evenly"
              w="100%"
            >
              <Icon
                as={BiCloudUpload}
                color={stepUi === 1 ? "white" : "brand.dark"}
                bg={stepUi === 1 ? "brand.dark" : "white"}
                borderRadius="full"
                className="step__icon"
                p={1}
                w={12}
                h={12}
              ></Icon>

              <Icon
                as={AiOutlineSetting}
                borderRadius="full"
                color={stepUi === 2 ? "white" : "brand.dark"}
                bg={stepUi === 2 ? "brand.dark" : "white"}
                className="step__icon"
                p={1}
                w={12}
                h={12}
              ></Icon>
              <Icon
                as={AiOutlineFileImage}
                color={stepUi === 3 ? "white" : "brand.dark"}
                bg={stepUi === 3 ? "brand.dark" : "white"}
                borderRadius="full"
                className="step__icon"
                p={1}
                w={12}
                h={12}
              ></Icon>
            </Flex>
          </Box>

          <Box minH="500px" bg="white">
            <Box
              color="brand.dark"
              paddingX={isMobile ? "0" : "10"}
              paddingY="10"
            >
              {(function () {
                switch (stepUi) {
                  case 2:
                    return (
                      <Box paddingX="6">
                        <Text
                          mt="5"
                          mb="10"
                          color="brand.dark"
                          fontWeight="700"
                        >
                          第二步：幫你的模板取名吧
                        </Text>

                        <Formik
                          initialValues={{
                            title: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={onFormSubmit}
                        >
                          {({ isSubmitting, submitForm, errors, ...props }) => (
                            <>
                              <Form>
                                <ValidateTextInput
                                  name="title"
                                  initialRef={initialRef}
                                  placeholder="輸入你的標題"
                                  label="模板標題"
                                  isRequired={false}
                                ></ValidateTextInput>
                              </Form>

                              <StyledPreImage
                                h={isMobile ? "300px" : "600px"}
                                flexBasis="700px"
                              >
                                <Image src={preImage?.[0]["data_url"]}></Image>
                              </StyledPreImage>
                              <Flex justifyContent="space-between" mt="10">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setStepUi(1);
                                  }}
                                >
                                  上一步
                                </Button>
                                <Button
                                  onClick={() => {
                                    submitForm();
                                  }}
                                >
                                  下ㄧ步
                                </Button>
                              </Flex>
                            </>
                          )}
                        </Formik>
                      </Box>
                    );
                  case 3:
                    return (
                      <>
                        <Box paddingX="6">
                          <Text
                            mt="5"
                            mb="10"
                            color="brand.dark"
                            fontWeight="700"
                          >
                            第三步：最後 設定你的文字初始輸入區塊吧
                          </Text>
                        </Box>

                        <Flex
                          marginY="10"
                          color="white"
                          flexDirection={isTablet ? "column" : "row"}
                          justifyContent="space-between"
                        >
                          <Box
                            marginLeft={isMobile && "10px"}
                            marginBottom={isMobile && "10px"}
                          >
                            {Object.entries(textInput).map(
                              ([inputId, value], index) => {
                                return (
                                  <InputSection
                                    key={inputId}
                                    id={inputId}
                                    index={index}
                                    value={value}
                                    textSettings={textSettings[inputId]}
                                    onInputChange={(e) =>
                                      handleInputChange(e, inputId)
                                    }
                                    onTextSettingsChange={(e, id, setting) => {
                                      handleTextSettingsChange(e, id, setting);
                                    }}
                                    onInputDelete={(e) =>
                                      handleInputDelete(e, inputId)
                                    }
                                  ></InputSection>
                                );
                              }
                            )}
                            <Button
                              leftIcon={
                                <Icon as={BsPlusCircle} color="white" />
                              }
                              bg="brand.blue"
                              mt="5"
                              onClick={() => onAddText(canvasData)}
                            >
                              新增文字區塊
                            </Button>
                          </Box>
                          <Box flexBasis={isMobile ? "auto" : "600px"}>
                            <StyledCanvas ref={containerRef}>
                              <canvas id="canvas"></canvas>
                            </StyledCanvas>
                          </Box>
                        </Flex>

                        <Flex
                          justifyContent="space-between"
                          mt="10"
                          paddingX={isMobile && "6"}
                        >
                          <Button
                            variant="outline"
                            onClick={() => {
                              setStepUi(2);
                            }}
                          >
                            上一步
                          </Button>
                          <Button
                            onClick={() => {
                              onOpen();
                            }}
                          >
                            完成
                          </Button>
                        </Flex>

                        {authUser ? (
                          <AlertDialog
                            motionPreset="slideInBottom"
                            onClose={onClose}
                            isOpen={isOpen}
                            isCentered
                            leastDestructiveRef={doneRef}
                          >
                            <AlertDialogOverlay />

                            <AlertDialogContent color="brand.dark">
                              <AlertDialogHeader>確定上傳?</AlertDialogHeader>
                              <AlertDialogCloseButton />
                              <AlertDialogBody>
                                一旦上傳模板後，不能刪除喔！
                              </AlertDialogBody>
                              <AlertDialogFooter>
                                <Button
                                  onClick={onClose}
                                  variant="outline"
                                  borderColor="brand.red"
                                  color="brand.red"
                                  isLoading={buttonUi}
                                >
                                  取消
                                </Button>
                                <Button
                                  ml={3}
                                  ref={doneRef}
                                  onClick={onTemplateUpload}
                                  isLoading={buttonUi}
                                  loadingText="模板上傳中"
                                >
                                  上傳模板
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <LoginModal onClose={onClose}></LoginModal>
                          </Modal>
                        )}
                      </>
                    );
                  default:
                    return (
                      <Box paddingX="6">
                        <Text
                          mt="5"
                          mb="10"
                          color="brand.dark"
                          fontWeight="700"
                        >
                          第一步：上傳你的圖片吧
                        </Text>
                        <ImageUploading
                          value={image}
                          onChange={(imageList, addUpdateIndex) => {
                            if (imageList.length) {
                              setStepUi(2);
                              //setImage(imageList);
                              setPreImage(imageList);
                            } else {
                              toast({
                                title: "上傳失敗",
                                description: "Oops!上傳的似乎不是圖片窩",
                                status: "error",
                                duration: 3000,
                                position: "top",
                              });
                            }
                          }}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                          }) => {
                            return (
                              <Box className="image__upload__container">
                                <Box
                                  style={
                                    isDragging
                                      ? { color: "black" }
                                      : { color: "gray" }
                                  }
                                  onClick={onImageUpload}
                                  {...dragProps}
                                  className="area"
                                >
                                  <Icon
                                    as={BiCloudUpload}
                                    borderRadius="full"
                                    className="icon"
                                    p={1}
                                    w={12}
                                    h={12}
                                  ></Icon>
                                  <Text className="text">
                                    點擊或拖曳圖片至此
                                  </Text>
                                </Box>
                              </Box>
                            );
                          }}
                        </ImageUploading>
                      </Box>
                    );
                }
              })()}
            </Box>
          </Box>
        </Container>
      </Container>
    </StyledCreate>
  );
};

export default CreateTemplate;
