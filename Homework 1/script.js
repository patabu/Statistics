const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = screen.width - 200;
canvas.height = screen.height / 2;
console.log(canvas.width);


ctx.beginPath();
ctx.moveTo(1200, 500);
ctx.lineTo(1200, 100);
ctx.lineWidth = 2;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(100, 400);
ctx.lineTo(1250, 400);
ctx.stroke();