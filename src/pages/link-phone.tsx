import {
  Box,
  Flex,
  Heading,
  Text,
  Timeline,
  Image,
  Spinner,
  PinInput,
  usePinInput,
  Stack,
  VStack,
  Alert,
  Tabs,
  Button,
  IconButton,
  HStack,
  Card,
  Dialog,
  Portal,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  generateCode,
  type GenerateCodeResponse,
  cancelTransferSession,
  getTransferSessions,
  type TransferSession,
} from "@/api/transfer";
import { toaster } from "@/components/ui/toaster";
import useFileUpload from "@/hooks/useFileUpload";
import UploadDialog from "@/components/home/UploadDialog";
import { PiSparkle, PiX, PiClock, PiCheckCircle, PiWarning } from "react-icons/pi";
import { LuRefreshCcw } from "react-icons/lu";

type SessionStatus =
  | "idle"
  | "waiting"
  | "connected"
  | "transferring"
  | "completed"
  | "expired"
  | "cancelled";

interface TransferFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  imageUrl?: string;
  status?: string;
}

interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

const LinkPhone = () => {
  const [qrCodeData, setQrCodeData] = useState<GenerateCodeResponse | null>(
    null
  );
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<TransferFile[]>([]);

  // Session management state
  const [isLoading, setIsLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<TransferSession[]>([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  // Removed unused currentFile state
  const wsRef = useRef<WebSocket | null>(null);

  // File upload functionality
  const {
    open: uploadDialogOpen,
    setOpen: setUploadDialogOpen,
    handleFileChange,
    handleCloseDialog,
    handleRetry,
    handleConfirmCrop,
    handleCancelCrop,
    uploadStatus,
    errorMessage,
    fileSize,
    fileName,
    fileType,
    filePreview,
    uploadProgress,
  } = useFileUpload();

  const store = usePinInput({
    value: qrCodeData?.code?.split("") || [],
  });

  // Format countdown time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get alert configuration based on session status
  const getSessionAlert = () => {
    switch (sessionStatus) {
      case "waiting":
        return {
          status: "info" as const,
          title: "Initialize Connection",
          description: "Prepare secure connection for file transfer..."
        };
      case "connected":
        return {
          status: "success" as const,
          title: "Mobile Device Connected",
          description: "Ready to receive files from your mobile device."
        };
      case "transferring":
        return {
          status: "info" as const,
          title: "File Transfer in Progress",
          description: "Processing files from your mobile device."
        };
      case "completed":
        return {
          status: "success" as const,
          title: "Transfer Completed",
          description: "All files have been successfully transferred."
        };
      case "expired":
        return {
          status: "warning" as const,
          title: "Session Expired",
          description: "Generating new secure connection code."
        };
      case "cancelled":
        return {
          status: "error" as const,
          title: "Connection Cancelled",
          description: "The connection has been terminated."
        };
      default:
        return {
          status: "info" as const,
          title: "Ready to Connect",
          description: "Scan the QR code or enter the pairing code to connect your mobile device."
        };
    }
  };

  // --- Generate transfer code (desktop.html equivalent)
  const fetchQrCode = useCallback(async () => {
    try {
      setSessionStatus("waiting");
      const response = await generateCode();
      setQrCodeData(response);

      const expiresAtDate = new Date(response.expiresAt);
      const now = new Date();
      const remainingMilliseconds = expiresAtDate.getTime() - now.getTime();
      const remainingSeconds = Math.max(
        0,
        Math.floor(remainingMilliseconds / 1000)
      );
      setCountdown(remainingSeconds);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
      setError("Failed to generate QR code. Please login first.");
      setSessionStatus("cancelled");
    }
  }, []);

  // Countdown timer based solely on expiry time
  useEffect(() => {
    let intervalId: number | null = null;

    if (qrCodeData?.expiresAt && countdown > 0) {
      intervalId = setInterval(() => {
        const expiresAtDate = new Date(qrCodeData.expiresAt);
        const now = new Date();
        const remainingMilliseconds = expiresAtDate.getTime() - now.getTime();
        const remainingSeconds = Math.max(0, Math.floor(remainingMilliseconds / 1000));

        setCountdown(remainingSeconds);

        // Stop the timer when it reaches 0
        if (remainingSeconds === 0) {
          if (intervalId) clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrCodeData?.expiresAt, countdown]);

  interface FileUploadedMessage {
    fileId: string;
    filename: string;
    fileSize: number;
    mimeType: string;
    imageUrl?: string;
  }

  const addUploadedFile = useCallback((msg: FileUploadedMessage) => {
    const file: TransferFile = {
      id: msg.fileId,
      name: msg.filename,
      size: msg.fileSize,
      mimeType: msg.mimeType,
      imageUrl: msg.imageUrl,
      status: "Uploaded",
    };
    setFiles((prev) => [...prev, file]);
  }, []);

  const updateFileStatus = useCallback((fileId: string, status: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status } : f))
    );
  }, []);

  // Handle WebSocket messages (ported from desktop.html)
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case "session_joined":
        setSessionStatus("waiting");
        break;

      case "connection_update":
        if (message.connectionType === "mobile") {
          setSessionStatus("connected");
        }
        break;

      case "file_uploaded":
        addUploadedFile({
          fileId: message.fileId as string,
          filename: message.filename as string,
          fileSize: message.fileSize as number,
          mimeType: message.mimeType as string,
          imageUrl: message.imageUrl as string | undefined,
        });
        break;

      case "extraction_started":
        updateFileStatus(message.fileId as string, "Extracting data…");
        break;

      case "extraction_complete":
        updateFileStatus(message.fileId as string, "Extraction complete");
        break;

      case "extraction_error":
        updateFileStatus(message.fileId as string, "Extraction failed");
        break;

      case "upload_error":
        setError("Error uploading file");
        setSessionStatus("cancelled");
        break;

      case "transfer_complete":
        setSessionStatus("completed");
        break;

      case "error":
        setError(typeof message.message === "string" ? message.message : "Unknown error");
        setSessionStatus("cancelled");
        break;

      default:
        console.log("Unhandled WS message:", message);
    }
  }, [addUploadedFile, setSessionStatus, updateFileStatus, setError]);

  // --- Connect to WebSocket (immediate, like desktop.html)
  const connectWebSocket = useCallback(() => {
    if (!qrCodeData?.sessionId) return;

    const ws = new WebSocket("wss://healthdocx-node.onrender.com/ws/transfer");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_session",
          sessionId: qrCodeData.sessionId,
          connectionType: "dashboard",
        })
      );
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onclose = () => {
      setSessionStatus("cancelled");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("WebSocket connection error");
      setSessionStatus("cancelled");
    };
  }, [qrCodeData?.sessionId, handleWebSocketMessage]);

  // Auto-generate code on component mount
  useEffect(() => {
    fetchQrCode();
  }, [fetchQrCode]);

  // Kick off when QR is generated
  useEffect(() => {
    if (qrCodeData?.sessionId) {
      connectWebSocket();
    }
  }, [qrCodeData?.sessionId, connectWebSocket]);

  // Show toast for errors
  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Connection Error",
        description: error,
        type: "error",
        duration: 5000,
      });
    }
  }, [error]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Function to handle extracting a received file
  const handleExtractFile = async (file: TransferFile) => {
    try {
      // Fetch the actual image data from the imageUrl
      const response = await fetch(file.imageUrl!);
      const blob = await response.blob();

      // Create a proper File object with the actual image data
      const imageFile = new File(
        [blob],
        file.name,
        { type: file.mimeType }
      );

      // Use the existing handleFileChange function to trigger the upload dialog
      await handleFileChange({
        acceptedFiles: [imageFile],
        rejectedFiles: [],
      });
    } catch (error) {
      console.error("Error extracting file:", error);
      toaster.create({
        title: "Extraction Failed",
        description: "Could not start extraction for this file.",
        type: "error",
        duration: 5000,
      });
    }
  };

  // Function to load transfer sessions (last 10 only)
  const loadSessions = useCallback(async (forceRefresh = false) => {
    // Only load if sessions haven't been loaded yet, or if force refresh is requested
    if (sessionsLoaded && !forceRefresh) {
      return;
    }

    try {
      setIsLoading(true);
      const sessionsData = await getTransferSessions();

      // Sort by creation date (newest first) and take only the last 10
      const sortedSessions = sessionsData
        .sort((a: TransferSession, b: TransferSession) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      setSessions(sortedSessions);
      setSessionsLoaded(true);
    } catch (error) {
      console.error("Error loading sessions:", error);
      toaster.create({
        title: "Session Error",
        description: "Could not load transfer sessions.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionsLoaded]);

  // Function to cancel current session
  const handleCancelSession = useCallback(async () => {
    if (!qrCodeData?.sessionId) return;

    try {
      setIsLoading(true);
      await cancelTransferSession(qrCodeData.sessionId);

      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Reset state
      setSessionStatus("cancelled");
      setQrCodeData(null);
      setFiles([]);
      setCountdown(0);

      toaster.create({
        title: "Session Cancelled",
        description: "Transfer session has been successfully cancelled.",
        type: "success",
        duration: 5000,
      });

      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling session:", error);
      toaster.create({
        title: "Cancellation Failed",
        description: "Could not cancel the transfer session.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [qrCodeData?.sessionId]);

  // Function to get session status badge
  const getSessionStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge colorPalette="yellow"><PiClock /> Waiting</Badge>;
      case "connected":
        return <Badge colorPalette="green"><PiCheckCircle /> Connected</Badge>;
      case "completed":
        return <Badge colorPalette="blue"><PiCheckCircle /> Completed</Badge>;
      case "cancelled":
        return <Badge colorPalette="red"><PiX /> Cancelled</Badge>;
      default:
        return <Badge colorPalette="gray">{status}</Badge>;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to handle sessions tab click (load only if not loaded)
  const handleSessionsTabClick = () => {
    loadSessions(false);
  };

  // Function to handle refresh button click (force refresh)
  const handleRefreshClick = () => {
    loadSessions(true);
  };

  // Function to handle canceling individual session
  const handleCancelIndividualSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      await cancelTransferSession(sessionId);

      // If this is the current active session, clean it up
      if (qrCodeData?.sessionId === sessionId) {
        if (wsRef.current) {
          wsRef.current.close();
        }
        setSessionStatus("cancelled");
        setQrCodeData(null);
        setFiles([]);
        setCountdown(0);
      }

      // Reload sessions to reflect the change
      await loadSessions(true);

      toaster.create({
        title: "Session Cancelled",
        description: "Session has been successfully cancelled.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error cancelling session:", error);
      toaster.create({
        title: "Cancellation Failed",
        description: "Could not cancel the session.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [qrCodeData?.sessionId, loadSessions]);

  return (
    <Flex w="full" h="full" pt="72px" justifyContent="center" alignItems="center">
      <Flex w="full" h="full" p="6vw">
        <Flex
          w="full"
          h="full"
          shadow="md"
          bgColor="bg.surface"
          borderWidth="thin"
          borderColor="outline/20"
          rounded="md"
          px="10"
          py="10"
          gap="4"
          direction={{ lgDown: "column" }}
        >
          <Flex direction="column" flex="1" gap="8" p="8" px="10">
            <Flex direction="column" gap="2">
              <Heading size="lg">Connect Your Mobile Device</Heading>
              <Text color="outline">
                Use your mobile device to capture patient records and send them
                instantly to your desktop.
              </Text>
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
            <Tabs.Root defaultValue="connection" variant="outline" size="sm" colorPalette="brand">
              <Tabs.List>
                <Tabs.Trigger value="connection">Connection</Tabs.Trigger>
                <Tabs.Trigger value="sessions" onClick={handleSessionsTabClick}>
                  Sessions
                </Tabs.Trigger>
                <Tabs.Trigger value="files">
                  Files {files.length > 0 && `(${files.length})`}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="connection">
                <Flex direction="column" gap="6">
                  {/* Session Status Alert */}
                  <Alert.Root status={getSessionAlert().status} variant="surface" mb="2">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>{getSessionAlert().title}</Alert.Title>
                      <Alert.Description>{getSessionAlert().description}</Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  {sessionStatus === "waiting" && !qrCodeData ? (
                    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
                      <VStack>
                        <Spinner borderWidth="4px" color="primary" size="xl" />
                        <Text color="primary" textAlign="center">Generating Code</Text>
                      </VStack>
                    </Stack>
                  ) : error ? (
                    <VStack gap="4" alignItems="center">
                      <Text color="red.500" textAlign="center">{error}</Text>
                      <Button
                        colorPalette="red"
                        variant="outline"
                        onClick={() => {
                          setError(null);
                          setSessionStatus("idle");
                          fetchQrCode();
                        }}
                      >
                        Retry
                      </Button>
                    </VStack>
                  ) : (
                    <Flex direction="column" gap="6" alignItems="center">
                      {qrCodeData?.qrCode && (
                        <Box position="relative" display="inline-block">
                          <Image src={qrCodeData.qrCode} alt="QR Code" boxSize="160px" borderStyle="solid" borderWidth="6px" borderColor="backface" />
                          {/* Corner handles */}
                          <Box
                            position="absolute"
                            top="-3px"
                            left="-3px"
                            w="20px"
                            h="20px"
                            bg="primary"
                            zIndex="-1"
                          />
                          <Box
                            position="absolute"
                            top="-3px"
                            right="-3px"
                            w="20px"
                            h="20px"
                            bg="primary"
                            zIndex="-1"
                          />
                          <Box
                            position="absolute"
                            bottom="-3px"
                            left="-3px"
                            w="20px"
                            h="20px"
                            bg="primary"
                            zIndex="-1"
                          />
                          <Box
                            position="absolute"
                            bottom="-3px"
                            right="-3px"
                            w="20px"
                            h="20px"
                            bg="primary"
                            zIndex="-1"
                          />
                        </Box>
                      )}
                      {qrCodeData?.code && (
                        <Flex direction="column" gap="4" alignItems="center">
                          <Text fontSize="md" fontWeight="medium">Or enter pair code</Text>
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
                            <Text fontSize="sm" color="fg.muted">
                              New code in <Box as="span" color="fg.error" fontWeight="semibold">{formatTime(countdown)}</Box>
                            </Text>
                          </PinInput.RootProvider>
                        </Flex>
                      )}

                      {/* Session Management Controls */}
                      <Flex gap="3" justify="center" wrap="wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          colorPalette="red"
                          onClick={() => setCancelDialogOpen(true)}
                          disabled={sessionStatus === "cancelled" || sessionStatus === "completed"}
                        >
                          <PiX /> Cancel Session
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setError(null);
                            setSessionStatus("idle");
                            fetchQrCode();
                          }}
                        >
                          <PiClock /> New Session
                        </Button>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="sessions" pt="6">
                <VStack gap="4" align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="semibold" color="fg">
                      Transfer Sessions
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRefreshClick}
                      loading={isLoading}
                    >
                      <LuRefreshCcw /> Refresh
                    </Button>
                  </Flex>

                  {isLoading ? (
                    <Stack alignItems="center" justifyContent="center" py="8">
                      <Spinner size="lg" color="primary" />
                      <Text color="fg.muted">Loading sessions...</Text>
                    </Stack>
                  ) : sessions.length > 0 ? (
                    <VStack gap="3" align="stretch" maxH="400px" overflowY="auto">
                      {sessions.map((session) => (
                        <Card.Root
                          key={session.id}
                          variant="outline"
                          size="sm"
                        >
                          <Card.Body>
                            <VStack align="start" gap="2">
                              <Flex justify="space-between" align="center" w="full">
                                <Text fontWeight="semibold" fontSize="sm">
                                  Session {session.id.slice(-8)}
                                </Text>
                                <HStack gap="2">
                                  {getSessionStatusBadge(session.status)}
                                  {/* Only show cancel button for active sessions */}
                                  {(session.status === "waiting" || session.status === "connected") && (
                                    <IconButton
                                      size="xs"
                                      variant="ghost"
                                      colorPalette="red"
                                      onClick={() => handleCancelIndividualSession(session.id)}
                                      aria-label="Cancel session"
                                      loading={isLoading}
                                    >
                                      <PiX />
                                    </IconButton>
                                  )}
                                </HStack>
                              </Flex>
                              <Text fontSize="xs" color="fg.muted">
                                Created: {formatDate(session.createdAt)}
                              </Text>
                              {session.connectedAt && (
                                <Text fontSize="xs" color="fg.muted">
                                  Connected: {formatDate(session.connectedAt)}
                                </Text>
                              )}
                              <Text fontSize="xs" color="fg.muted">
                                Expires: {formatDate(session.expiresAt)}
                              </Text>
                            </VStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                  ) : (
                    <Flex direction="column" align="center" justify="center" py="12" gap="4">
                      <Text fontSize="lg" color="fg.muted" textAlign="center">
                        No sessions found
                      </Text>
                      <Text fontSize="sm" color="fg.subtle" textAlign="center">
                        Transfer sessions will appear here
                      </Text>
                    </Flex>
                  )}
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="files" pt="6">
                {files.length > 0 ? (
                  <VStack gap="4" align="stretch">
                    <Text fontSize="lg" fontWeight="semibold" color="fg">
                      Received Files
                    </Text>
                    <VStack gap="3" align="stretch" maxH="400px" overflowY="auto">
                      {files.map((file) => (
                        <Card.Root
                          key={file.id}
                          variant="outline"
                          size="sm"
                        >
                          <Card.Body>
                            <HStack justify="space-between" align="center">
                              <VStack align="start" gap="1" flex="1">
                                <Text fontWeight="semibold" fontSize="sm">{file.name}</Text>
                                <Text fontSize="xs" color="fg.muted">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimeType}
                                </Text>
                              </VStack>
                              <HStack gap="2">
                                <Text fontSize="xs" color="fg.muted">
                                  {file.status}
                                </Text>
                                <IconButton
                                  size="xs"
                                  variant="ghost"
                                  colorPalette="blue"
                                  onClick={() => handleExtractFile(file)}
                                  aria-label="Extract file"
                                >
                                  <PiSparkle />
                                </IconButton>
                              </HStack>
                            </HStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                  </VStack>
                ) : (
                  <Flex direction="column" align="center" justify="center" py="12" gap="4">
                    <Text fontSize="lg" color="fg.muted" textAlign="center">
                      No files received yet
                    </Text>
                    <Text fontSize="sm" color="fg.subtle" textAlign="center">
                      Files uploaded from your mobile device will appear here
                    </Text>
                  </Flex>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Flex>
        </Flex>
      </Flex>

      {/* Upload Dialog for file extraction */}
      <UploadDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        uploadStatus={uploadStatus}
        errorMessage={errorMessage}
        fileSize={fileSize}
        fileName={fileName}
        fileType={fileType}
        filePreview={filePreview}
        uploadProgress={uploadProgress}
        onClose={handleCloseDialog}
        onRetry={handleRetry}
        handleConfirmCrop={handleConfirmCrop}
        handleCancelCrop={handleCancelCrop}
      />

      {/* Cancel Session Confirmation Dialog */}
      <Dialog.Root open={cancelDialogOpen} onOpenChange={(details) => setCancelDialogOpen(details.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header display="flex" flexDirection="column" gap="2">
                <Dialog.Title>Cancel Transfer Session</Dialog.Title>
                <Dialog.Description>
                  Are you sure you want to cancel the current transfer session?
                  This will disconnect any connected mobile devices and end the file transfer process.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="4" align="stretch">
                  <Alert.Root status="warning" variant="subtle">
                    <Alert.Indicator>
                      <PiWarning />
                    </Alert.Indicator>
                    <Alert.Content>
                      <Alert.Title>Warning</Alert.Title>
                      <Alert.Description>
                        This action cannot be undone. Any files currently being transferred will be lost.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                  <Text fontSize="sm" color="fg.muted">
                    Session ID: <strong>{qrCodeData?.sessionId?.slice(-8) || 'N/A'}</strong>
                  </Text>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                    Keep Session
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleCancelSession}
                  loading={isLoading}
                  loadingText="Cancelling..."
                >
                  <PiX /> Cancel Session
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};

export default LinkPhone;
