# Scanner.js - Document Scanning Library

Scanner.js is a JavaScript library that enables document scanning functionality directly within web browsers. It supports both legacy Java applet-based scanning and modern WebSocket-based scanning.

## Files Overview

- **`scanner.js`** - Main JavaScript library (minified)
- **`scanner.css`** - Styling for scanning interface
- **`asprise_scan.jar`** - Java applet for NPAPI-based scanning
- **`asprise_scan-legacy.jar`** - Legacy Java applet for older browsers

## How It Works

The library uses a dual-approach:

1. **Java Applet Method** (Legacy browsers): Uses NPAPI Java applets for direct scanner communication
2. **WebSocket Method** (Modern browsers): Connects to a local scan application via WebSocket

## Basic Usage

### 1. Include the Files

```html
<!DOCTYPE html>
<html>
<head>
    <title>Document Scanner</title>
    <link rel="stylesheet" href="scanner.css">
</head>
<body>
    <h1>Document Scanner</h1>
    <button onclick="startScanning()">Scan Document</button>
    <div id="scan-results"></div>

    <script src="scanner.js"></script>
    <script>
        // Your scanning code here
    </script>
</body>
</html>
```

### 2. Basic Scanning Example

```javascript
function startScanning() {
    // Initialize the scanner library
    scanner.initialize();

    // Set up event listener for when scanner is ready
    scannerjs.event_listener = function(event, data) {
        console.log('Scanner event:', event, data);

        if (event === 'ready') {
            console.log('Scanner is ready!');
            performScan();
        }
    };

    function performScan() {
        // Define scan settings
        var scanSettings = {
            resolution: 300,
            format: 'jpg',
            brightness: 0,
            contrast: 0
        };

        // Start scanning
        scanner.scan(function(success, message, images) {
            if (success) {
                console.log('Scan successful!');
                displayImages(images);
            } else {
                console.error('Scan failed:', message);
            }
        }, JSON.stringify(scanSettings));
    }

    function displayImages(images) {
        var resultsDiv = document.getElementById('scan-results');
        resultsDiv.innerHTML = '';

        images.forEach(function(image, index) {
            var img = document.createElement('img');
            img.src = image.src;
            img.style.maxWidth = '300px';
            img.style.margin = '10px';
            resultsDiv.appendChild(img);
        });
    }
}
```

### 3. Advanced Scanning with Multiple Pages

```javascript
function advancedScanning() {
    scanner.initialize();

    scannerjs.event_listener = function(event, data) {
        if (event === 'ready') {
            startMultiPageScan();
        }
    };

    function startMultiPageScan() {
        var scanConfig = {
            mode: 'duplex', // or 'simplex'
            resolution: 200,
            format: 'pdf',
            pages: 'all' // or specific number
        };

        scanner.scan(function(success, message, images) {
            if (success) {
                console.log(`Scanned ${images.length} pages`);
                processScannedPages(images);
            } else {
                console.error('Multi-page scan failed:', message);
            }
        }, JSON.stringify(scanConfig));
    }

    function processScannedPages(images) {
        images.forEach(function(image, index) {
            console.log(`Page ${index + 1}: ${image.getWidth()}x${image.getHeight()} pixels`);
            console.log(`Resolution: ${image.getResolution()} DPI`);
            console.log(`Color depth: ${image.getBitsPerPixel()} bits`);
        });
    }
}
```

### 4. List Available Scanners

```javascript
function listScanners() {
    scanner.initialize();

    scannerjs.event_listener = function(event, data) {
        if (event === 'ready') {
            // List available scanner sources
            scanner.listSources(function(success, message, sources) {
                if (success) {
                    console.log('Available scanners:');
                    sources.forEach(function(source, index) {
                        console.log(`${index + 1}. ${source.name} (${source.type})`);
                    });
                } else {
                    console.error('Failed to list scanners:', message);
                }
            });
        }
    };
}
```

### 5. Select Specific Scanner

```javascript
function selectSpecificScanner() {
    scanner.initialize();

    scannerjs.event_listener = function(event, data) {
        if (event === 'ready') {
            // Get scanner by index (0-based)
            scanner.getSource(function(success, message, source) {
                if (success) {
                    console.log('Selected scanner:', source.name);

                    // Now scan with selected scanner
                    var scanSettings = {
                        source: source.name,
                        resolution: 300,
                        format: 'png'
                    };

                    scanner.scan(function(success, msg, images) {
                        if (success) {
                            console.log('Scan completed with selected scanner');
                        }
                    }, JSON.stringify(scanSettings));
                }
            }, 'select', true); // 'select' mode, show dialog
        }
    };
}
```

