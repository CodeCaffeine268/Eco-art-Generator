const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

// Load nature sounds
const birdSounds = document.getElementById('birdSounds');
const birdsSinging = document.getElementById('birdsSinging');

// Function to generate random colors with a wider range
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to lighten or darken the color based on the base color
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

// Function to play the sound based on the shape
function playShapeSound(shapeType) {
    if (shapeType === 'circle') {
        birdsSinging.currentTime = 0;
        birdsSinging.play().catch(error => console.error('Error playing sound:', error));
    } else if (shapeType === 'rect') {
        birdSounds.currentTime = 0;
        birdSounds.play().catch(error => console.error('Error playing sound:', error));
    }
}

// Function to generate random shapes with enhanced variations
function generateRandomShape() {
    const shapeTypes = ['rect', 'circle', 'triangle', 'ellipse', 'hexagon'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    const shapeSize = Math.random() * 100 + 50; // Size between 50 and 150
    const shapeX = Math.random() * (canvas.width - shapeSize);
    const shapeY = Math.random() * (canvas.height - shapeSize);

    const baseColor = getRandomColor();
    const shadedColor = shadeColor(baseColor, (Math.random() - 0.5) * 50);

    const rotation = Math.random() * 360;
    const transparency = Math.random() * 0.5 + 0.5;

    return {
        type: shapeType,
        size: shapeSize,
        x: shapeX,
        y: shapeY,
        baseColor: baseColor,
        shadedColor: shadedColor,
        rotation: rotation,
        transparency: transparency
    };
}

// Function to draw a shape on the canvas
function drawShape(shape) {
    ctx.save();
    ctx.translate(shape.x + shape.size / 2, shape.y + shape.size / 2);
    ctx.rotate(shape.rotation * Math.PI / 180);
    ctx.globalAlpha = shape.transparency;

    if (shape.type === 'rect') {
        ctx.fillStyle = shape.baseColor;
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        ctx.strokeStyle = shape.shadedColor;
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
    } else if (shape.type === 'circle') {
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = shape.shadedColor;
        ctx.stroke();
    } else if (shape.type === 'triangle') {
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = shape.shadedColor;
        ctx.stroke();
    } else if (shape.type === 'ellipse') {
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, shape.size / 2, shape.size / 2 * 0.8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = shape.shadedColor;
        ctx.stroke();
    } else if (shape.type === 'hexagon') {
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(shape.size / 2 * Math.cos(i * 2 * Math.PI / 6), shape.size / 2 * Math.sin(i * 2 * Math.PI / 6));
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = shape.shadedColor;
        ctx.stroke();
    }

    ctx.restore();
}

// Function to generate and draw multiple shapes
function generateArt() {
    const shapeCount = document.getElementById('shapeCount').value;
    const shapes = [];

    for (let i = 0; i < shapeCount; i++) {
        shapes.push(generateRandomShape());
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(drawShape);

    // Play sounds based on shape types
    shapes.forEach(shape => playShapeSound(shape.type));
}

// Add event listener to the "Generate Art" button
document.getElementById('generateArt').addEventListener('click', generateArt);
