import { useEffect } from 'react';

type ProcessedPixelData = {
    r: number;
    g: number;
    b: number;
};

type RenderConfig = {
    sampleSize: number;
    scaleFactor: number;
    whiteCutoff: number;
};

// Expanded palette for great contrast dynamic range
const CHAR_PALETTE = ['.', '·', '"', '!', ':', '*', '^', '%', '+', '%', '#', '@', 'G'];

const HIDDEN_CANVAS_STYLE = {
    display: "none",
    height: '400px',
    width: '400px',
};

const getPixelBrightness = (pixel: ProcessedPixelData): number => {
    return 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
};

const getGlyphDetails = (brightness: number) => {
    const normalizedInverted = 1 - brightness / 255;

    const paletteIndex = Math.min(
        Math.floor(normalizedInverted * CHAR_PALETTE.length),
        CHAR_PALETTE.length - 1
    );

    const char = CHAR_PALETTE[paletteIndex];

    let color = 'rgb(130, 185, 240)';
    if (paletteIndex > 8) {
        color = 'rgb(30, 120, 200)'; // Adjusted tiers slightly to account for longer palette length
    } else if (paletteIndex > 4) {
        color = 'rgb(70, 150, 225)';
    }

    return { char, color };
};

const initializeOutputCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: RenderConfig
) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${config.sampleSize * config.scaleFactor}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
};

const renderAsciiGrid = (
    srcData: Uint8ClampedArray,
    imgWidth: number,
    imgHeight: number,
    outCtx: CanvasRenderingContext2D,
    config: RenderConfig
) => {
    const { sampleSize, scaleFactor, whiteCutoff } = config;

    for (let y = 0; y < imgHeight; y += sampleSize) {
        for (let x = 0; x < imgWidth; x += sampleSize) {
            const index = (y * imgWidth + x) * 4;

            const pixel: ProcessedPixelData = {
                r: srcData[index],
                g: srcData[index + 1],
                b: srcData[index + 2],
            };

            const brightness = getPixelBrightness(pixel);

            if (brightness > whiteCutoff) continue;

            const { char, color } = getGlyphDetails(brightness);

            const outX = x * scaleFactor + (sampleSize * scaleFactor) / 2;
            const outY = y * scaleFactor + (sampleSize * scaleFactor) / 2;

            outCtx.fillStyle = color;
            outCtx.fillText(char, outX, outY);
        }
    }
};

const ArtParent = () => {
    useEffect(() => {
        const image = new Image();
        image.src = '/assets/flower.jpg';

        const imageCanvas = document.getElementById('temp_image_canvas') as HTMLCanvasElement;
        const outputCanvas = document.getElementById('output_image_canvas') as HTMLCanvasElement;

        image.addEventListener('load', () => {
            if (!imageCanvas || !outputCanvas) return;

            const config: RenderConfig = {
                sampleSize: 6,
                scaleFactor: 2,
                whiteCutoff: 240,
            };

            imageCanvas.width = image.width;
            imageCanvas.height = image.height;
            const srcCtx = imageCanvas.getContext('2d');
            if (!srcCtx) throw new Error('Source canvas context missing');

            srcCtx.drawImage(image, 0, 0);
            const rawImageData = srcCtx.getImageData(
                0,
                0,
                imageCanvas.width,
                imageCanvas.height
            ).data;

            outputCanvas.width = image.width * config.scaleFactor;
            outputCanvas.height = image.height * config.scaleFactor;
            const outCtx = outputCanvas.getContext('2d');
            if (!outCtx) throw new Error('Output canvas context missing');

            initializeOutputCanvas(outCtx, outputCanvas.width, outputCanvas.height, config);

            renderAsciiGrid(rawImageData, image.width, image.height, outCtx, config);
        });
    }, []);

    return (
        <div style={{ display: 'flex', padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh', alignItems: 'center' }}>
            
            {/* Injecting CSS keyframes directly into the document head */}
            <style>{`
                @keyframes slow-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .rotating-canvas {
                    animation: slow-spin 40s linear infinite;
                }
            `}</style>

            <canvas id="temp_image_canvas" style={HIDDEN_CANVAS_STYLE}></canvas>
            
            <canvas
                id="output_image_canvas"
                className="rotating-canvas"
                style={{
                    height: '800px',
                    width: '800px',
                    margin: "0 auto"
                }}
            ></canvas>
        </div>
    );
};

export default ArtParent;