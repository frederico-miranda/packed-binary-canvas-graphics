'use strict';

const orders = [
  {
    canvas: 'archery-target-canvas',
    binary: binaryArcheryTarget,
  },
  {
    canvas: 'yellow-star-canvas',
    binary: binaryYellowStar,
  },
];

for (let i = 0; i < orders.length; i += 1) {
  const canvas = document.getElementById(orders[i].canvas);
  const context = canvas.getContext('2d');

  const parseResult = parseBinary(orders[i].binary);
  const [palette, image] = generateInstructions(context, parseResult);
  context.translate(canvas.width / 2, canvas.height / 2); /* translate to center */
  context.scale(canvas.width / 2, canvas.width / 2);
  render(context, image);
};

