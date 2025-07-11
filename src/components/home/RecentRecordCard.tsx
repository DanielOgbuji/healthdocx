import { Card, Text, Badge, VStack, Box, Button } from "@chakra-ui/react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { formatDate } from "@/utils/date";

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
                <Button variant="solid" shadow="lg" size="sm" colorPalette="brand" w="fit-content">
                    <Box as="span" fontSize="sm">View full record</Box> <MdOutlineArrowOutward />
                </Button>
            </Card.Body >
        </Card.Root >
    );
};

export default RecentRecordCard;