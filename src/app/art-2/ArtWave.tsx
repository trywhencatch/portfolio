import { useEffect, useRef } from 'react';

// --- Types & Constants ---
type Point3D = { x: number; y: number; z: number; brightness: number; };

type RenderConfig = {
    scaleFactor: number;   // Sharpness multiplier
    flowerSize: number;    // Base scale of the flower model
    rotationSpeed: number; // Speed of the spin around the stem axis
    density: number;       // Number of typographic nodes to generate
};

const CHAR_PALETTE = ['.', '·', '"', '!', ':', '*', '^', '%', '+', '%', '#', '@', 'G'];

const CANVAS_STYLE = {
    height: '800px',
    width: '800px',
    margin: "0 auto"
};

// --- Modular Helper Functions ---

/**
 * Procedurally generates a 3D mathematical flower model (Rhodonea Surface)
 * Returns an array of points with X, Y, Z coordinates and depth/brightness data.
 */
const generate3DFlowerModel = (density: number, size: number): Point3D[] => {
    const points: Point3D[] = [];
    
    // Mathematical constants to control petal shape
    const petalanth = 5; // Number of petals
    
    for (let i = 0; i < density; i++) {
        // Distribute points evenly using spherical mapping parameters
        const theta = (i / density) * Math.PI * 8; // Wrapping angle
        const phi = (i / density) * Math.PI;       // Elevation angle
        
        // 3D Rose Curve formula
        const r = size * Math.sin(petalanth * theta) * Math.sin(phi);
        
        // Convert spherical coordinates to 3D Cartesian coordinates
        const x = r * Math.sin(phi) * Math.cos(theta);
        const z = r * Math.sin(phi) * Math.sin(theta);
        // Curve the petals upward slightly on the Y axis to create depth
        const y = r * Math.cos(phi) + (Math.sin(r * 0.05) * 30); 
        
        // Calculate a fake brightness/shading value based on distance from center
        const brightnessValue = Math.abs(Math.sin(theta * 2));

        points.push({ x, y, z, brightness: brightnessValue });
    }
    
    return points;
};

/**
 * Rotates a 3D point around the Y-axis (the vertical stem axis) over time
 */
const rotateAroundYAxis = (point: Point3D, angle: number): Point3D => {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    return {
        x: point.x * cosA - point.z * sinA,
        y: point.y, // Y remains unchanged because we are spinning horizontally around it
        z: point.x * sinA + point.z * cosA,
        brightness: point.brightness
    };
};

/**
 * Resolves character and sky-blue color tiers based on depth/brightness
 */
const getGlyphDetails = (brightness: number, zDepth: number, maxDepth: number) => {
    // Modify character choice based on depth positioning (closer = heavier weight)
    const depthNormalized = (zDepth + maxDepth) / (maxDepth * 2);
    const mixedWeight = (brightness * 0.4) + (depthNormalized * 0.6);
    
    const paletteIndex = Math.min(
        Math.floor(mixedWeight * CHAR_PALETTE.length),
        CHAR_PALETTE.length - 1
    );

    const char = CHAR_PALETTE[paletteIndex];

    // Map color values to foreground vs background depth
    let color = 'rgb(130, 185, 240)'; // Faint back petals
    if (zDepth > maxDepth * 0.3) {
        color = 'rgb(30, 120, 200)';   // Rich foreground pops
    } else if (zDepth > -maxDepth * 0.3) {
        color = 'rgb(70, 150, 225)';   // Mid-ground tones
    }

    return { char, color };
};

/**
 * Renders the 3D projected point field onto the 2D canvas screen
 */
const render3DFrame = (
    outCtx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    modelPoints: Point3D[],
    config: RenderConfig,
    angle: number
) => {
    const { scaleFactor, flowerSize } = config;
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Sort points by Z-depth (Back-to-Front / Painter's Algorithm)
    // This stops background characters from rendering over foreground characters
    const transformedPoints = modelPoints
        .map(p => rotateAroundYAxis(p, angle))
        .sort((a, b) => a.z - b.z);

    for (const point of transformedPoints) {
        // Perspective projection formula: project 3D space down onto a 2D screen coordinate
        // Distance constant simulates camera proximity lens
        const distance = 400; 
        const projectionScale = distance / (distance + (point.z * 0.5));
        
        const screenX = centerX + (point.x * projectionScale * scaleFactor);
        const screenY = centerY + (point.y * projectionScale * scaleFactor);

        const { char, color } = getGlyphDetails(point.brightness, point.z, flowerSize);

        // Draw character node
        outCtx.fillStyle = color;
        outCtx.fillText(char, screenX, screenY);
    }
};

const clearCanvasFrame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
};

// --- Main Component ---
const ArtParent = () => {
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const outputCanvas = document.getElementById('output_3d_flower') as HTMLCanvasElement;
        if (!outputCanvas) return;

        const config: RenderConfig = {
            scaleFactor: 2,        // Multiplier to keep typography ultra-sharp
            flowerSize: 140,       // Size boundaries of the mathematical model meshes
            rotationSpeed: 0.0008, // Slow spin velocity factor
            density: 2200,         // Total string characters filling out the structural shape
        };

        outputCanvas.width = 800 * config.scaleFactor;
        outputCanvas.height = 800 * config.scaleFactor;

        const outCtx = outputCanvas.getContext('2d');
        if (!outCtx) return;

        outCtx.font = `bold 16px monospace`;
        outCtx.textAlign = 'center';
        outCtx.textBaseline = 'middle';

        // 1. Pre-generate the static mathematical model geometry array coordinates
        const flowerModel = generate3DFlowerModel(config.density, config.flowerSize);

        // 2. Continuous execution runtime loop
        const loop = (timestamp: number) => {
            clearCanvasFrame(outCtx, outputCanvas.width, outputCanvas.height);
            
            // Calculate current rotational orientation angle relative to running clock time
            const currentAngle = timestamp * config.rotationSpeed;
            
            // Render active frame calculations
            render3DFrame(outCtx, outputCanvas.width, outputCanvas.height, flowerModel, config, currentAngle);
            
            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <div style={{ display: 'flex', padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh', alignItems: 'center' }}>
            <canvas
                id="output_3d_flower"
                style={CANVAS_STYLE}
            ></canvas>
        </div>
    );
};

export default ArtParent;