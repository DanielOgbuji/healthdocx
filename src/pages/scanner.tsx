import { useState, useEffect, useRef } from "react";
import { Flex, Text, Button, HStack, Box, Alert } from "@chakra-ui/react";
import { FiCamera, FiList, FiRefreshCw } from "react-icons/fi";
import useFileUpload from "@/hooks/useFileUpload"; // Import useFileUpload
import { type FileChangeDetails } from "@zag-js/file-upload"; // Import FileChangeDetails
import UploadDialog from "@/components/home/UploadDialog"; // Import UploadDialog

// Declare scannerjs globally if it's loaded via a script tag
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
declare const scanner: any; // Added no-unused-vars for global declaration

const Scanner = () => {
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState("Initializing scanner...");
    const [statusType, setStatusType] = useState<"ready" | "error" | "info">("info");
    const [logs, setLogs] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    // Initialize useFileUpload hook
    const {
        open, // Keep open state to pass to UploadDialog
        setOpen, // Keep setOpen to control UploadDialog visibility
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

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        setLogs(prev => [...prev, logEntry]);

        // Auto-scroll to bottom
        setTimeout(() => {
            if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    const updateStatus = (type: "ready" | "error" | "info", message: string) => {
        setStatusType(type);
        setStatus(message);
    };

    // Initialize scanner on component mount
    useEffect(() => {
        if (initialized.current) {
            return;
        }
        initialized.current = true;
        addLog("Page loaded, initializing scanner...");

        // Configure scanner
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).scannerjs_config = {
            log_level: 0,  // Enable debug logging
            java_applet_enabled: false,  // Use WebSocket method
            scan_app_enabled: true,
            eager_init: true
        };

        // Set up event listener
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).scannerjs_event_listener = function(event: string, data: any) {
            addLog('Event: ' + event + ' - ' + JSON.stringify(data));

            switch(event) {
                case 'loaded':
                    addLog('Scanner.js library loaded successfully');
                    break;
                case 'ready':
                    addLog('Scanner is ready to use!');
                    updateStatus('ready', 'Scanner ready - Click "Scan Document" to start');
                    setIsReady(true);
                    break;
                case 'disconnected':
                    addLog('Scanner disconnected');
                    updateStatus('error', 'Scanner disconnected - Please check your setup');
                    setIsReady(false);
                    break;
                case 'failed-to-connect':
                    addLog('Failed to connect to scanner service');
                    updateStatus('error', 'Cannot connect to scanner service. Please install the scan application.');
                    break;
                case 'failed-to-connect-final':
                    addLog('Final connection attempt failed');
                    updateStatus('error', 'Scanner setup required. Please install the scan application from the setup dialog.');
                    break;
            }
        };

        // Load scanner.js script dynamically if not already present
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).scanner) {
            const script = document.createElement('script');
            script.src = "/src/scannerjs/scanner.js"; // Adjust path as necessary
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                addLog("scanner.js script loaded.");
            };
            script.onerror = (event: Event | string) => {
                const errorMessage = typeof event === 'string' ? event : event.type;
                addLog("Failed to load scanner.js script: " + errorMessage);
                updateStatus("error", "Failed to load scanner library.");
            };
        } else {
            addLog("scanner.js already loaded.");
            // If scanner is already loaded, check its ready state
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((window as any).scanner && (window as any).scanner.isReady()) {
                setIsReady(true);
                updateStatus('ready', 'Scanner ready - Click "Scan Document" to start');
            }
        }

        // Cleanup function
        return () => {
            // Remove event listener if component unmounts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).scannerjs_event_listener = null;
        };
    }, []);

    const startScan = () => {
        if (!isReady || isScanning) {
            addLog("Scanner not ready yet or scan in progress.");
            return;
        }

        setIsScanning(true);
        addLog("Starting scan...");
        updateStatus("info", "Scanning document...");

        const scanConfig = {
            resolution: 200,
            format: 'jpg', // This format is for the scanner, but output_settings controls the return format
            mode: 'color',
            brightness: 0,
            contrast: 0,
            pages: 1,
            "output_settings" : // Crucial for returning base64 data
            [
                {
                    "type" : "return-base64",
                    "format" : "jpg"
                }
            ]
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).scanner) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).scanner.scan(function(success: boolean, message: string, response: any) { // Changed images to response
                addLog('Scan callback - Success: ' + success + ', Message: ' + message);
                //addLog('Raw scan response: ' + JSON.stringify(response)); // Log raw response
                setIsScanning(false);

                if (success) {
                    try {
                        // Use scannerjs.getScannedImages to extract image objects
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const scannedImages: any[] = (window as any).scannerjs.getScannedImages(response, true, false); // Get original images

                        if (scannedImages && scannedImages.length > 0) {
                            const firstImage = scannedImages[0];
                            //addLog('First processed image object: ' + JSON.stringify(firstImage));

                            // Extract base64 data and mime type
                            const mimeType = firstImage.getMimeType();
                            const fileName = `scanned-document-${new Date().toISOString()}.jpg`;

                            // Convert base64 to Blob, then to File
                            let base64Content = firstImage.getBase64NoPrefix();
                            // Remove any whitespace characters from the base64 string
                            if (typeof base64Content === 'string') {
                                base64Content = base64Content.replace(/\s/g, '');
                            } else {
                                // If getBase64NoPrefix() doesn't work, try to access the base64 data from the raw response
                                addLog('getBase64NoPrefix() returned non-string, trying alternative approach');
                                try {
                                    // Parse the raw response to extract the base64 data directly
                                    const rawResponse = JSON.parse(response);
                                    if (rawResponse.output && rawResponse.output.length > 0 &&
                                        rawResponse.output[0].result && Array.isArray(rawResponse.output[0].result) &&
                                        rawResponse.output[0].result.length > 0) {
                                        base64Content = rawResponse.output[0].result[0];
                                        if (typeof base64Content === 'string') {
                                            base64Content = base64Content.replace(/\s/g, '');
                                            addLog('Successfully extracted base64 data from raw response');
                                        } else {
                                            throw new Error('Base64 content from raw response is not a string: ' + typeof base64Content);
                                        }
                                    } else {
                                        throw new Error('Raw response does not contain expected base64 data structure');
                                    }
                                } catch (parseError) {
                                    throw new Error('Failed to extract base64 data: ' + parseError);
                                }
                            }

                            const byteString = atob(base64Content);
                            const ab = new ArrayBuffer(byteString.length);
                            const ia = new Uint8Array(ab);
                            for (let i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }
                            const blob = new Blob([ia], { type: mimeType });
                            const scannedFile = new File([blob], fileName, { type: mimeType });

                            // Pass the scanned file to useFileUpload
                            const details: FileChangeDetails = { acceptedFiles: [scannedFile], rejectedFiles: [] };
                            handleFileChange(details);
                            setOpen(true); // Open the UploadDialog
                            console.log("Scanner: setOpen(true) called after successful scan.");
                            updateStatus('ready', 'Scan completed - ' + scannedImages.length + ' page(s) scanned');
                        } else {
                            addLog('No valid image data extracted from scan response.');
                            updateStatus('error', 'No image data received.');
                        }
                    } catch (processError) {
                        addLog('Failed to process scanned images: ' + processError);
                        updateStatus('error', 'Failed to process scan data.');
                    }
                } else {
                    addLog('Scan failed: ' + message);
                    updateStatus('error', 'Scan failed: ' + message);
                }
            }, JSON.stringify(scanConfig));
        } else {
            addLog("Scanner object not found. Ensure scanner.js is loaded.");
            updateStatus("error", "Scanner not available.");
            setIsScanning(false);
        }
    };

    const listScanners = () => {
        if (!isReady || isScanning) {
            addLog("Scanner not ready yet or scan in progress.");
            return;
        }

        addLog('Listing available scanners...');
        updateStatus("info", "Listing scanners...");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).scanner) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).scanner.listSources(function(success: boolean, message: string, sources: any) {
                addLog('List sources callback - Success: ' + success + ', Message: ' + message);
                addLog('Raw sources data: ' + JSON.stringify(sources)); // Log raw sources data

                if (success) {
                    if (Array.isArray(sources) && sources.length > 0) { // Handle array of sources
                        let scannerListMessage = `Found ${sources.length} scanner(s): `;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        sources.forEach(function(source: any, index: number) {
                            addLog((index + 1) + '. ' + source.name + ' (' + source.type + ')');
                            scannerListMessage += `${source.name} (${source.type})${index < sources.length - 1 ? ', ' : ''}`;
                        });
                        updateStatus('ready', scannerListMessage); // Update status with scanner names
                    } else if (typeof sources === 'string' && sources.length > 0) { // Handle single scanner as string
                        addLog('Found 1 scanner: ' + sources);
                        updateStatus('ready', `Found 1 scanner: ${sources}`);
                    } else {
                        addLog('No scanners found or unexpected data format.');
                        updateStatus('error', 'No scanners found.');
                    }
                } else {
                    addLog('Failed to list scanners: ' + message);
                    updateStatus('error', 'Failed to list scanners: ' + message);
                }
            });
        } else {
            addLog("Scanner object not found. Ensure scanner.js is loaded.");
            updateStatus("error", "Scanner not available.");
        }
    };

    const testConnection = () => {
        addLog('Testing scanner connection...');
        updateStatus("info", "Testing connection...");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).scanner) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).scanner.getSystemInfo(function(success: boolean, message: string, info: any) {
                addLog('System info callback - Success: ' + success + ', Message: ' + message);

                if (success) {
                    addLog('System info retrieved successfully');
                    addLog('Scanner service is running properly');
                    if (info) { // Check if info object exists
                        addLog(`Scanner Name: ${info.scannerName || 'N/A'}`);
                        addLog(`Scanner Version: ${info.scannerVersion || 'N/A'}`);
                        addLog(`OS: ${info.os || 'N/A'}`);
                    }
                    updateStatus('ready', 'Scanner service is running');
                    setIsReady(true);
                } else {
                    addLog('Cannot retrieve system info: ' + message);
                    updateStatus('error', 'Scanner service not available');
                    setIsReady(false);
                }
            });
        } else {
            addLog("Scanner object not found. Ensure scanner.js is loaded.");
            updateStatus("error", "Scanner not available.");
            setIsReady(false);
        }
    };

    return (
        <Flex w="full" h="full" direction="column">
            <Flex mt="72px" direction="column" gap="4" w="full" p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
                <Box className="container" p="8" borderRadius="8px" boxShadow="0 2px 10px rgba(0,0,0,0.1)" colorPalette="brand">
                    <Text as="h1" fontSize="2xl" fontWeight="bold" mb="6">Scan your document</Text>

                    <Alert.Root status={statusType === "ready" ? "success" : statusType === "error" ? "error" : "info"} variant="surface">
                        <Alert.Indicator />
                        <Alert.Title>{status}</Alert.Title>
                    </Alert.Root>

                    <HStack
                        className="controls"
                        gap={{ base: 3, md: 4 }}
                        my={{ base: 4, md: 6 }}
                        p={{ base: 3, md: 4 }}
                        borderRadius="8px"
                        bg="gray.50"
                        _dark={{ bg: "gray.900" }}
                        flexWrap="wrap"
                        justify="center"
                    >
                        <Button
                            id="scanBtn"
                            onClick={startScan}
                            disabled={!isReady || isScanning}
                            size={{ base: "md", md: "lg" }}
                            minW={{ base: "full", sm: "auto" }}
                        >
                            <FiCamera /> Scan Document
                        </Button>
                        <Button
                            id="listBtn"
                            onClick={listScanners}
                            disabled={!isReady || isScanning}
                            variant="ghost"
                            size={{ base: "md", md: "lg" }}
                            minW={{ base: "full", sm: "auto" }}
                        >
                            <FiList /> List Scanners
                        </Button>
                        <Button
                            id="testBtn"
                            onClick={testConnection}
                            size={{ base: "md", md: "lg" }}
                            variant="surface"
                            minW={{ base: "full", sm: "auto" }}
                        >
                            <FiRefreshCw /> Test Connection
                        </Button>
                    </HStack>

                    <Box id="log" className="log" ref={logContainerRef}
                         borderWidth="1px" borderColor="surfaceVariant" borderRadius="4px" p="10px" h="200px" overflowY="auto" fontFamily="monospace" fontSize="sm"
                    >
                        {logs.map((logEntry, index) => (
                            <Text key={index} fontSize="xs">{logEntry}</Text>
                        ))}
                    </Box>

                    {/* The UploadDialog will handle displaying the scanned image and upload status */}
                </Box>
            </Flex>
            {/* Render UploadDialog to show scan/upload progress */}
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
    );
};

export default Scanner;
