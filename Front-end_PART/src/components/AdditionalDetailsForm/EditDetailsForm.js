import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  IconButton,
  ChakraProvider,
  extendTheme,
  CSSReset,
  Flex,
  Heading,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import makeRequest from "../../Axios/axiosReq";
import { getTokenCookie } from "../../AuthCookie/authToken";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loading";

const theme = extendTheme();

const validationSchema = Yup.object().shape({
  about: Yup.string().required("About is required"),
  skills: Yup.string().required("Skills are required"),
  experiences: Yup.array().of(
    Yup.object().shape({
      yearEx: Yup.number().required("Year is required"),
      typeEx: Yup.string()
        .oneOf(["full-time", "internship"], "Invalid experience type")
        .required("Type is required"),
      companyName: Yup.string().required("Company name is required"),
      descriptionEx: Yup.string(),
    })
  ),
  education: Yup.array().of(
    Yup.object().shape({
      startYear: Yup.number().required("Start year is required"),
      endYear: Yup.number().required("End year is required"),
      degreeType: Yup.string().required("Degree type is required"),
      instituteName: Yup.string().required("Institute name is required"),
      descriptionInst: Yup.string(),
    })
  ),
});

const EditDetailsForm = ({ initialValues }) => {
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId;
  }
  const [message, setMessage] = useState({ status: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      await makeRequest(`/user/update-details/${userId}`, "PUT", user, values)
        .then((data) => {
          if (data.success) {
            setMessage({
              status: "success",
              text: data.message,
            });
            setIsLoading(false);
            setTimeout(() => {
              navigate("/");
            }, 5000);
            return;
          } else {
            setIsLoading(false);
            setMessage({
              status: "success",
              text: data.message,
            });
            return;
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setMessage({
            status: "success",
            text: error.message,
          });
          return;
        });
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <form
          onSubmit={formik.handleSubmit}
          style={{ width: "100%", maxWidth: "600px", padding: "20px" }}
        >
          <Heading as="h1" mb={6} textAlign="center">
            Edit Additional Info
          </Heading>
          {message.status && (
            <Alert status={message.status} mb={4}>
              <AlertIcon />
              {message.text}
            </Alert>
          )}
          <FormControl
            id="about"
            mb={4}
            isInvalid={formik.errors.about && formik.touched.about}
          >
            <FormLabel>About</FormLabel>
            <Textarea
              {...formik.getFieldProps("about")}
              placeholder="Tell us about yourself"
            />
            {formik.errors.about && formik.touched.about && (
              <Box color="red.500">{formik.errors.about}</Box>
            )}
          </FormControl>

          <FormControl
            id="skills"
            mb={4}
            isInvalid={formik.errors.skills && formik.touched.skills}
          >
            <FormLabel>Skills</FormLabel>
            <Input
              {...formik.getFieldProps("skills")}
              placeholder="Enter your skills"
            />
            {formik.errors.skills && formik.touched.skills && (
              <Box color="red.500">{formik.errors.skills}</Box>
            )}
          </FormControl>

          <VStack spacing={4} mb={4}>
            {formik.values.experiences.map((experience, index) => (
              <Box key={index} width="100%">
                <HStack spacing={4} width="100%">
                  <FormControl
                    id={`experiences.${index}.yearEx`}
                    isInvalid={
                      formik.errors.experiences?.[index]?.yearEx &&
                      formik.touched.experiences?.[index]?.yearEx
                    }
                  >
                    <FormLabel>Year</FormLabel>
                    <Input
                      {...formik.getFieldProps(`experiences.${index}.yearEx`)}
                      placeholder="Year"
                    />
                    {formik.errors.experiences?.[index]?.yearEx &&
                      formik.touched.experiences?.[index]?.yearEx && (
                        <Box color="red.500">
                          {formik.errors.experiences?.[index]?.yearEx}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`experiences.${index}.typeEx`}
                    isInvalid={
                      formik.errors.experiences?.[index]?.typeEx &&
                      formik.touched.experiences?.[index]?.typeEx
                    }
                  >
                    <FormLabel>Type</FormLabel>
                    <Select
                      {...formik.getFieldProps(`experiences.${index}.typeEx`)}
                      placeholder="Select type"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="internship">Internship</option>
                    </Select>
                    {formik.errors.experiences?.[index]?.typeEx &&
                      formik.touched.experiences?.[index]?.typeEx && (
                        <Box color="red.500">
                          {formik.errors.experiences?.[index]?.typeEx}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`experiences.${index}.companyName`}
                    isInvalid={
                      formik.errors.experiences?.[index]?.companyName &&
                      formik.touched.experiences?.[index]?.companyName
                    }
                  >
                    <FormLabel>Company Name</FormLabel>
                    <Input
                      {...formik.getFieldProps(
                        `experiences.${index}.companyName`
                      )}
                      placeholder="Company name"
                    />
                    {formik.errors.experiences?.[index]?.companyName &&
                      formik.touched.experiences?.[index]?.companyName && (
                        <Box color="red.500">
                          {formik.errors.experiences?.[index]?.companyName}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`experiences.${index}.descriptionEx`}
                    isInvalid={
                      formik.errors.experiences?.[index]?.descriptionEx &&
                      formik.touched.experiences?.[index]?.descriptionEx
                    }
                  >
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...formik.getFieldProps(
                        `experiences.${index}.descriptionEx`
                      )}
                      placeholder="Experience description"
                    />
                    {formik.errors.experiences?.[index]?.descriptionEx &&
                      formik.touched.experiences?.[index]?.descriptionEx && (
                        <Box color="red.500">
                          {formik.errors.experiences?.[index]?.descriptionEx}
                        </Box>
                      )}
                  </FormControl>

                  {index > 0 && (
                    <IconButton
                      type="button"
                      colorScheme="red"
                      aria-label="Remove Experience"
                      icon={<MinusIcon />}
                      onClick={() => {
                        const newExperiences = formik.values.experiences.filter(
                          (_, i) => i !== index
                        );
                        formik.setFieldValue("experiences", newExperiences);
                      }}
                    />
                  )}
                </HStack>
              </Box>
            ))}
            <Button
              type="button"
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() =>
                formik.setFieldValue("experiences", [
                  ...formik.values.experiences,
                  {
                    yearEx: "",
                    typeEx: "",
                    companyName: "",
                    descriptionEx: "",
                  },
                ])
              }
            >
              Add Experience
            </Button>
          </VStack>

          <VStack spacing={4} mb={4}>
            {formik.values.education.map((edu, index) => (
              <Box key={index} width="100%">
                <HStack spacing={4} width="100%">
                  <FormControl
                    id={`education.${index}.startYear`}
                    isInvalid={
                      formik.errors.education?.[index]?.startYear &&
                      formik.touched.education?.[index]?.startYear
                    }
                  >
                    <FormLabel>Start Year</FormLabel>
                    <Input
                      {...formik.getFieldProps(`education.${index}.startYear`)}
                      placeholder="Start year"
                    />
                    {formik.errors.education?.[index]?.startYear &&
                      formik.touched.education?.[index]?.startYear && (
                        <Box color="red.500">
                          {formik.errors.education?.[index]?.startYear}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`education.${index}.endYear`}
                    isInvalid={
                      formik.errors.education?.[index]?.endYear &&
                      formik.touched.education?.[index]?.endYear
                    }
                  >
                    <FormLabel>End Year</FormLabel>
                    <Input
                      {...formik.getFieldProps(`education.${index}.endYear`)}
                      placeholder="End year"
                    />
                    {formik.errors.education?.[index]?.endYear &&
                      formik.touched.education?.[index]?.endYear && (
                        <Box color="red.500">
                          {formik.errors.education?.[index]?.endYear}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`education.${index}.degreeType`}
                    isInvalid={
                      formik.errors.education?.[index]?.degreeType &&
                      formik.touched.education?.[index]?.degreeType
                    }
                  >
                    <FormLabel>Degree Type</FormLabel>
                    <Input
                      {...formik.getFieldProps(`education.${index}.degreeType`)}
                      placeholder="Degree type"
                    />
                    {formik.errors.education?.[index]?.degreeType &&
                      formik.touched.education?.[index]?.degreeType && (
                        <Box color="red.500">
                          {formik.errors.education?.[index]?.degreeType}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`education.${index}.instituteName`}
                    isInvalid={
                      formik.errors.education?.[index]?.instituteName &&
                      formik.touched.education?.[index]?.instituteName
                    }
                  >
                    <FormLabel>Institute Name</FormLabel>
                    <Input
                      {...formik.getFieldProps(
                        `education.${index}.instituteName`
                      )}
                      placeholder="Institute name"
                    />
                    {formik.errors.education?.[index]?.instituteName &&
                      formik.touched.education?.[index]?.instituteName && (
                        <Box color="red.500">
                          {formik.errors.education?.[index]?.instituteName}
                        </Box>
                      )}
                  </FormControl>

                  <FormControl
                    id={`education.${index}.descriptionInst`}
                    isInvalid={
                      formik.errors.education?.[index]?.descriptionInst &&
                      formik.touched.education?.[index]?.descriptionInst
                    }
                  >
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...formik.getFieldProps(
                        `education.${index}.descriptionInst`
                      )}
                      placeholder="Education description"
                    />
                    {formik.errors.education?.[index]?.descriptionInst &&
                      formik.touched.education?.[index]?.descriptionInst && (
                        <Box color="red.500">
                          {formik.errors.education?.[index]?.descriptionInst}
                        </Box>
                      )}
                  </FormControl>

                  {index > 0 && (
                    <IconButton
                      type="button"
                      colorScheme="red"
                      aria-label="Remove Education"
                      icon={<MinusIcon />}
                      onClick={() => {
                        const newEducation = formik.values.education.filter(
                          (_, i) => i !== index
                        );
                        formik.setFieldValue("education", newEducation);
                      }}
                    />
                  )}
                </HStack>
              </Box>
            ))}
            <Button
              type="button"
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() =>
                formik.setFieldValue("education", [
                  ...formik.values.education,
                  {
                    startYear: "",
                    endYear: "",
                    degreeType: "",
                    instituteName: "",
                    descriptionInst: "",
                  },
                ])
              }
            >
              Add Education
            </Button>
          </VStack>

          {isLoading ? (
            <Loader />
          ) : (
            <Button colorScheme="teal" width={"100%"} type="submit" mt={4}>
              Save Details
            </Button>
          )}
        </form>
      </Flex>
    </ChakraProvider>
  );
};

export default EditDetailsForm;
