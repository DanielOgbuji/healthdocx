import { useState } from "react";
import { Card, Text, Badge, VStack, Box, Button } from "@chakra-ui/react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { formatDate } from "@/utils/date";
import { useNavigate } from "react-router";
import { toaster } from "@/components/ui/toaster";

interface RecentRecordCardProps {
    imageUrl: string;
    recordID: string;
    recordType: string;
    recordGroup: string;
    createdAt: string;
}

const RecentRecordCard = ({
    imageUrl,
    recordID,
    recordType,
    recordGroup,
    createdAt,
}: RecentRecordCardProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const id = recordID;
            console.log("the record id", id)

            // Navigate to the details page with the record ID
            navigate(`/records/details/${id}`);

            // Show success message
            toaster.create({
                title: "Loading Record",
                description: "Your file is being processed and will load shortly.",
                type: "success",
                duration: 5000,
            });

        } catch (error) {
            console.error("Error during loading:", error);
            setIsLoading(false);
            toaster.create({
                title: "Loading Failed",
                description: "Could not load the record. Please try again.",
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card.Root
            overflow="hidden"
            variant="outline"
            borderColor="outlineVariant"
            w="full"
            bgImage={`url(${imageUrl})`}
            bgPos="center"
            bgAttachment="fixed"
            bgSize="cover"
        >
            <Card.Body bgGradient="to-b" gradientFrom="surface" gradientTo="transparent" borderWidth="1px" gap="4" backdropFilter="blur(1.2px)">
                <VStack alignItems="start">
                    <Card.Title textTransform="capitalize" fontSize="lg" lineHeight="shorter" fontWeight="bold" color="onSurface">
                        {recordID}
                    </Card.Title >
                    <Text textTransform="capitalize" fontSize="md" lineHeight="short" fontStyle="italic" color="onSurfaceVariant" fontWeight="medium">
                        {recordType}
                    </Text>
                    <Badge bgColor="onPrimary/30" borderWidth="thin" borderColor="primary" color="primary" rounded="full" variant="subtle" textTransform="capitalize">
                        {recordGroup}
                    </Badge>
                </VStack >

                <Box>
                    <Text fontSize="sm" fontWeight="bold">
                        Created: <Box as="span" fontStyle="italic" fontWeight="medium" textShadow="lg">{formatDate(createdAt)}</Box>
                    </Text>
                </Box>
                <Button variant="solid" shadow="lg" size="sm" colorPalette="brand" w="fit-content" onClick={handleSubmit} loading={isLoading} loadingText="Loading...">
                    <Box as="span" fontSize="sm">View full record</Box> <MdOutlineArrowOutward />
                </Button>
            </Card.Body >
        </Card.Root >
    );
};

export default RecentRecordCard;