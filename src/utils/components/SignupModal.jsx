import {
  Button,
  Center,
  Container,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import logo from "../imgs/logoblack.png";
import * as Yup from "yup";
import ValidateTextInput from "./ValidateTextInput";
import { signup } from "../../firebase/auth";
import { addFirestoreData, timestamp } from "../../firebase/firestore";
import { useDispatch } from "react-redux";
import { getAuthAction } from "../../redux/actions";
const SignupModal = ({ initialRef, onClose }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("此為必填欄位").email("信箱格式錯誤"),
    displayName: Yup.string().required("此為必填欄位"),
    password: Yup.string()
      .required("此為必填欄位")
      .min(6, "長度至少需要六個字元")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "密碼需有大小寫英文字母與數字"
      ),
    repassword: Yup.string().oneOf([Yup.ref("password"), null], "需與密碼相符"),
  });
  const onFormSubmit = async (
    { repassword, ...signupData },
    { setSubmitting }
  ) => {
    const response = await signup(signupData);
    if (response.error) {
      toast({
        title: "註冊失敗",
        description: response.error,
        status: "error",
        duration: 3000,
        position: "top",
      });
    } else {
      await addFirestoreData(
        {
          created_time: timestamp.fromDate(new Date()),
          displayName: signupData.displayName,
        },
        "users",
        response.uid
      );
      dispatch(getAuthAction(response));
      toast({
        title: "註冊成功",
        status: "success",
        duration: 3000,
        position: "top",
      });
      onClose();
    }
  };
  return (
    <ModalContent className="test">
      <ModalHeader color="brand.dark">
        <Center>
          <Image maxW="30%" src={logo} m={5}></Image>
        </Center>
        <Center>註冊一個帳號吧</Center>
      </ModalHeader>
      <ModalCloseButton color="brand.dark" />
      <ModalBody pb={6} color="brand.dark">
        <Formik
          initialValues={{
            email: "",
            displayName: "",
            password: "",
            repassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ isSubmitting, ...props }) => (
            <Form>
              <ValidateTextInput
                name="email"
                initialRef={initialRef}
                placeholder="輸入你的信箱"
                label="信箱"
              ></ValidateTextInput>
              <ValidateTextInput
                name="displayName"
                placeholder="輸入你的暱稱"
                label="暱稱"
              ></ValidateTextInput>
              <ValidateTextInput
                name="password"
                placeholder="輸入你的密碼"
                label="密碼"
                type="password"
              ></ValidateTextInput>
              <ValidateTextInput
                name="repassword"
                placeholder="重新輸入你的密碼"
                label="驗證密碼"
                type="password"
              ></ValidateTextInput>
              <Container marginTop="30px">
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading={isSubmitting}
                  width="100%"
                  bg="brand.yellow"
                  color="brand.dark"
                >
                  註冊帳號
                </Button>
              </Container>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </ModalContent>
  );
};
export default SignupModal;
