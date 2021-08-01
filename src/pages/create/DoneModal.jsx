import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Form, Formik, useField } from "formik";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  timestamp,
  addCanvasInFirestore,
  addFirestoreData,
  updateAccCount,
  FieldValue,
} from "../../firebase/firestore";
import ValidateTextInput from "../../utils/components/ValidateTextInput";
import { memesTheme } from "../../utils/memesThemes";
import { useHistory } from "react-router";
import {
  addMemesOrderMoreAction,
  getOneCreateAction,
} from "../../redux/actions";

const StyledModalContent = styled(ModalContent)`
  .checked__label {
    cursor: pointer;
    display: block;
    &:hover {
      background-color: #e4e4e4;
    }
  }
  .checked__text {
    display: block;
  }
  .file__title {
    font-weight: 900;
  }
  .created__span {
    text-decoration: underline;
    &:hover {
      color: #023047;
      cursor: pointer;
    }
  }
`;
const CheckBoxGroup = ({ label, ...props }) => {
  const [field, form] = useField(props);
  return (
    <label {...field} className="checked__label" htmlFor={label}>
      <Checkbox size="lg" id={label} {...field}>
        <Text className="checked__text" marginLeft="20px" fontWeight="900">
          {label}
        </Text>
      </Checkbox>
    </label>
  );
};
const DoneModal = ({ onClose, canvasData, img }) => {
  const [privateUi, setPrivateUi] = useState(false);
  const dispatch = useDispatch();
  const template = useSelector((state) => state.selectedTemplate);
  const toast = useToast();
  const authUser = useSelector((state) => state.auth);
  //redux later
  const [downloadTitle, setDownloadTitle] = useState("未命名梗圖");
  const history = useHistory();

  const onFormSubmit = async ({ title, themes }, { setSubmtting }) => {
    const dataURL = canvasData.toDataURL({
      format: "png",
    });
    let query = {};
    [...title].forEach((node) => {
      query = { ...query, [node]: true };
    });
    const data = {
      created_time: timestamp.fromDate(new Date()),
      image: dataURL,
      saved_count: 0,
      template_id: template.template_id,
      template_name: template.title,
      themes: themes,
      title: title,
      user_id: authUser.uid,
      user_name: authUser.displayName,
      visited_count: 0,
      query_string: query,
    };
    const { memeId, memeImage, imageId } = await addCanvasInFirestore(
      data,
      "memes"
    );
    dispatch(addMemesOrderMoreAction(memeId));

    const date = new Date();
    [...themes, "所有"].forEach(async (theme) => {
      const time =
        theme === "所有"
          ? timestamp.fromDate(new Date(date.getTime() + 1000000))
          : timestamp.fromDate(date);

      await addFirestoreData(
        {
          created_time: time,
          memes: FieldValue.arrayUnion(memeId),
        },
        "users",
        authUser.uid,
        "created_theme",
        theme
      );
      dispatch(getOneCreateAction(memeId, "add", theme));
    });

    await updateAccCount("templates", template.template_id, "done_count", "+");

    toast({
      title: "發布成功",
      status: "success",
      duration: 3000,
      position: "top",
      render: () => (
        <Alert
          status="success"
          variant="solid"
          textAlign="left"
          boxShadow="lg"
          rounded="md"
          alignItems="start"
          m={2}
          pr={7}
        >
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>發布成功</AlertTitle>
            <AlertDescription></AlertDescription>
          </Box>
        </Alert>
      ),
    });

    onClose();
    history.push(`/meme/${memeId}`);
  };
  const onPrivateChange = (e) => {
    e.target.checked ? setPrivateUi(true) : setPrivateUi(false);
  };
  const onDownloadChange = (e) => {
    setDownloadTitle(e.target.value);
  };
  const onImageDownload = () => {
    const dataURL = canvasData.toDataURL({
      format: "png",
    });
    const dlLink = document.createElement("a");
    dlLink.download = downloadTitle || "未命名梗圖";
    dlLink.href = dataURL;
    dlLink.click();
  };
  return (
    <>
      <StyledModalContent>
        <ModalHeader color="brand.dark">
          <Center>完成你的梗圖吧</Center>
        </ModalHeader>
        <ModalCloseButton color="brand.dark" />
        <ModalBody pb={6} color="brand.dark">
          {privateUi ? (
            <Container>
              <label className="file__title">檔案名稱:</label>
              <Input
                placeholder="檔案名稱"
                value={downloadTitle}
                onChange={onDownloadChange}
                marginY="10px"
              />
              <Button
                colorScheme="blue"
                mr={3}
                onClick={onImageDownload}
                width="100%"
                marginTop="30px"
              >
                下載
              </Button>
            </Container>
          ) : (
            <Formik
              initialValues={{ themes: [], title: "" }}
              validationSchema={Yup.object().shape({
                themes: Yup.array()
                  .min(1, "至少勾選一項")
                  .max(3, "最多勾選三項"),
                title: Yup.string().required("此欄位為必填"),
              })}
              onSubmit={onFormSubmit}
            >
              {({ isSubmitting, errors }) => {
                return (
                  <Form>
                    <ValidateTextInput
                      name="title"
                      placeholder="梗圖標題"
                      label="梗圖標題"
                    ></ValidateTextInput>
                    <Text>選擇你的主題(最多三個)</Text>
                    {errors.themes && <Text color="red">{errors.themes}</Text>}
                    {memesTheme.map((theme, index) => {
                      return (
                        <CheckBoxGroup
                          key={index}
                          label={theme}
                          index={index}
                          name="themes"
                          type="checkbox"
                          value={theme}
                        ></CheckBoxGroup>
                      );
                    })}
                    <Container marginTop="30px">
                      <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        isLoading={isSubmitting}
                        width="100%"
                      >
                        發布梗圖
                      </Button>
                    </Container>
                  </Form>
                );
              }}
            </Formik>
          )}
        </ModalBody>
        <Box borderTop="1px solid gray" padding="20px">
          <Checkbox size="lg" id="private" onChange={onPrivateChange}>
            <Text className="created__span" color="gray" marginLeft="10px">
              不要公開發佈
            </Text>
          </Checkbox>
        </Box>
      </StyledModalContent>
    </>
  );
};
export default DoneModal;
