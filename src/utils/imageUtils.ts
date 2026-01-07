import { type Area } from 'react-easy-crop';

/**
 * Creates a cropped image from a source image URL, pixel crop area, and rotation.
 * @param imageSrc - The source image URL.
 * @param pixelCrop - The pixel crop area { x, y, width, height }.
 * @param rotation - The rotation in degrees.
 * @returns A promise that resolves to the cropped image data URL.
 */
export const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<string> => {
    const image = new window.Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
        image.onload = () => {
            // Create a canvas large enough for the rotated image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve('');
                return;
            }

            // Calculate bounding box for rotated image
            const radians = (rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(radians));
            const cos = Math.abs(Math.cos(radians));
            const rotatedWidth = image.width * cos + image.height * sin;
            const rotatedHeight = image.width * sin + image.height * cos;

            canvas.width = rotatedWidth;
            canvas.height = rotatedHeight;

            // Move to center, rotate, then draw image centered
            ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
            ctx.rotate(radians);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);

            // Create a new canvas for the cropped image
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');

            if (!cropCtx) {
                resolve('');
                return;
            }

            cropCanvas.width = pixelCrop.width;
            cropCanvas.height = pixelCrop.height;

            // Draw the cropped area from the rotated image
            cropCtx.drawImage(
                canvas,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            // console.log("Cropped image data:", cropCanvas.toDataURL('image/jpeg')); // Removed console log
            resolve(cropCanvas.toDataURL('image/jpeg'));
        };
        
        image.onerror = () => {
             console.error("Failed to load image for cropping");
             resolve('');
        }
    });
};

/**
 * Converts a Base64 data URL to a File object.
 * @param dataUrl - The Base64 string.
 * @param fileName - The name for the file.
 * @returns The created File object.
 */
export const base64ToFile = (dataUrl: string, fileName: string): File => {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], fileName, { type: mimeString });
};
