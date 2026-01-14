export const canvasWM = ({
  container = document.body,
  width = '500px',
  height = '400px',
  textAlign = 'start',
  textBaseline = 'middle',
  font = '32px microsoft yahei',
  fillStyle = 'rgba(184, 184, 184, 0.8)',
  content = '请勿外传',
  rotate = '30',
  zIndex = 1000,
} = {}) => {
  var canvas = document.createElement('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  var ctx = canvas.getContext('2d');

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.fillText(content, 50, 0);

  var base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement('div');
  watermarkDiv.setAttribute(
    'style',
    `position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:${zIndex};
      pointer-events:none;
      background-size: contain;
      background-image:url('${base64Url}')`,
  );

  container.style.position = 'relative';
  container.insertBefore(watermarkDiv, container.firstChild);
};
