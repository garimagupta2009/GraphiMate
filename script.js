// Get references to DOM elements
const plotBtn = document.getElementById('plot-btn');
const expressionInput = document.getElementById('expression');
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Graph settings
const scale = 40; // pixels per unit
const originX = WIDTH / 2;
const originY = HEIGHT / 2;

// Draw coordinate axes
function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // X-axis
    ctx.moveTo(0, originY);
    ctx.lineTo(WIDTH, originY);

    // Y-axis
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, HEIGHT);

    ctx.stroke();
    ctx.closePath();

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = originX; x < WIDTH; x += scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
    }
    for (let x = originX; x > 0; x -= scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
    }

    // Horizontal grid lines
    for (let y = originY; y < HEIGHT; y += scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
    }
    for (let y = originY; y > 0; y -= scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
    }

    ctx.stroke();
    ctx.closePath();
}

// Plot the graph based on the expression
function plotGraph(expr) {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Redraw axes and grid
    drawAxes();

    // Prepare to plot
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;

    const step = 1 / scale; // step size for x

    let firstPoint = true;
    let prev = {x: 0, y: 0};

    for (let pixelX = 0; pixelX <= WIDTH; pixelX++) {
        // Convert pixel to graph coordinate
        const x = (pixelX - originX) / scale;

        // Evaluate y using math.js
        let y;
        try {
            y = math.evaluate(expr, {x: x});
            if (typeof y !== 'number' || !isFinite(y)) {
                firstPoint = true;
                continue;
            }
        } catch (error) {
            console.error('Error evaluating expression:', error);
            continue;
        }

        // Convert graph coordinate to pixel
        const pixelY = originY - y * scale;

        if (firstPoint) {
            ctx.moveTo(pixelX, pixelY);
            firstPoint = false;
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }

    ctx.stroke();
    ctx.closePath();
}

// Event listener for the plot button
plotBtn.addEventListener('click', () => {
    const expr = expressionInput.value;
    if (expr.trim() === "") {
        alert("Please enter a mathematical expression.");
        return;
    }
    plotGraph(expr);
});

// Optional: Plot on Enter key press
expressionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        plotBtn.click();
    }
});

// Initial draw
drawAxes();
