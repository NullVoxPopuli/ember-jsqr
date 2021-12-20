import type { QRCode } from 'jsqr';
import type { Point } from 'jsqr/dist/locator';

export function drawBox({
  canvas,
  location,
  color,
}: {
  canvas: CanvasRenderingContext2D;
  location: QRCode['location'];
  color: string;
}) {
  drawLine(canvas, location.topLeftCorner, location.topRightCorner, color);
  drawLine(canvas, location.topRightCorner, location.bottomRightCorner, color);
  drawLine(canvas, location.bottomRightCorner, location.bottomLeftCorner, color);
  drawLine(canvas, location.bottomLeftCorner, location.topLeftCorner, color);
}

function drawLine(canvas: CanvasRenderingContext2D, begin: Point, end: Point, color: string) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}
