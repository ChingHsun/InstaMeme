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
  ModalFooter,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import logo from "../imgs/logoblack.png";
import * as Yup from "yup";
import ValidateTextInput from "./ValidateTextInput";
import styled from "styled-components";
import { useEffect, useState } from "react";
import SignupModal from "./SignupModal";
import { login } from "../../firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { getAuthAction } from "../../redux/actions";

const LoginModal = ({ initialRef = null, onClose }) => {
  const [loginUi, setLoginUi] = useState(true);
  const toast = useToast();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);

  useEffect(() => {
    authUser && onClose();
  }, [authUser]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("此為必填欄位").email("信箱格式錯誤"),
    password: Yup.string()
      .required("此為必填欄位")
      .min(6, "長度至少需要六個字元")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "密碼需有大小寫英文字母與數字"
      ),
  });
  const onFormSubmit = async (loginData, { setSubmitting }) => {
    const response = await login(loginData);
    if (response.error) {
      toast({
        title: "登入失敗",
        description: response.error,
        status: "error",
        duration: 3000,
        position: "top",
      });
    } else {
      toast({
        title: "登入成功",
        status: "success",
        duration: 3000,
        position: "top",
      });

      dispatch(getAuthAction(response));
      onClose();
    }
  };
  const onSignup = () => {
    setLoginUi(false);
  };
  return (
    <>
      {loginUi ? (
        <ModalContent>
          <ModalHeader color="brand.dark">
            <Center>
              <Image maxW="30%" src={logo} m={5}></Image>
            </Center>
            <Center>登入你的帳號吧</Center>
          </ModalHeader>
          <ModalCloseButton color="brand.dark" />
          <ModalBody pb={6} color="brand.dark">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={onFormSubmit}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <ValidateTextInput
                      name="email"
                      placeholder="測試信箱：test@gmail.com"
                      label="信箱"
                    ></ValidateTextInput>
                    <ValidateTextInput
                      name="password"
                      placeholder="測試密碼：123123aA"
                      label="密碼"
                      type="password"
                    ></ValidateTextInput>
                    <Container marginTop="30px">
                      <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        isLoading={isSubmitting}
                        width="100%"
                      >
                        登入帳號
                      </Button>
                    </Container>
                  </Form>
                );
              }}
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Container>
              <Text color="gray" textAlign="center">
                還沒有帳號？
                <StyledText onClick={onSignup}>註冊一個新帳號</StyledText>
              </Text>
            </Container>
          </ModalFooter>
        </ModalContent>
      ) : (
        <SignupModal initialRef={initialRef} onClose={onClose}></SignupModal>
      )}
    </>
  );
};
export default LoginModal;

const StyledText = styled.span`
  text-decoration: underline;
  &:hover {
    color: #023047;
    cursor: pointer;
  }
`;
