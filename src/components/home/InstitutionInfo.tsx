import { memo } from "react";
import { Flex, Heading, Text, Skeleton } from "@chakra-ui/react";

interface InstitutionInfoProps {
    institution: {
        id: number;
        institutionName: string;
    };
    loading: boolean;
}

const InstitutionInfo = ({ institution, loading }: InstitutionInfoProps) => {
    return (
        <Flex direction="column" gap="1" pr={{ base: "12", smDown: "4" }}>
            <Skeleton loading={loading}>
                <Heading size="3xl" textWrap="pretty">
                    {institution?.institutionName || "Loading Institution Name..."}
                </Heading>
            </Skeleton>
            <Skeleton loading={loading} height="24px">
                <Text color="outline">Hospital ID: {institution?.id || "Loading ID..."}</Text>
            </Skeleton>
        </Flex>
    );
};

export default memo(InstitutionInfo);
