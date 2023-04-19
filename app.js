const canvas = document.querySelectorAll('canvas');
const canvasTop = document.getElementById('canvasTop');
const canvasBottom = document.getElementById('canvasBottom');
const canvasSubmit = document.getElementById('canvasSubmit');
const lineWidthNum = document.getElementById('line-width-num');
const lineWidth = document.getElementById('line-width');
const color = document.getElementById('color');
const ctxTop = canvasTop.getContext('2d');
const ctxBottom = canvasBottom.getContext('2d');
const ctxSubmit = canvasSubmit.getContext('2d');
const modeBtn = document.getElementById('mode-btn');
const destroyBtn = document.getElementById('destroy-btn');
const eraseBtn = document.getElementById('eraser-btn');
const colorOptions = Array.from(document.getElementsByClassName('color-option'));
const fileInput = document.getElementById('file');
const textInput = document.getElementById('text');
const saveBtn = document.getElementById('save');
const rotateLeft = document.getElementById('rotate-left');
const rotateRight = document.getElementById('rotate-right');

canvas.forEach((can) => (can.width = 800));
canvas.forEach((can) => (can.height = 800));
canvasBottom.width = 800;
canvasBottom.height = 800;
ctxBottom.lineCap = 'round';
// ctx.translate(0.5, 0.5);
ctxBottom.lineWidth = lineWidth.value;
let isPainting = false;
let isFilling = false;
let imageWidth = 800;
let imageHeight = 800;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let degrees = 0;

function onMove(e) {
   if (isPainting && !isFilling) {
      ctxBottom.lineTo(e.offsetX, e.offsetY);
      ctxBottom.stroke();
      return;
   }
   ctxBottom.moveTo(e.offsetX, e.offsetY);
}

function onMouseDown() {
   isPainting = true;
}

function cancelPainting() {
   isPainting = false;
}

function onLineWidthChange(e) {
   ctxBottom.beginPath();
   ctxBottom.lineWidth = e.target.value;
   lineWidthNum.innerText = e.target.value;
}

function onColorChange(e) {
   ctxBottom.beginPath();
   ctxBottom.strokeStyle = e.target.value;
   ctxBottom.fillStyle = e.target.value;
}

function onColorClick(e) {
   ctxBottom.beginPath();
   const colorValue = e.target.dataset.color;
   ctxBottom.strokeStyle = colorValue;
   ctxBottom.fillStyle = colorValue;
   color.value = colorValue;
}

function onModeClick() {
   isFilling
      ? ((isFilling = false), (modeBtn.innerHTML = '<i class="fa fa-solid fa-fill-drip"></i> 페인트 모드'))
      : ((isFilling = true), (modeBtn.innerHTML = '<i class="fa fa-solid fa-paintbrush"></i> 브러쉬 모드'));
}

function onCanvasClick() {
   if (isFilling) {
      ctxBottom.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
   }
}

function onDestroyClick() {
   ctxBottom.fillStyle = 'white';
   ctxBottom.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
   canvas.width = 800;
   canvas.height = 800;
}

function onEreaserClick() {
   ctxBottom.beginPath();
   ctxBottom.strokeStyle = 'white';
   isFilling = false;
}

const image = new Image(); // === <img src='' />

function onFileChange(e) {
   canvas.forEach((can) => (can.style.left = `0`));
   canvas.forEach((can) => (can.style.top = `0`));
   degrees = 0;
   const file = e.target.files[0];
   const url = URL.createObjectURL(file);
   image.src = url;
   image.onload = () => {
      const changedWidth = (800 * image.naturalWidth) / image.naturalHeight;
      const changedHeight = (800 * image.naturalHeight) / image.naturalWidth;
      if (image.naturalWidth > image.naturalHeight && image.naturalWidth >= 800) {
         imageWidth = 800;
         imageHeight = changedHeight;
         canvas.forEach((can) => (can.width = 800));
         canvas.forEach((can) => (can.height = changedHeight));
         ctxTop.drawImage(image, 0, 0, 800, changedHeight);
         canvas.forEach((can) => (can.style.top = ` calc(400px - ${imageHeight / 2}px)`));
      } else if (image.naturalWidth < image.naturalHeight && image.naturalHeight >= 800) {
         imageWidth = changedWidth;
         imageHeight = 800;
         canvas.forEach((can) => (can.width = changedWidth));
         canvas.forEach((can) => (can.height = 800));
         ctxTop.drawImage(image, 0, 0, changedWidth, 800);
         canvas.forEach((can) => (can.style.left = ` calc(50% - ${imageWidth / 2}px)`));
      } else if (image.naturalWidth === 800 && image.naturalHeight === 800) {
         imageWidth = 800;
         imageHeight = 800;
         canvas.forEach((can) => (can.width = 800));
         canvas.forEach((can) => (can.height = 800));
         ctxTop.drawImage(image, 0, 0, 800, 800);
      } else {
         imageWidth = image.naturalWidth;
         imageHeight = image.naturalHeight;
         canvas.forEach((can) => (can.width = image.naturalWidth));
         canvas.forEach((can) => (can.height = image.naturalHeight));
         ctxTop.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
         canvas.forEach((can) => (can.style.left = ` calc(50% - ${image.naturalWidth / 2}px)`));
         canvas.forEach((can) => (can.style.top = ` calc(400px - ${image.naturalHeight / 2}px)`));
      }

      ctxBottom.strokeStyle = color.value;
      ctxBottom.fillStyle = color.value;
      ctxBottom.lineWidth = lineWidth.value;
      fileInput.value = null;
   };
}

