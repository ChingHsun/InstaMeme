import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Stack } from "@chakra-ui/layout";

import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import {
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
  BsTypeStrikethrough,
  BsTypeItalic,
} from "react-icons/bs";
import styled from "styled-components";
import { useDisclosure } from "@chakra-ui/hooks";
import { useRadio, useRadioGroup } from "@chakra-ui/radio";

const StyledInputSection = styled(Box)`
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
  .delete__icon {
  }
  .input__color {
    display: block;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    border: 1px black solid;
    outline: none;
    cursor: pointer;
  }
  .input__color::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .input__color::-webkit-color-swatch {
    border: none;
    border-radius: 100%;
  }
  .input__range {
    display: block;
    color: red;
    flex-basis: 50%;
  }
`;

function RadioInput(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const iconDisplay = () => {
    switch (props.value) {
      case "canter":
        return BsTextCenter;
      case "right":
        return BsTextRight;
      default:
        return BsTextLeft;
    }
  };
  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "gray",
          color: "white",
          borderColor: "gray",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={2}
        py={1}
      >
        <Icon w={5} h={5} as={iconDisplay()}></Icon>
      </Box>
    </Box>
  );
}

const InputSection = ({
  id,
  index,
  value,
  textSettings,
  onTextSettingsChange,
  onInputChange,
  onInputDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "textAlign",
    defaultValue: "left",
    onChange: (e) => onTextSettingsChange(e, id, "textAlign"),
  });
  const group = getRootProps();
  const rgbToHex = function (rgb) {
    if (rgb) {
      const rgba = rgb.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
      const hex = `#${(
        (1 << 24) +
        (parseInt(rgba[0]) << 16) +
        (parseInt(rgba[1]) << 8) +
        parseInt(rgba[2])
      )
        .toString(16)
        .slice(1)}`;

      return hex;
    }
  };
  return (
    <StyledInputSection>
      <p>文字輸入＃{index + 1}</p>
      <InputGroup w="70%" className="input__group">
        <Input
          borderRadius="full"
          type="text"
          placeholder="輸入文字．．．"
          bg="white"
          onChange={onInputChange}
          value={value}
          id={id}
        />
        <InputRightElement
          children={
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <SettingsIcon
                  className="settings__icon"
                  color="brand.blue"
                  cursor="pointer"
                  w={5}
                  h={5}
                />
              </PopoverTrigger>
              <PopoverContent color="brand.dark">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader px={6}>來設定你的文字吧!</PopoverHeader>
                <PopoverBody px={6} color="black">
                  <Box>
                    <Stack spacing={5} direction="row" {...group}>
                      {["left", "center", "right"].map((value) => {
                        const radio = getRadioProps({ value });
                        return (
                          <RadioInput key={value} {...radio}>
                            {value}
                          </RadioInput>
                        );
                      })}
                      <Box
                        cursor="pointer"
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="md"
                        px={2}
                        py={1}
                        bg={textSettings?.linethrough ? "gray" : "white"}
                        color={textSettings?.linethrough ? "white" : "black"}
                        onClick={(e) =>
                          onTextSettingsChange(e, id, "linethrough")
                        }
                      >
                        <Icon w={5} h={5} as={BsTypeStrikethrough}></Icon>
                      </Box>
                      <Box
                        cursor="pointer"
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="md"
                        px={2}
                        py={1}
                        bg={
                          textSettings?.fontStyle === "italic"
                            ? "gray"
                            : "white"
                        }
                        color={
                          textSettings?.fontStyle === "italic"
                            ? "white"
                            : "black"
                        }
                        onClick={(e) =>
                          onTextSettingsChange(e, id, "fontStyle")
                        }
                      >
                        <Icon w={5} h={5} as={BsTypeItalic}></Icon>
                      </Box>
                    </Stack>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>文字大小</div>

                      <input
                        className="input__range"
                        type="range"
                        value={textSettings?.fontSize}
                        onChange={(e) =>
                          onTextSettingsChange(e, id, "fontSize")
                        }
                      ></input>
                    </Flex>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>文字顏色</div>
                      <input
                        className="input__color"
                        type="color"
                        value={rgbToHex(textSettings?.fill)}
                        onChange={(e) => onTextSettingsChange(e, id, "fill")}
                      ></input>
                    </Flex>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>外框顏色</div>
                      <input
                        className="input__color"
                        type="color"
                        value={rgbToHex(textSettings?.stoke)}
                        onChange={(e) => onTextSettingsChange(e, id, "stroke")}
                      ></input>
                    </Flex>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>外框粗細</div>

                      <input
                        className="input__range"
                        type="range"
                        value={textSettings?.strokeWidth}
                        onChange={(e) =>
                          onTextSettingsChange(e, id, "strokeWidth")
                        }
                      ></input>
                    </Flex>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>背景顏色</div>
                      <input
                        className="input__color"
                        type="color"
                        value={
                          textSettings?.backgroundColor
                            ? rgbToHex(textSettings?.backgroundColor)
                            : "#ffffff"
                        }
                        onChange={(e) =>
                          onTextSettingsChange(e, id, "backgroundColor")
                        }
                      ></input>
                    </Flex>
                    <Flex h="30px" my={2} justifyContent="space-between">
                      <div>背景透明度</div>

                      <input
                        className="input__range"
                        type="range"
                        value={
                          textSettings?.backgroundColor
                            ? textSettings?.backgroundColor
                                .substring(
                                  textSettings?.backgroundColor.indexOf("(") +
                                    1,
                                  textSettings?.backgroundColor.lastIndexOf(")")
                                )
                                .split(/,\s*/)?.[3] * 100
                            : 0
                        }
                        onChange={(e) =>
                          onTextSettingsChange(e, id, "bgOpacity")
                        }
                      ></input>
                    </Flex>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          }
        />
      </InputGroup>

      <IconButton
        variant="outline"
        borderColor="brand.red"
        bg="white"
        aria-label="delete text"
        borderRadius="100%"
        icon={
          <DeleteIcon
            className="delete__icon"
            color="brand.red"
            onClick={onInputDelete}
          />
        }
      />
    </StyledInputSection>
  );
};

export default InputSection;
