/**
 * Scanner.js Configuration Examples
 *
 * Copy this file and modify the settings according to your needs.
 * Include this file BEFORE scanner.js in your HTML.
 */

// Basic configuration for modern browsers (WebSocket method)
window.scannerjs_config = {
    // Logging level (0 = all logs, 1024 = no logs)
    log_level: 0,

    // Enable Java applet method (legacy browsers)
    java_applet_enabled: false,

    // Enable WebSocket scan app method (modern browsers)
    scan_app_enabled: true,

    // Download URL for the scan application
    scan_app_download_url: 'http://cdn.asprise.com/scanapp/scan-setup.exe',

    // Minimum version required for scan app
    scan_app_min_version: '2.04',

    // License key (if required)
    license: null,

    // Auto-initialize on page load
    eager_init: true,

    // Skip loading default CSS
    skip_load_default_css: false,

    // Port range for WebSocket connections
    scan_app_port_range_lowest: 9713,
    scan_app_port_range_highest: 9716,

    // Base name for scanned files
    file_name_base: 'scanner',

    // Form field names for image uploads
    form_field_name_for_img_objects: 'com_asprise_scannerjs_images[]',
    form_field_name_for_img_urls: 'com_asprise_scannerjs_images_urls[]',

    // Maximum connection attempts
    max_conn_attempts: -1, // -1 = unlimited

    // Custom event listener function
    event_listener: null,

    // Custom functions for UI display
    display_install_func: null,
    display_scan_ready_func: null,

    // System response callback
    sys_response_callback_func: null,

    // Reverse request handler
    reverse_request_handler_func: null,

    // Additional CSS classes for dialogs
    additional_css_classes_for_dialogs: ''
};

/**
 * Advanced Configuration Example
 *
 * This example shows how to customize scanner.js for specific use cases
 */

// Example 1: Production configuration with minimal logging
window.scannerjs_config_production = {
    log_level: 1024,  // Disable all logging
    java_applet_enabled: false,
    scan_app_enabled: true,
    eager_init: false,  // Initialize manually when needed
    license: 'YOUR_LICENSE_KEY_HERE'  // Add your license key
};

// Example 2: Development configuration with full logging
window.scannerjs_config_development = {
    log_level: 0,  // Enable all logging
    java_applet_enabled: true,  // Enable both methods for testing
    scan_app_enabled: true,
    eager_init: true,
    skip_load_default_css: false
};

// Example 3: Custom event handling
window.scannerjs_config_custom_events = {
    log_level: 0,
    event_listener: function(event, data) {
        console.log('Custom event handler - Event:', event, 'Data:', data);

        switch(event) {
            case 'ready':
                console.log('Scanner is ready! You can now start scanning.');
                // Update your UI to show scan button
                document.getElementById('scan-button').disabled = false;
                break;

            case 'disconnected':
                console.log('Scanner disconnected');
                // Update your UI to show disconnected state
                document.getElementById('scan-button').disabled = true;
                break;

            case 'func-call':
                console.log('Scanner function called:', data.funcName);
                break;

            case 'func-return':
                console.log('Scanner function returned:', data);
                break;
        }
    }
};

// Example 4: Custom UI functions
window.scannerjs_config_custom_ui = {
    display_install_func: function(showDialog) {
        if (showDialog) {
            // Show your custom installation dialog
            showCustomInstallDialog();
        }
        return true; // Return false to prevent default dialog
    },

    display_scan_ready_func: function() {
        // Show your custom "ready" notification
        showCustomReadyNotification();
    }
};

/**
 * Scan Configuration Examples
 *
 * These are examples of scan settings you can use with scanner.scan()
 */

// Example scan configuration for high-quality document scanning
var highQualityScanConfig = {
    resolution: 300,           // High DPI for quality
    format: 'pdf',             // PDF for documents
    mode: 'color',             // Color scanning
    brightness: 0,             // Neutral brightness
    contrast: 0,               // Neutral contrast
    pages: 'all',              // Scan all pages
    duplex: false,             // Single-sided
    page_size: 'a4',           // A4 paper size
    quality: 90,               // High JPEG quality
    compression: 'none',       // No compression
    show_scanner_ui: false,    // Hide scanner's native UI
    auto_crop: true,           // Auto-crop to content
    deskew: true,              // Auto-straighten pages
    remove_blank_pages: true   // Remove empty pages
};

// Example scan configuration for fast preview scanning
var previewScanConfig = {
    resolution: 150,           // Lower DPI for speed
    format: 'jpg',             // JPEG for quick preview
    mode: 'gray',              // Grayscale for smaller files
    brightness: 0,
    contrast: 0,
    pages: 1,                  // Single page
    duplex: false,
    page_size: 'a4',
    quality: 75,               // Lower quality for speed
    compression: 'jpeg',       // JPEG compression
    show_scanner_ui: false,
    auto_crop: false,          // No auto-crop for speed
    deskew: false,             // No deskew for speed
    remove_blank_pages: false
};

// Example scan configuration for photo scanning
var photoScanConfig = {
    resolution: 600,           // High DPI for photos
    format: 'png',             // PNG for lossless quality
    mode: 'color',             // Full color
    brightness: 0,
    contrast: 0,
    pages: 1,                  // Single photo
    duplex: false,
    page_size: 'a4',           // A4 paper size
    quality: 100,              // Maximum quality
    compression: 'none',       // No compression
    show_scanner_ui: true,     // Show scanner UI for manual adjustment
    auto_crop: true,           // Auto-crop to photo edges
    deskew: true,              // Straighten if needed
    remove_blank_pages: false
};