function onDoubleClick(e) {
   if (textInput.value !== '') {
      ctxBottom.save();
      const text = textInput.value;
      ctxBottom.lineWidth = 1;
      ctxBottom.font = '48px serif';
      ctxBottom.fillText(text, e.offsetX, e.offsetY);
      ctxBottom.restore();
      textInput.value = '';
   }
}

function onSaveClick() {
   ctxSubmit.drawImage(canvasTop, 0, 0);
   ctxSubmit.drawImage(canvasBottom, 0, 0);
   const url = canvasSubmit.toDataURL();
   const a = document.createElement('a');
   a.href = url;
   a.download = 'myDrawing.png';
   a.click();
   document.removeChild(a);
}

function onRotateLeft() {
   ctxBottom.beginPath();
   ctxTop.save();
   degrees -= 90;
   if (degrees <= -360) degrees = 0;
   if (degrees === 0 || degrees % 180 === 0) {
      canvas.forEach((can) => (can.width = imageWidth));
      canvas.forEach((can) => (can.height = imageHeight));
      ctxTop.translate(canvasTop.width / 2, canvasTop.height / 2);
      ctxTop.rotate((degrees * Math.PI) / 180);
      ctxTop.translate(-(canvasTop.width / 2), -(canvasTop.height / 2));
      ctxTop.drawImage(image, 0, 0, imageWidth, imageHeight);
      if (image.width > image.height) {
         canvas.forEach((can) => (can.style.left = `calc(50% - ${imageWidth / 2}px)`));
         canvas.forEach((can) => (can.style.top = `calc(400px - ${imageHeight / 2}px)`));
      } else if (image.width < image.height) {
         canvas.forEach((can) => (can.style.top = `calc(400px - ${imageHeight / 2}px)`));
         canvas.forEach((can) => (can.style.left = `calc(50% - ${imageWidth / 2}px)`));
      }
   } else {
      canvas.forEach((can) => (can.width = imageHeight));
      canvas.forEach((can) => (can.height = imageWidth));
      ctxTop.translate(canvasTop.width / 2, canvasTop.height / 2);
      ctxTop.rotate((degrees * Math.PI) / 180);
      ctxTop.translate(-(canvasTop.height / 2), -(canvasTop.width / 2));
      ctxTop.drawImage(image, 0, 0, imageWidth, imageHeight);
      if (image.width > image.height) {
         canvas.forEach((can) => (can.style.top = `calc(400px - ${imageWidth / 2}px)`));
         canvas.forEach((can) => (can.style.left = `calc(50% - ${imageHeight / 2}px)`));
      } else if (image.width < image.height) {
         canvas.forEach((can) => (can.style.left = `calc(50% - ${imageHeight / 2}px)`));
         canvas.forEach((can) => (can.style.top = `calc(400px - ${imageWidth / 2}px)`));
      }
   }
   // ctxTop.translate(-800, -800);
   ctxBottom.strokeStyle = color.value;
   ctxBottom.fillStyle = color.value;
   ctxBottom.lineWidth = lineWidth.value;
   ctxTop.restore();
}

function onRotateRight() {
   ctxBottom.beginPath();
   ctxTop.save();
   degrees += 90;
   if (degrees >= 360) degrees = 0;
   if (degrees === 0 || degrees % 180 === 0) {
      canvas.forEach((can) => (can.width = imageWidth));
      canvas.forEach((can) => (can.height = imageHeight));
      ctxTop.translate(canvasTop.width / 2, canvasTop.height / 2);
      ctxTop.rotate((degrees * Math.PI) / 180);
      ctxTop.translate(-(canvasTop.width / 2), -(canvasTop.height / 2));
      ctxTop.drawImage(image, 0, 0, imageWidth, imageHeight);
   } else {
      canvas.forEach((can) => (can.width = imageHeight));
      canvas.forEach((can) => (can.height = imageWidth));
      ctxTop.translate(canvasTop.width / 2, canvasTop.height / 2);
      ctxTop.rotate((degrees * Math.PI) / 180);
      ctxTop.translate(-(canvasTop.height / 2), -(canvasTop.width / 2));
      ctxTop.drawImage(image, 0, 0, imageWidth, imageHeight);
   }
   ctxBottom.strokeStyle = color.value;
   ctxBottom.fillStyle = color.value;
   ctxBottom.lineWidth = lineWidth.value;
   ctxTop.restore();
}

canvasBottom.addEventListener('mousemove', onMove);
canvasBottom.addEventListener('mousedown', onMouseDown);
canvasBottom.addEventListener('mouseup', cancelPainting);
canvasBottom.addEventListener('mouseleave', cancelPainting);
canvasBottom.addEventListener('dblclick', onDoubleClick);

lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);

colorOptions.forEach((color) => color.addEventListener('click', onColorClick));

modeBtn.addEventListener('click', onModeClick);
canvasBottom.addEventListener('click', onCanvasClick);

destroyBtn.addEventListener('click', onDestroyClick);
eraseBtn.addEventListener('click', onEreaserClick);

fileInput.addEventListener('change', onFileChange);

saveBtn.addEventListener('click', onSaveClick);

rotateLeft.addEventListener('click', onRotateLeft);
rotateRight.addEventListener('click', onRotateRight);
