import {
    Box, Flex, Heading, Text, Timeline, Image, Spinner, PinInput, usePinInput, Stack, VStack
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { generateCode, type GenerateCodeResponse } from "@/api/transfer";
import { toaster } from "@/components/ui/toaster";

const LinkPhone = () => {
    const [qrCodeData, setQrCodeData] = useState<GenerateCodeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Combined loading state
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);
    const store = usePinInput({ value: qrCodeData?.code?.split('') || [] });

    const fetchQrCode = useCallback(async () => {
        setIsLoading(true); // Start loading
        setError(null);

        try {
            const response = await generateCode();
            setQrCodeData(response);

            const expiresAtDate = new Date(response.expiresAt);
            const now = new Date();
            const remainingMilliseconds = expiresAtDate.getTime() - now.getTime();
            const remainingSeconds = Math.max(0, Math.floor(remainingMilliseconds / 1000));
            setCountdown(remainingSeconds);

        } catch (err) {
            console.error("Failed to generate QR code:", err);
            const errorMessage = "Failed to load QR code. Please try again.";
            setError(errorMessage);
            toaster.create({
                title: "Error",
                description: "Failed to generate QR code.",
                type: "error",
                duration: 5000,
                closable: true,
            });
        } finally {
            setIsLoading(false); // End loading
        }
    }, [setQrCodeData, setIsLoading, setError, setCountdown]); // State setters are stable

    // Effect for initial fetch and scheduling subsequent fetches
    useEffect(() => {
        let timeoutId: number | null = null;

        const scheduleNextFetch = (delay: number) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(fetchQrCode, delay);
        };

        if (!qrCodeData) { // Initial fetch if no QR code data is present
            fetchQrCode();
        } else if (qrCodeData.expiresAt) {
            const expiresAtDate = new Date(qrCodeData.expiresAt);
            const now = new Date();
            let delay = expiresAtDate.getTime() - now.getTime();

            if (delay <= 1000) { // If expired or almost expired, fetch immediately (with a small buffer)
                delay = 1000;
            }
            scheduleNextFetch(delay);
        } else { // Fallback if expiresAt is missing after a successful fetch (shouldn't happen with current API)
            scheduleNextFetch(60000); // Default refresh every 60 seconds
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [fetchQrCode, qrCodeData]); // Depends on fetchQrCode (stable) and qrCodeData (to react to new expiration times)

    // Countdown timer effect
    useEffect(() => {
        let intervalId: number | null = null;
        if (countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prev) => Math.max(0, prev - 1));
            }, 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [countdown]); // Depends on countdown to restart when it changes (e.g., new QR code)

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Flex w="full" h="full" pt="72px" justifyContent="center" alignItems="center">
            <Flex w="full" h="full" p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
                <Flex w="full" h="full" shadow="md" bgColor="bg.surface" borderWidth="thin" borderColor="outline/20" rounded="md" px="10" py="10" gap="4" direction={{ lgDown: "column" }}>
                    <Flex direction="column" flex="1" gap="8" p="8" px="10">
                        <Flex direction='column' gap="2">
                            <Heading size="lg">Connect Your Mobile Device</Heading>
                            <Text color="outline">Use your mobile device to capture patient records and send them instantly to your desktop for extraction.</Text>
                        </Flex>
                        <Flex>
                            <Timeline.Root variant="outline" size="lg">
                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator borderStyle="dotted" borderWidth="2px" borderLeft="none" borderTop="none" borderBottom="none" ml="-1px" />
                                        <Timeline.Indicator bg="backface">
                                            1
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content display="inline-flex">
                                        <Timeline.Title gap="0">Open your mobile's browser and go to <Text color="primary" fontWeight="semibold" display="inline-flex">&nbsp;scan.healthdocx.org</Text>.</Timeline.Title>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator borderStyle="dotted" borderWidth="2px" borderLeft="none" borderTop="none" borderBottom="none" ml="-1px" />
                                        <Timeline.Indicator bg="backface">
                                            2
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content>
                                        <Timeline.Title textStyle="sm">Scan the QR code or enter the 6-digit Pair code by the side.</Timeline.Title>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator borderStyle="dotted" borderWidth="2px" borderLeft="none" borderTop="none" borderBottom="none" ml="-1px" />
                                        <Timeline.Indicator bg="backface">
                                            3
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content>
                                        <Timeline.Title textStyle="sm">Watch this code refresh every 10 minutes for security.</Timeline.Title>
                                    </Timeline.Content>
                                </Timeline.Item>
                            </Timeline.Root>
                        </Flex>
                    </Flex>
                    <Flex flex="1" direction="column" borderStyle="solid" borderWidth="thin" borderColor="outline/20" p="8" px="10" gap="4">
                        <Text fontSize="lg" fontWeight="semibold">Scan QR Code</Text>
                        <Flex direction="column" w="full" h="full" justifyContent="space-between" gap="4">
                            {isLoading ? (
                                <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
                                    <VStack>
                                        <Spinner borderWidth="4px" color="primary" size="xl" />
                                        <Text color="primary" textAlign="center">Generating Code</Text>
                                    </VStack>
                                </Stack>
                            ) : error ? (
                                <Text color="red.500">{error}</Text>
                            ) : (
                                <>
                                    {qrCodeData?.qrCode && (
                                        <Box position="relative" mx="auto" my="auto">
                                            <Image src={qrCodeData.qrCode} alt="QR Code" boxSize="200px" />
                                        </Box>
                                    )}
                                    {qrCodeData?.code && (
                                        <Flex direction="column" gap="4">
                                            <Text>Or enter pair code</Text>
                                            <PinInput.RootProvider value={store} size={{ base: "2xl", mdDown: "md" }} inert mx="auto" display="flex" flexDirection="column" gap="8" alignItems="center">
                                                <PinInput.Control inert>
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={0} disabled />
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={1} disabled />
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={2} disabled />
                                                    <Text my="auto" fontSize={{ base: "4xl", mdDown: "lg" }} color="fg/50">-</Text>
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={3} disabled />
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={4} disabled />
                                                    <PinInput.Input fontSize={{ base: "2xl", mdDown: "md" }} fontWeight="bold" index={5} disabled />
                                                </PinInput.Control>
                                                <Text>New code in <Box as="span" color="fg.error">{formatTime(countdown)}</Box></Text>
                                            </PinInput.RootProvider>
                                        </Flex>
                                    )}
                                </>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default LinkPhone;
