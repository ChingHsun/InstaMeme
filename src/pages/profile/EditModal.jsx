import {
  Button,
  Center,
  Container,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { Form, Formik, useField } from "formik";
import * as Yup from "yup";
import ValidateTextInput from "../../utils/components/ValidateTextInput";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthAction, updateUsersAction } from "../../redux/actions";
import { useParams } from "react-router";
import defaultUser from "../../utils/imgs/catuser.png";
import ImageUploading from "react-images-uploading";
import { updateProfile } from "../../firebase/firestore";
import { AddIcon } from "@chakra-ui/icons";

const ValidateTextArea = ({ label, placeholder, name }) => {
  const [field, form] = useField(name);
  const errorText = form.error && form.touched ? form.error : "";
  return (
    <FormControl isInvalid={!!errorText} marginY="10px">
      <FormLabel>{label}</FormLabel>
      <Textarea {...field} placeholder={placeholder} />
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};
const StyledModelContent = styled(ModalContent)`
  .image__container {
    position: relative;
  }
  .add__button {
    position: absolute;
    right: 25%;
    bottom: -4%;
  }
`;
const EditModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [image, setImage] = useState([]);
  const maxFileSize = 307200;
  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required("此為必填欄位")
      .max(15, "長度至多需要15個字元"),
    introduction: Yup.string().max(50, "長度至多需要50個字元"),
  });
  const isMobile = useSelector((state) => state.device.isMobile);

  const imageShow = (imageList) => {
    if (imageList.length)
      return imageList.map((image, index) => (
        <Box
          width="100%"
          style={{ overflow: "hidden" }}
          borderRadius="full"
          maxW="200px"
          maxH="200px"
          m="0 auto"
          key={index}
        >
          <Image src={image["data_url"]} width="100%" height="100%"></Image>
        </Box>
      ));
    return (
      <Box
        width="100%"
        style={{ overflow: "hidden" }}
        borderRadius="full"
        maxW="200px"
        maxH="200px"
        m="0 auto"
      >
        <Image
          src={authUser.photoURL || defaultUser}
          width="100%"
          height="100%"
        ></Image>
      </Box>
    );
  };
  const errorShow = (errors, imageList) => {
    if (errors) {
      return (
        errors.maxFileSize && (
          <Text fontSize="sm" color="red">
            圖片過大, 上限為 300 KB
          </Text>
        )
      );
    } else if (image.length) {
      return (
        <Text fontSize="sm" color="gray">
          圖片尺寸正確
        </Text>
      );
    }
    return (
      <Text fontSize="sm" color="gray">
        圖片上限為 300 KB
      </Text>
    );
  };
  const onFormSubmit = async (data, { setSubmitting }) => {
    if (image.length) {
      data.image = image[0].data_url;
    }
    const { authData, userData } = await updateProfile(data, authUser.uid);
    dispatch(updateAuthAction(authData));
    dispatch(updateUsersAction(authUser.uid, userData));

    onClose();
  };

  return (
    <StyledModelContent>
      <ModalHeader color="brand.dark">
        <Center>編輯你的個人資料吧</Center>
      </ModalHeader>
      <ModalCloseButton color="brand.dark" />
      <ModalBody pb={6} color="brand.dark">
        <Formik
          initialValues={{
            displayName: authUser.displayName,
            introduction: authUser.introduction,
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ isSubmitting, registerField }) => {
            return (
              <Form>
                <ImageUploading
                  value={image}
                  onChange={(imageList, data) => {
                    setImage(imageList);
                  }}
                  maxFileSize={maxFileSize}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    isDragging,
                    dragProps,
                    errors,
                  }) => (
                    <div>
                      <Container className="image__container" marginY="7">
                        {imageShow(imageList)}
                        <IconButton
                          className="add__button"
                          onClick={onImageUpload}
                          borderRadius="full"
                          w={isMobile ? "40px" : "50px"}
                          h={isMobile ? "40px" : "50px"}
                          bg="brand.yellow"
                          color="brand.dark"
                          {...dragProps}
                          icon={<AddIcon />}
                        >
                          Plus
                        </IconButton>
                      </Container>
                      {errorShow(errors, imageList)}
                    </div>
                  )}
                </ImageUploading>
                <ValidateTextInput
                  name="displayName"
                  placeholder="輸入你的暱稱"
                  label="暱稱"
                ></ValidateTextInput>
                <ValidateTextArea
                  name="introduction"
                  placeholder="輸入你的介紹"
                  label="介紹"
                ></ValidateTextArea>

                <Container marginTop="30px">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={isSubmitting}
                    width="100%"
                  >
                    確定編輯
                  </Button>
                </Container>
              </Form>
            );
          }}
        </Formik>
      </ModalBody>
    </StyledModelContent>
  );
};
export default EditModal;

const StyledText = styled.span`
  text-decoration: underline;
  &:hover {
    color: #023047;
    cursor: pointer;
  }
`;
