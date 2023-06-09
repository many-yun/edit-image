const canvas = document.querySelector('canvas');
const lineWidth = document.getElementById('line-width');
const lineWidthNum = document.getElementById('line-width-num');
const color = document.getElementById('color');
const ctx = canvas.getContext('2d');
const brushBtn = document.getElementById('brush-btn');
const paintBtn = document.getElementById('paint-btn');
const destroyBtn = document.getElementById('destroy-btn');
const eraseBtn = document.getElementById('eraser-btn');
const colorOptions = Array.from(document.getElementsByClassName('color-option'));
const fileInput = document.getElementById('file');
const textInput = document.getElementById('text');
const saveBtn = document.getElementById('save');
const cropBtn = document.getElementById('crop-btn');
const fontBtn = document.querySelectorAll('#font-btn');
const toolBtns = document.querySelectorAll('.tool-btn');

canvas.width = 800;
canvas.height = 800;
ctx.lineCap = 'round';
// ctx.translate(0.5, 0.5);
ctx.lineWidth = lineWidth.value;
let isPainting = false;
let isFilling = false;
let imageWidth = 0;
let imageHeight = 0;

const image = new Image(); // === <img src='' />
const canvasImage = new Image();

let cropMode = false;

let startX = 0;
let startY = 0;
let sX = 0;
let sY = 0;
let eX = 0;
let eY = 0;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
ctx.font = '48px S-CoreDream-3Light';

let degrees = 0;

/** 그림그리기 */
function onMove(e) {
   if (isPainting && !isFilling && !cropMode) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      return;
   } else if (isPainting && cropMode) {
      let nowX = e.offsetX;
      let nowY = e.offsetY;
      canvasDraw(nowX, nowY);
      sX = nowX;
      sY = nowY;
   }
   ctx.moveTo(e.offsetX, e.offsetY);
}

/** 브러쉬모드 */
function onBrushMode() {
   ctx.beginPath();
   ctx.strokeStyle = color.value;
   isFilling = false;
}
/** 페인트모드 */
function onPaintMode() {
   ctx.beginPath();
   ctx.fillStyle = color.value;
   isFilling = true;
}

function canvasDraw(cX, cY) {
   ctx.fillStyle = 'grey';
   ctx.beginPath();
   ctx.strokeStyle = 'red';
   ctx.lineWidth = 2;
   ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
   ctx.strokeRect(startX, startY, cX - startX, cY - startY);
}

/** 캔버스 클릭시 드로잉 or 페인트 */
function onMouseDown(e) {
   if (!cropMode) {
      isPainting = true;
   } else if (cropMode) {
      startX = e.offsetX;
      startY = e.offsetY;
      sX = e.offsetX;
      sY = e.offsetY;
      isPainting = true;
   }
}
/** 마우스 up > 드로잉 끝 */
function onMouseUp(e) {
   if (!cropMode) {
      isPainting = false;
   } else {
      isPainting = false;
      eX = e.offsetX;
      eY = e.offsetY;
   }
}
/** 화면 벗어날시 드로잉 끝 */
function onMouseOut() {
   isPainting = false;
}

