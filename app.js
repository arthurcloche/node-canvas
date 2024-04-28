const express = require("express");
const { createCanvas } = require("canvas");
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public")); // Serve static files from 'public' directory

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext("2d");

app.get("/stream-canvas/:mouseX/:mouseY", (req, res) => {
  //   console.log("Request received");
  const { mouseX, mouseY } = req.params;
  drawOnCanvas(parseInt(mouseX), parseInt(mouseY));

  const buffer = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
});

function drawOnCanvas(mouseX, mouseY) {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 20, 0, 2 * Math.PI); // Draw the circle
  ctx.fill();
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
