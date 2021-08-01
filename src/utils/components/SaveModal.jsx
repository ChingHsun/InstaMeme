import {
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik, useField } from "formik";
import { ModalFooter } from "@chakra-ui/modal";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneSavedAction, getOneSavedCountAction } from "../../redux/actions";
import {
  addFirestoreData,
  timestamp,
  updateAccCount,
  FieldValue,
} from "../../firebase/firestore";

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
`;
const CheckBoxGroup = ({ label, disabled, ...props }) => {
  const [field, form] = useField(props);
  if (label !== "所有") {
    return (
      <FormLabel {...field} className="checked__label" htmlFor={label}>
        <Checkbox size="lg" id={label} {...field} isDisabled={disabled}>
          <Text className="checked__text" marginLeft="20px" fontWeight="900">
            {label}
          </Text>
        </Checkbox>
      </FormLabel>
    );
  } else {
    return null;
  }
};
const SaveModal = ({ onClose, memeId, memeImage, memeTitle, saveCount }) => {
  const [createUi, setCreateUi] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const authSave = useSelector((state) => state.authSave);

  //redux later
  const [category, setCategory] = useState([]);
  useEffect(() => {
    setCategory(authSave.map((saveInfo) => saveInfo.docId));
  }, [authUser.uid, authSave]);
  useEffect(() => {
    createUi || inputRef.current.focus();
  }, [createUi]);
  const onCreateUi = () => {
    setCreateUi(false);
  };
  const onCreateCategory = async () => {
    if (inputValue !== "") {
      setCategory([...category, inputValue]);
      setInputValue("");
    }
  };
  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const onFormSubmit = async ({ categories }, { setSubmitting }) => {
    const date = new Date();

    ["所有", ...categories].forEach(async (category) => {
      let time =
        category === "所有"
          ? timestamp.fromDate(new Date(date.getTime() + 100000))
          : timestamp.fromDate(date);
      await addFirestoreData(
        {
          created_time: time,
          memes: FieldValue.arrayUnion(memeId),
        },
        "users",
        authUser.uid,
        "saved_category",
        category
      );

      dispatch(getOneSavedAction(memeId, "add", category));
      await updateAccCount("memes", memeId, "saved_count", "+");
      dispatch(getOneSavedCountAction(saveCount, memeId, "add"));
    });
    toast({
      title: "收藏成功",
      status: "success",
      duration: 3000,
      position: "top",
    });
    onClose();
  };
  return (
    <>
      <StyledModalContent>
        <ModalHeader color="brand.dark">
          <Center>選擇你的收藏分類吧</Center>
        </ModalHeader>
        <ModalCloseButton color="brand.dark" />
        <ModalBody pb={6} color="brand.dark">
          <FormLabel className="checked__label" htmlFor="所有">
            <Checkbox
              size="lg"
              id="所有"
              isDisabled
              isChecked
              name="categories"
              value="所有"
            >
              <Text
                className="checked__text"
                marginLeft="20px"
                fontWeight="900"
              >
                所有
              </Text>
            </Checkbox>
          </FormLabel>
          <Formik initialValues={{ categories: [] }} onSubmit={onFormSubmit}>
            {({ isSubmitting }) => {
              return (
                <Form>
                  {category.map((cate, index) => {
                    return (
                      <CheckBoxGroup
                        key={index}
                        label={cate}
                        index={index}
                        name="categories"
                        type="checkbox"
                        value={cate}
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
                      加入收藏
                    </Button>
                  </Container>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
        <ModalFooter borderTop="1px solid gray">
          <Container>
            {createUi ? (
              <Text color="gray" textAlign="center">
                <StyledText onClick={onCreateUi}>創建新收藏分類</StyledText>
              </Text>
            ) : (
              <Flex justifyContent="space-between">
                <Input
                  borderRadius="full"
                  placeholder="新增新的分類"
                  color="brand.dark"
                  value={inputValue}
                  onChange={onInputChange}
                  ref={inputRef}
                />

                <Button
                  bg="brand.yellow"
                  marginLeft="10px"
                  color="brand.dark"
                  onClick={onCreateCategory}
                >
                  新增
                </Button>
              </Flex>
            )}
          </Container>
        </ModalFooter>
      </StyledModalContent>
    </>
  );
};
export default SaveModal;

const StyledText = styled.span`
  text-decoration: underline;
  &:hover {
    color: #023047;
    cursor: pointer;
  }
`;