/** 선 굵기 변경 */
function onLineWidthChange(e) {
   ctx.beginPath();
   ctx.lineWidth = e.target.value;
   lineWidthNum.innerText = e.target.value;
}
/** 색상변경 */
function onColorChange(e) {
   ctx.beginPath();
   ctx.strokeStyle = e.target.value;
   ctx.fillStyle = e.target.value;
}
/** 팔레트 클릭하여 색상 변경 */
function onColorClick(e) {
   ctx.beginPath();
   const colorValue = e.target.dataset.color;
   ctx.strokeStyle = colorValue;
   ctx.fillStyle = colorValue;
   color.value = colorValue;
}
/** 페인트 모드시 캔버스 채워짐 */
function onCanvasClick() {
   if (isFilling && !cropMode) {
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
   }
}
/** 초기화 모드 */
function onDestroyClick(e) {
   image.remove();
   ctx.fillStyle = 'white';
   ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
   canvas.style.left = `0`;
   canvas.style.top = `0`;
   canvas.width = 800;
   canvas.height = 800;
   ctx.strokeStyle = color.value;
   ctx.fillStyle = color.value;
   ctx.lineWidth = lineWidth.value;
   toolBtns.forEach((toolBtn) => toolBtn.classList.remove('mode-on'));
   toolBtns[0].classList += ' mode-on';
   startX = 0;
   startY = 0;
   sX = 0;
   sY = 0;
   eX = 0;
   eY = 0;
   ctx.lineCap = 'round';
   image.src = '';
}
/** 지우개 모드 */
function onEreaserClick() {
   ctx.beginPath();
   ctx.strokeStyle = 'white';
   isFilling = false;
}
/** 로컬이미지 업로드 */
function onFileChange(e) {
   canvas.style.left = `0`;
   canvas.style.top = `0`;
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
         canvas.width = 800;
         canvas.height = changedHeight;
         ctx.drawImage(image, 0, 0, 800, changedHeight);
         canvas.style.top = ` calc(400px - ${imageHeight / 2}px)`;
      } else if (image.naturalWidth < image.naturalHeight && image.naturalHeight >= 800) {
         imageWidth = changedWidth;
         imageHeight = 800;
         canvas.width = changedWidth;
         canvas.height = 800;
         ctx.drawImage(image, 0, 0, changedWidth, 800);
         canvas.style.left = ` calc(50% - ${imageWidth / 2}px)`;
      } else if (image.naturalWidth === 800 && image.naturalHeight === 800) {
         imageWidth = 800;
         imageHeight = 800;
         canvas.width = 800;
         canvas.height = 800;
         ctx.drawImage(image, 0, 0, 800, 800);
      } else {
         imageWidth = image.naturalWidth;
         imageHeight = image.naturalHeight;
         canvas.width = image.naturalWidth;
         canvas.height = image.naturalHeight;
         ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
         canvas.style.left = `calc(50% - ${image.naturalWidth / 2}px)`;
         canvas.style.top = `calc(400px - ${image.naturalHeight / 2}px)`;
      }

      ctx.strokeStyle = color.value;
      ctx.fillStyle = color.value;
      ctx.lineWidth = lineWidth.value;
      fileInput.value = null;
   };
}
/** 더블클릭하여 텍스트 추가 */
function onDoubleClick(e) {
   if (textInput.value !== '') {
      ctx.save();
      const text = textInput.value;
      ctx.lineWidth = 1;
      ctx.fillText(text, e.offsetX, e.offsetY);
      ctx.restore();
      textInput.value = '';
   }
}
/** 이미지 저장 */
function onSaveClick() {
   const url = canvas.toDataURL();
   const a = document.createElement('a');
   a.href = url;
   a.download = 'myDrawing.png';
   a.click();
}

let currentFont = 'S-CoreDream-3Light';

/** 이미지 크롭모드 */
function onImageCrop(e) {
   if (image.src !== '') {
      if (!cropMode) {
         cropMode = true;
         canvas.className += 'on';
         e.currentTarget.className += 'mode-on';
         cropBtn.innerHTML = '<i class="fa fa-solid fa-crop"></i> 자르기 완료';
         const canvasUrl = canvas.toDataURL();
         canvasImage.src = canvasUrl;
      } else {
         cropMode = false;
         canvas.classList.remove('on');
         e.currentTarget.classList.remove('mode-on');
         cropBtn.innerHTML = '<i class="fa fa-solid fa-crop"></i> 자르기';
         let imageData = ctx.getImageData(startX + 1, startY + 1, eX, eY);
         canvas.width = eX - startX - 2;
         canvas.height = eY - startY - 2;
         canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
         canvas.style.top = `calc(400px - ${canvas.height / 2}px)`;
         ctx.putImageData(imageData, 0, 0);
         ctx.font = `48px ${currentFont}`;
         ctx.strokeStyle = color.value;
         ctx.fillStyle = color.value;
         ctx.lineWidth = lineWidth.value;
      }
   } else alert('사진을 추가해주세요.');
}

/**폰트 변경 */
function onChangeFont(e) {
   fontBtn.forEach((font) => (font.style.backgroundColor = '#efefef'));
   fontBtn.forEach((font) => (font.style.color = '#333'));
   currentFont = e.target.dataset.font;
   ctx.font = `48px ${currentFont}`;
   e.target.style.backgroundColor = 'rgb(143, 96, 219)';
   e.target.style.color = 'white';
}

/** 각 모드 활성화시 class 추가 */
function onToolMode(e) {
   toolBtns.forEach((toolBtn) => toolBtn.classList.remove('mode-on'));
   e.currentTarget.classList += ' mode-on';
}

canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mouseleave', onMouseOut);
canvas.addEventListener('dblclick', onDoubleClick);

lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);

colorOptions.forEach((color) => color.addEventListener('click', onColorClick));

brushBtn.addEventListener('click', onBrushMode);
paintBtn.addEventListener('click', onPaintMode);
canvas.addEventListener('click', onCanvasClick);

destroyBtn.addEventListener('click', onDestroyClick);
eraseBtn.addEventListener('click', onEreaserClick);

fileInput.addEventListener('change', onFileChange);

saveBtn.addEventListener('click', onSaveClick);

cropBtn.addEventListener('click', onImageCrop);

fontBtn.forEach((font) => font.addEventListener('click', onChangeFont));

toolBtns.forEach((toolBtn) => toolBtn.addEventListener('click', onToolMode));
