import { Flex, Text, Separator, Card, Icon } from "@chakra-ui/react";
import InfoTile from "@/components/home/InfoTile";
import { FiEdit3 } from "react-icons/fi";
import { Banner } from "@/components/home/Banner";
import SecondaryNavBar from "@/components/navigation/SecondaryNavBar";
import CostSegment from "@/components/home/CostSegment";
import RecentRecordsPane from "@/components/home/RecentRecordsPane";
import RecentActivityPane from "@/components/home/RecentActivityPane";
import useFileUpload from "@/hooks/useFileUpload";
import UploadDialog from "@/components/home/UploadDialog";
import FileDropZone from "@/components/home/FileDropZone";

const Home = () => {
    const {
        open,
        setOpen,
        uploadProgress,
        uploadStatus,
        errorMessage,
        fileSize,
        fileName,
        fileType,
        filePreview,
        croppedImage,
        handleFileChange,
        handleCloseDialog,
        handleRetry,
        handleConfirmCrop,
        handleCancelCrop,
    } = useFileUpload();

    return (
        <>
            <SecondaryNavBar />
            <Flex mt="120px" direction="column" gap="4">
                <Banner />
                <Flex w="full" direction="column" pt="8" px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} gap="4">
                    <InfoTile />
                    <CostSegment />
                    <Flex direction="column">
                        <Text fontWeight="semibold">Digitize your records</Text>
                        <Separator mt="2" />
                        <Flex direction={{ base: "column", xl: "row" }} gap="4" my="4">
                            <Flex h="fit-content" direction="column">
                                <Flex w={{ base: "full", xl: "65vw" }} gap="4" direction={{ base: "row", mdDown: "column" }} >
                                    <FileDropZone handleFileChange={handleFileChange} />
                                    <Card.Root flex={1} opacity={0.4} cursor="not-allowed" title="Coming soon!">
                                        <Card.Body gap="3" flexDirection="row" p="3" alignItems="center">
                                            <Flex h="44px" w="44px" bgColor="primary" justifyContent="center" alignItems="center" rounded="sm">
                                                <Icon size="md" color="onPrimary"><FiEdit3 /></Icon>
                                            </Flex>
                                            <Flex direction="column" gap="1">
                                                <Card.Title fontSize="sm" lineHeight="short">Create a record</Card.Title>
                                                <Card.Description fontSize="xs">
                                                    Open the editor to start or use a template
                                                </Card.Description>
                                            </Flex>
                                        </Card.Body>
                                    </Card.Root>
                                </Flex>
                                <Flex direction="column" w="full" mt="8">
                                    <Flex justifyContent="space-between">
                                        <Text fontWeight="semibold">Recent records</Text>
                                        <Text color="primary" fontSize="sm" fontWeight="semibold">See all</Text>
                                    </Flex>
                                    <Separator mt="2" />
                                    <RecentRecordsPane />
                                </Flex>
                            </Flex>
                            <Flex direction="column" w={{ base: "full", xl: "35vw" }} pl={{ base: "0", xl: "4" }}>
                                <Flex justifyContent="space-between">
                                    <Text fontWeight="semibold">Recent activity</Text>
                                    <Text color="primary" fontSize="sm" fontWeight="semibold">See all</Text>
                                </Flex>
                                <Separator mt="2" display={{ base: "none", xlDown: "flex" }} />
                                <RecentActivityPane />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <UploadDialog
                    open={open}
                    setOpen={setOpen}
                    uploadStatus={uploadStatus}
                    errorMessage={errorMessage}
                    fileSize={fileSize}
                    fileName={fileName}
                    fileType={fileType}
                    filePreview={filePreview}
                    croppedImage={croppedImage}
                    uploadProgress={uploadProgress}
                    onClose={handleCloseDialog}
                    onRetry={handleRetry}
                    handleConfirmCrop={handleConfirmCrop}
                    handleCancelCrop={handleCancelCrop}
                />
            </Flex>
        </>
    );
}

export default Home;