/**
 * Usage Examples
 */

// Example: Initialize scanner with custom config
function initializeWithCustomConfig() {
    // Set configuration before loading scanner.js
    window.scannerjs_config = window.scannerjs_config_development;

    // Load scanner.js
    var script = document.createElement('script');
    script.src = 'scanner.js';
    document.head.appendChild(script);
}

// Example: Start scan with custom settings
function startCustomScan() {
    scanner.scan(function(success, message, images) {
        if (success) {
            console.log('Custom scan completed:', images.length, 'images');
            // Process images...
        } else {
            console.error('Custom scan failed:', message);
        }
    }, JSON.stringify(highQualityScanConfig));
}

// Example: List scanners with custom filter
function listFilteredScanners() {
    scanner.listSources(function(success, message, sources) {
        if (success) {
            // Filter for flatbed scanners only
            var flatbedScanners = sources.filter(function(scanner) {
                return scanner.type === 'flatbed';
            });

            console.log('Flatbed scanners:', flatbedScanners);
        }
    }, true, false, 'flatbed'); // includeDetails, showUI, filter
}

// Example: Handle scan results
function handleScanResults(success, message, images) {
    if (success) {
        console.log(`Successfully scanned ${images.length} page(s)`);

        // Process each image
        images.forEach(function(image, index) {
            console.log(`Page ${index + 1}:`);
            console.log(`  - Size: ${image.getWidth()} x ${image.getHeight()}`);
            console.log(`  - Resolution: ${image.getResolution()} DPI`);
            console.log(`  - Color: ${image.isColor() ? 'Color' : 'B&W'}`);
            console.log(`  - Base64 length: ${image.getBase64NoPrefix().length} chars`);
        });

        // Display images in UI
        displayImages(images);
    } else {
        console.error('Scan failed:', message);
        alert('Scan failed: ' + message);
    }
}

// Example: Display images in web page
function displayImages(images) {
    var container = document.getElementById('scan-results');
    container.innerHTML = '';

    images.forEach(function(image, index) {
        var imgDiv = document.createElement('div');
        imgDiv.className = 'scanned-image';

        var img = document.createElement('img');
        img.src = image.src;
        img.style.maxWidth = '300px';
        img.style.margin = '10px';

        var info = document.createElement('div');
        info.className = 'image-info';
        info.innerHTML = `
            <strong>Page ${index + 1}</strong><br>
            Size: ${image.getWidth()} × ${image.getHeight()} pixels<br>
            Resolution: ${image.getResolution()} DPI<br>
            Color: ${image.isColor() ? 'Color' : image.isGray() ? 'Grayscale' : 'B&W'}
        `;

        imgDiv.appendChild(img);
        imgDiv.appendChild(info);
        container.appendChild(imgDiv);
    });
}

/**
 * Error Handling Examples
 */

// Example: Comprehensive error handling
function robustScan() {
    // Check if scanner is ready
    if (!scannerjs.getIsReady()) {
        alert('Scanner is not ready. Please wait for initialization.');
        return;
    }

    // Check if WebSocket is connected
    if (!scannerjs.isConnectedToScanWebSocket()) {
        alert('Scanner service is not connected. Please check your setup.');
        return;
    }

    // Perform scan with error handling
    scanner.scan(function(success, message, images) {
        if (success) {
            handleScanResults(success, message, images);
        } else {
            // Handle specific error types
            if (message.includes('no scanner')) {
                alert('No scanner detected. Please connect a scanner.');
            } else if (message.includes('busy')) {
                alert('Scanner is busy. Please try again later.');
            } else if (message.includes('paper')) {
                alert('Scanner out of paper or paper jam detected.');
            } else {
                alert('Scan error: ' + message);
            }
        }
    }, JSON.stringify(highQualityScanConfig));
}

/**
 * Integration Examples
 */

// Example: Integration with form submission
function scanAndSubmit() {
    scanner.scan(function(success, message, images) {
        if (success) {
            // Submit scanned images with form
            scanner.submitFormWithImages('myForm', images, function(xhr) {
                if (xhr.status === 200) {
                    alert('Images submitted successfully!');
                } else {
                    alert('Failed to submit images: ' + xhr.statusText);
                }
            });
        } else {
            alert('Scan failed: ' + message);
        }
    }, JSON.stringify(highQualityScanConfig));
}

// Example: Batch scanning multiple documents
function batchScan() {
    var batchConfig = {
        resolution: 200,
        format: 'pdf',
        mode: 'color',
        pages: 'all',
        duplex: false
    };

    // Scan first document
    scanner.scan(function(success, message, images1) {
        if (success) {
            console.log('First document scanned:', images1.length, 'pages');

            // Scan second document
            scanner.scan(function(success2, message2, images2) {
                if (success2) {
                    console.log('Second document scanned:', images2.length, 'pages');

                    // Process both batches
                    var allImages = images1.concat(images2);
                    console.log('Total pages scanned:', allImages.length);
                }
            }, JSON.stringify(batchConfig));
        }
    }, JSON.stringify(batchConfig));
}
