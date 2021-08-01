import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useField } from "formik";
import { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";

const ValidateTextInput = ({
  label,
  placeholder,
  initialRef,
  isRequired = true,
  type = "text",
  name,
}) => {
  const [field, form] = useField(name);
  const errorText = form.error && form.touched ? form.error : "";
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <FormControl isInvalid={!!errorText} isRequired={isRequired} marginY="10px">
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          {...field}
          ref={initialRef}
          placeholder={placeholder}
          type={type === "password" && !show ? "password" : "text"}
        />
        {type === "password" && (
          <InputRightElement width="4.5rem">
            <Icon
              onClick={handleClick}
              as={show ? FiEyeOff : FiEye}
              color="gray"
            ></Icon>
          </InputRightElement>
        )}
      </InputGroup>

      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default ValidateTextInput;
