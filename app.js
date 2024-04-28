const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
const port = 3000;

// Middleware to handle CORS and serve static files from `public` directory
app.use(cors());
app.use(express.static("public"));

app.get("/stream-canvas", (req, res) => {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Continuously update canvas and stream updates
  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace; boundary=myboundary",
    Connection: "keep-alive",
  });

  // Function to simulate periodic canvas drawing
  const draw = () => {
    ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("SERVER-SIDE CANVAS !", 200, 300);

    const buffer = canvas.toBuffer("image/png");
    res.write(
      `--myboundary\nContent-Type: image/png\nContent-length: ${buffer.length}\n\n`
    );
    res.write(buffer);
    res.write("\n\n");
  };

  // Initial draw
  draw();

  // Set an interval to update the canvas every second
  const interval = setInterval(draw, 1000);

  // Clear interval and end response when client disconnects
  res.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
