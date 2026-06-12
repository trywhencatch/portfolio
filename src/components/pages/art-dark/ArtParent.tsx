import { useEffect, useRef, useState } from 'react';

type RenderConfig = {
    sampleSize: number;
    scaleFactor: number;
    enableGlitch: boolean;
};

const HIDDEN_CANVAS_STYLE = {
    display: 'none',
};

const initializeOutputCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);
};

const renderPixelGrid = (
    srcData: Uint8ClampedArray,
    imgWidth: number,
    imgHeight: number,
    outCtx: CanvasRenderingContext2D,
    config: RenderConfig
) => {
    const { sampleSize, scaleFactor, enableGlitch } = config;

    for (let y = 0; y < imgHeight; y += sampleSize) {
        const shouldGlitchRow = enableGlitch && Math.random() < 0.08;

        const rowOffset = shouldGlitchRow ? Math.random() * 30 - 15 : 0;

        for (let x = 0; x < imgWidth; x += sampleSize) {
            let totalR = 0;
            let totalG = 0;
            let totalB = 0;
            let count = 0;

            for (let sy = 0; sy < sampleSize; sy++) {
                for (let sx = 0; sx < sampleSize; sx++) {
                    const px = x + sx;
                    const py = y + sy;

                    if (px >= imgWidth || py >= imgHeight) continue;

                    const index = (py * imgWidth + px) * 4;

                    totalR += srcData[index];
                    totalG += srcData[index + 1];
                    totalB += srcData[index + 2];

                    count++;
                }
            }

            const avgR = totalR / count;
            const avgG = totalG / count;
            const avgB = totalB / count;

            let brightness = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

            if (enableGlitch) {
                brightness += Math.random() * 20 - 10;
            }

            brightness = Math.max(0, Math.min(255, brightness));

            outCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

            outCtx.fillRect(
                x * scaleFactor + rowOffset,
                y * scaleFactor,
                sampleSize * scaleFactor,
                sampleSize * scaleFactor
            );
        }
    }
};

const ArtParent = () => {
    const [config, setConfig] = useState<RenderConfig>({
        sampleSize: 5,
        scaleFactor: 6,
        enableGlitch: true,
    });

    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const image = new Image();

        image.src = '/assets/flower.jpg';

        image.onload = () => {
            imageRef.current = image;

            renderLoop(image);
        };

        return () => {
            imageRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (imageRef.current) {
            renderImage(imageRef.current, config);
        }
    }, [config]);

    const renderLoop = (image: HTMLImageElement) => {
        const loop = () => {
            renderImage(image, config);

            // requestAnimationFrame(loop);
        };

        loop();
    };

    const renderImage = (image: HTMLImageElement, renderConfig: RenderConfig) => {
        const imageCanvas = document.getElementById('temp_image_canvas') as HTMLCanvasElement;

        const outputCanvas = document.getElementById('output_image_canvas') as HTMLCanvasElement;

        if (!imageCanvas || !outputCanvas) return;

        const MAX_PROCESS_WIDTH = 220;

        const aspectRatio = image.height / image.width;

        imageCanvas.width = MAX_PROCESS_WIDTH;
        imageCanvas.height = Math.floor(MAX_PROCESS_WIDTH * aspectRatio);

        const srcCtx = imageCanvas.getContext('2d');

        if (!srcCtx) {
            throw new Error('Source canvas context missing');
        }

        srcCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

        srcCtx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);

        const rawImageData = srcCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;

        outputCanvas.width = imageCanvas.width * renderConfig.scaleFactor;

        outputCanvas.height = imageCanvas.height * renderConfig.scaleFactor;

        outputCanvas.style.aspectRatio = `${outputCanvas.width} / ${outputCanvas.height}`;

        const outCtx = outputCanvas.getContext('2d');

        if (!outCtx) {
            throw new Error('Output canvas context missing');
        }

        initializeOutputCanvas(outCtx, outputCanvas.width, outputCanvas.height);

        renderPixelGrid(rawImageData, imageCanvas.width, imageCanvas.height, outCtx, renderConfig);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                backgroundColor: '#050505',
                minHeight: '100vh',
                gap: '24px',
                color: '#ffffff',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '28px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    padding: '18px',
                    border: '1px solid #222',
                    borderRadius: '14px',
                    background: '#0f0f0f',
                }}
            >
                <label>
                    <input
                        type="checkbox"
                        checked={config.enableGlitch}
                        onChange={(e) =>
                            setConfig((prev) => ({
                                ...prev,
                                enableGlitch: e.target.checked,
                            }))
                        }
                    />{' '}
                    Enable Glitch
                </label>
            </div>
            <canvas id="temp_image_canvas" style={HIDDEN_CANVAS_STYLE} />
            <canvas
                id="output_image_canvas"
                style={{
                    width: '400px',
                    height: 'auto',
                    margin: '0 auto',
                    background: '#050505',
                    imageRendering: 'pixelated',
                    display: 'block',
                }}
            />
        </div>
    );
};

export default ArtParent;