## Configuration Options

### Global Configuration

```javascript
// Configure scanner.js before initialization
window.scannerjs_config = {
    log_level: 0,                    // 0 = all logs, 1024 = no logs
    java_applet_enabled: false,      // Enable Java applet (legacy)
    scan_app_enabled: true,          // Enable WebSocket scan app
    scan_app_download_url: 'http://cdn.asprise.com/scanapp/scan-setup.exe',
    license: null,                   // License key if required
    eager_init: true,                // Initialize on page load
    file_name_base: 'scanner'        // Base name for scanned files
};
```

### Scan Configuration Parameters

```javascript
var scanConfig = {
    // Basic settings
    resolution: 300,                 // DPI (75-600)
    format: 'jpg',                   // jpg, png, pdf, tiff, bmp
    mode: 'color',                   // color, gray, blackwhite
    brightness: 0,                   // -100 to 100
    contrast: 0,                     // -100 to 100

    // Page settings
    pages: 'all',                    // 'all' or number
    duplex: false,                   // true for double-sided
    page_size: 'a4',                 // a3, a4, a5, letter, legal

    // Output settings
    quality: 85,                     // 1-100 (JPEG only)
    compression: 'none',             // none, lzw, jpeg, zip

    // Advanced settings
    show_scanner_ui: true,           // Show scanner's native UI
    auto_crop: true,                 // Auto-crop to content
    deskew: true,                    // Auto-straighten pages
    remove_blank_pages: true         // Remove empty pages
};
```

## API Reference

### Main Functions

- **`scanner.initialize([force])`** - Initialize the scanner library
- **`scanner.scan(callback, config, [timeout], [timeoutCallback])`** - Perform scan
- **`scanner.listSources(callback, [includeDetails], [showUI], [filter], [sortBy], [config])`** - List available scanners
- **`scanner.getSource(callback, [mode], [showUI], [source], [includeDetails], [autoSelect], [config], [timeout])`** - Get specific scanner
- **`scanner.getSystemInfo(callback)`** - Get system information

### Utility Functions

- **`scanner.getScannedImages(response, [includeOriginals], [includeThumbnails])`** - Extract images from scan response
- **`scanner.submitFormWithImages(formId, images, [callback])`** - Submit scanned images via form
- **`scanner.cancelFuncCalls()`** - Cancel pending operations

### Events

- **`loaded`** - Library loaded
- **`pre-init`** - Before initialization
- **`post-init`** - After initialization
- **`ready`** - Scanner ready to use
- **`func-call`** - Function call initiated
- **`func-return`** - Function call completed
- **`disconnected`** - Connection lost

## Browser Compatibility

### Legacy Support (Java Applet)
- Internet Explorer 8-11
- Firefox (with NPAPI support)
- Chrome (with NPAPI support)
- Safari (with NPAPI support)

### Modern Support (WebSocket)
- Chrome 45+
- Firefox 53+
- Edge (all versions)
- Safari 6+
- Modern mobile browsers

## Troubleshooting

### Common Issues

1. **Scanner not detected**
   - Ensure scanner is properly connected and powered on
   - Check if scanner drivers are installed
   - Try restarting the scan application

2. **Java applet not loading**
   - Enable Java in browser settings
   - Add site to Java security exceptions
   - Use modern WebSocket method instead

3. **WebSocket connection fails**
   - Install the scan application
   - Check firewall settings
   - Ensure ports 9713-9716 are available

### Debug Mode

Enable debug logging:

```javascript
window.scannerjs_config = {
    log_level: 0  // Show all log messages
};
```

## Installation Requirements

### For Java Applet Method:
- Java Runtime Environment (JRE) 1.6+
- Browser with NPAPI support
- Scanner drivers installed

### For WebSocket Method:
- Download and install scan application from: `http://cdn.asprise.com/scanapp/scan-setup.exe`
- WebSocket support in browser
- Scanner drivers installed

## License

This software is provided "AS IS" without warranty. See the license terms in the scanner.js file header.

## Support

For technical support, visit: http://asprise.com/document-scan-upload-image-browser

---

**Note**: This library requires either Java applets (legacy) or a local scan application to function. Make sure to install the appropriate components based on your browser and system configuration.
