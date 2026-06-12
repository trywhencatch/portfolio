import { useEffect, useRef, useState } from 'react';

type RenderConfig = {
    sampleSize: number;
    scaleFactor: number;
    whiteCutoff: number;
};

const HIDDEN_CANVAS_STYLE = {
    display: 'none',
    height: '400px',
    width: '400px',
};

const initializeOutputCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
};

const renderHalftoneGrid = (
    srcData: Uint8ClampedArray,
    imgWidth: number,
    imgHeight: number,
    outCtx: CanvasRenderingContext2D,
    config: RenderConfig
) => {
    const { sampleSize, scaleFactor, whiteCutoff } = config;

    const blockSize = sampleSize * scaleFactor;

    for (let y = 0; y < imgHeight; y += sampleSize) {
        for (let x = 0; x < imgWidth; x += sampleSize) {
            const index = (y * imgWidth + x) * 4;

            const r = srcData[index];
            const g = srcData[index + 1];
            const b = srcData[index + 2];

            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            if (brightness > whiteCutoff) {
                continue;
            }

            const darkness = 1 - brightness / 255;

            const level = Math.floor(darkness * 5);

            let shouldDraw = false;

            switch (level) {
                case 4:
                    shouldDraw = true;
                    break;

                case 3:
                    shouldDraw = (x + y) % 2 === 0;
                    break;

                case 2:
                    shouldDraw = x % 2 === 0;
                    break;

                case 1:
                    shouldDraw = (x + y) % 4 === 0;
                    break;

                default:
                    shouldDraw = false;
            }

            if (!shouldDraw) continue;

            outCtx.fillStyle = '#000';

            outCtx.fillRect(x * scaleFactor, y * scaleFactor, blockSize, blockSize);
        }
    }
};

const ArtParent = () => {
    const [config, setConfig] = useState<RenderConfig>({
        sampleSize: 6,
        scaleFactor: 2,
        whiteCutoff: 255,
    });

    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const image = new Image();

        image.src = '/assets/image.jpg';

        image.onload = () => {
            imageRef.current = image;
            renderImage(image, config);
        };
    }, []);

    useEffect(() => {
        if (imageRef.current) {
            renderImage(imageRef.current, config);
        }
    }, [config]);

    const renderImage = (image: HTMLImageElement, renderConfig: RenderConfig) => {
        const imageCanvas = document.getElementById('temp_image_canvas') as HTMLCanvasElement;

        const outputCanvas = document.getElementById('output_image_canvas') as HTMLCanvasElement;

        if (!imageCanvas || !outputCanvas) return;

        imageCanvas.width = image.width;
        imageCanvas.height = image.height;

        const srcCtx = imageCanvas.getContext('2d');

        if (!srcCtx) {
            throw new Error('Source canvas context missing');
        }

        srcCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

        srcCtx.drawImage(image, 0, 0);

        const rawImageData = srcCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;

        outputCanvas.width = image.width * renderConfig.scaleFactor;

        outputCanvas.height = image.height * renderConfig.scaleFactor;

        const outCtx = outputCanvas.getContext('2d');

        if (!outCtx) {
            throw new Error('Output canvas context missing');
        }

        initializeOutputCanvas(outCtx, outputCanvas.width, outputCanvas.height);

        renderHalftoneGrid(rawImageData, image.width, image.height, outCtx, renderConfig);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                gap: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                }}
            >
                <div>
                    <label>White Cutoff</label>
                    <br />
                    <input
                        type="range"
                        min={0}
                        max={255}
                        value={config.whiteCutoff}
                        onChange={(e) =>
                            setConfig((prev) => ({
                                ...prev,
                                whiteCutoff: Number(e.target.value),
                            }))
                        }
                    />
                    <div>{config.whiteCutoff}</div>
                </div>

                <div>
                    <label>Sample Size</label>
                    <br />
                    <input
                        type="range"
                        min={2}
                        max={12}
                        value={config.sampleSize}
                        onChange={(e) =>
                            setConfig((prev) => ({
                                ...prev,
                                sampleSize: Number(e.target.value),
                            }))
                        }
                    />
                    <div>{config.sampleSize}</div>
                </div>

                <div>
                    <label>Scale Factor</label>
                    <br />
                    <input
                        type="range"
                        min={1}
                        max={6}
                        step={0.5}
                        value={config.scaleFactor}
                        onChange={(e) =>
                            setConfig((prev) => ({
                                ...prev,
                                scaleFactor: Number(e.target.value),
                            }))
                        }
                    />
                    <div>{config.scaleFactor}</div>
                </div>
            </div>

            <canvas id="temp_image_canvas" style={HIDDEN_CANVAS_STYLE} />

            <canvas
                id="output_image_canvas"
                style={{
                    height: '600px',
                    width: 'auto',
                    margin: '0 auto',
                    background: '#fff',
                }}
            />
        </div>
    );
};

export default ArtParent;
