import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, ButtonGroup, Flex, Image, Slider, Icon, Text } from '@chakra-ui/react';
import { MdZoomIn, MdZoomOut, MdFilterCenterFocus, MdPhotoFilter } from "react-icons/md";

interface ImageViewerProps {
    imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showFilters, setShowFilters] = useState(false);
    const initialFilters = {
        brightness: 100,
        contrast: 100,
        sepia: 0,
        grayscale: 0,
    };
    const [filters, setFilters] = useState(initialFilters);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pinchStartZoom = useRef(1);

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const fitToScreen = useCallback(() => {
        if (imageRef.current && containerRef.current) {
            const { naturalWidth, naturalHeight } = imageRef.current;
            const { clientWidth, clientHeight } = containerRef.current;
            const scaleX = clientWidth / naturalWidth;
            const scaleY = clientHeight / naturalHeight;
            const newZoom = Math.min(scaleX, scaleY);
            setZoom(1);
            const newX = (clientWidth - naturalWidth * newZoom) / 2;
            const newY = (clientHeight - naturalHeight * newZoom) / 2;
            setPosition({ x: newX, y: newY });
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = 1.1;
            if (e.deltaY < 0) {
                setZoom(prev => Math.min(prev * zoomFactor, 10));
            } else {
                setZoom(prev => Math.max(prev / zoomFactor, 0.1));
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y,
            });
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            setTouchStartDistance(dist);
            pinchStartZoom.current = zoom;
        } else if (e.touches.length === 1) {
            e.preventDefault();
            setIsDragging(true);
            setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
            if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && touchStartDistance) {
            e.preventDefault();
            const newDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const scale = newDist / touchStartDistance;
            const newZoom = pinchStartZoom.current * scale;
            setZoom(Math.min(Math.max(newZoom, 0.1), 10));
        } else if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            setPosition({
                x: e.touches[0].clientX - startPos.x,
                y: e.touches[0].clientY - startPos.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setTouchStartDistance(null);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    return (
        <Flex direction="column" h={{base: "50%", mdDown: "100%"}} w="full" colorPalette="brand" bg="surface" borderStyle="solid" borderWidth="thin" borderColor="primary/50">
            <Box
                ref={containerRef}
                flex="1"
                overflow="hidden"
                position="relative"
                cursor="grab"
                touchAction="none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <Image
                    ref={imageRef}
                    src={imageUrl}
                    alt="Record Image"
                    draggable="false"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`,
                        transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                    }}
                />
            </Box>
            <Flex direction="column" p={8} gap={8} bg="Background" borderStyle="solid" borderTopWidth="thin" borderColor="primary/50">
                <Flex justify="center" align="center" gap={8} flexWrap="wrap">
                    <ButtonGroup attached variant="surface" size="md">
                        <Button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.2))} aria-label="Zoom out"><Icon as={MdZoomOut} /></Button>
                        <Button onClick={fitToScreen} aria-label="Fit to screen"><Icon as={MdFilterCenterFocus} /></Button>
                        <Button onClick={() => setZoom(prev => Math.min(prev + 0.2, 10))} aria-label="Zoom in"><Icon as={MdZoomIn} /></Button>
                        <Button onClick={() => setShowFilters(!showFilters)} variant={showFilters ? 'solid' : 'surface'} aria-label="Image filters"><Icon as={MdPhotoFilter} /></Button>
                    </ButtonGroup>
                    <Slider.Root
                        width="200px"
                        min={0.2}
                        max={10}
                        step={0.1}
                        value={[zoom]}
                        defaultValue={[1]}
                        onValueChange={(details) => setZoom(details.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                    <ButtonGroup attached variant="surface" size="md">
                        <Button onClick={() => setZoom(0.5)}>50%</Button>
                        <Button onClick={() => setZoom(1)}>100%</Button>
                        <Button onClick={() => setZoom(2)}>200%</Button>
                    </ButtonGroup>
                </Flex>
                {showFilters && (
                    <Flex direction="column" gap={3} mt={4} width={{ md: "70%" }} mx="auto">
                        <Flex align="center" gap={3}>
                            <Text w="80px" fontSize="sm" fontWeight="semibold">Brightness</Text>
                            <Slider.Root
                                flex="1"
                                min={0} max={200} step={1} value={[filters.brightness]}
                                onValueChange={(details) => setFilters(f => ({ ...f, brightness: details.value[0] }))}
                            >
                                <Slider.Control>
                                    <Slider.Track><Slider.Range /></Slider.Track>
                                    <Slider.Thumbs />
                                </Slider.Control>
                            </Slider.Root>
                        </Flex>
                        <Flex align="center" gap={3} mb="4">
                            <Text w="80px" fontSize="sm" fontWeight="semibold">Contrast</Text>
                            <Slider.Root
                                flex="1"
                                min={0} max={200} step={1} value={[filters.contrast]}
                                onValueChange={(details) => setFilters(f => ({ ...f, contrast: details.value[0] }))}
                            >
                                <Slider.Control>
                                    <Slider.Track><Slider.Range /></Slider.Track>
                                    <Slider.Thumbs />
                                </Slider.Control>
                            </Slider.Root>
                        </Flex>
                        <Flex gap={3} justify="center">
                            <ButtonGroup size="sm" variant="surface">
                                <Button onClick={() => setFilters(f => ({ ...f, sepia: f.sepia > 0 ? 0 : 100 }))} variant={filters.sepia > 0 ? 'solid' : 'outline'}>Sepia</Button>
                                <Button onClick={() => setFilters(f => ({ ...f, grayscale: f.grayscale > 0 ? 0 : 100 }))} variant={filters.grayscale > 0 ? 'solid' : 'outline'}>B & W</Button>
                            </ButtonGroup>
                            <Button size="sm" variant="surface" onClick={resetFilters}>Reset Filters</Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default ImageViewer;
