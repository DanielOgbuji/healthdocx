import DynamicForm from "@/components/records/DynamicForm";
import { Flex } from "@chakra-ui/react";

const RecordDetails = () => {
  const structuredData = localStorage.getItem("structuredData") || "{}";

  return (
    <Flex w="full" mt="72px" direction="column" p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} pb={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
      <DynamicForm structuredData={structuredData} />
    </Flex>
  );
};

export default RecordDetails;
