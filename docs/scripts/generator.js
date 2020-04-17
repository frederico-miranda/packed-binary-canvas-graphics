'use strict';

const unsignedFloat = (u16) => {
  const LIMIT = 65535;
  return (u16 / LIMIT);
};

const signedFloat = (i16) => {
  const LIMIT = 32767;
  return (i16 / LIMIT);
};

const angle = (u16) => {
  const TWO_PI = Math.PI * 2;
  const LIMIT = 65535;
  return ((TWO_PI * u16)/ LIMIT);
};

const generateColor = (colorObject) => {
  const { red, green, blue, alpha } = colorObject;

  const redCode = red.toString(16).padStart(2, "0");
  const greenCode = green.toString(16).padStart(2, "0");
  const blueCode = blue.toString(16).padStart(2, "0");

  if (alpha) {
    const alphaCode = alpha.toString(16).padStart(2, "0");
    return `#${redCode}${greenCode}${blueCode}${alphaCode}`;
  }

  return `#${redCode}${greenCode}${blueCode}`;
};

const generateLinearGradient = (context, palette, linearGradientObject) => {
  const { x0, y0, x1, y1, colorStops } = linearGradientObject;

  const floatX0 = signedFloat(x0);
  const floatY0 = signedFloat(y0);
  const floatX1 = signedFloat(x1);
  const floatY1 = signedFloat(y1);

  const linearGradient = context.createLinearGradient(floatX0, floatY0, floatX1, floatY1);
  for (let i = 0; i < colorStops.length; i += 1) {
    const { offset, paletteIndex } = colorStops[i];
    const floatOffset = unsignedFloat(offset);
    linearGradient.addColorStop(floatOffset, palette[paletteIndex]);
  }

  return linearGradient;
};

const generateRadialGradient = (context, palette, radialGradientObject) => {
  const { x0, y0, r0, x1, y1, r1, colorStops } = radialGradientObject;

  const floatX0 = signedFloat(x0);
  const floatY0 = signedFloat(y0);
  const floatR0 = unsignedFloat(r0);
  const floatX1 = signedFloat(x1);
  const floatY1 = signedFloat(y1);
  const floatR1 = unsignedFloat(r1);

  const radialGradient = context.createRadialGradient(
    floatX0, floatY0, floatR0,
    floatX1, floatY1, floatR1,
  );

  for (let i = 0; i < colorStops.length; i += 1) {
    const { offset, paletteIndex } = colorStops[i];
    const floatOffset = unsignedFloat(offset);
    radialGradient.addColorStop(floatOffset, palette[paletteIndex]);
  }

  return radialGradient;
};

const generatePath2D = (path) => {
  const path2D = new Path2D();

  for (let i = 0; i < path.length; i += 1) {
    const { primitive, object } = path[i];
    switch (primitive) {
      case 'ARC': {
        const {
          centerX,
          centerY,
          radius,
          startAngle,
          endAngle,
        } = object;

        const floatCenterX = signedFloat(centerX);
        const floatCenterY = signedFloat(centerY);
        const floatRadius = unsignedFloat(radius);
        const floatStartAngle = angle(startAngle);
        const floatEndAngle = angle(endAngle);

        path2D.arc(floatCenterX, floatCenterY, floatRadius, floatStartAngle, floatEndAngle, true);
        break;
      }

      case 'ARC_TO': {
        const {
          controlPointX1,
          controlPointY1,
          controlPointX2,
          controlPointY2,
          radius,
        } = object;

        const floatControlPointX1 = signedFloat(controlPointX1);
        const floatControlPointY1 = signedFloat(controlPointY1);
        const floatControlPointX2 = signedFloat(controlPointX2);
        const floatControlPointY2 = signedFloat(controlPointY2);
        const floatRadius = unsignedFloat(radius);

        path2D.arcTo(
          floatControlPointX1,
          floatControlPointY1,
          floatControlPointX2,
          floatControlPointY2,
          floatRadius,
        );
        break;
      }

      case 'BEZIER_CURVE_TO': {
        const {
          controlPointX1,
          controlPointY1,
          controlPointX2,
          controlPointY2,
          targetX,
          targetY,
        } = object;

        const floatControlPointX1 = signedFloat(controlPointX1);
        const floatControlPointY1 = signedFloat(controlPointY1);
        const floatControlPointX2 = signedFloat(controlPointX2);
        const floatControlPointY2 = signedFloat(controlPointY2);
        const floatTargetX = signedFloat(targetX);
        const floatTargetY = signedFloat(targetY);

        path2D.bezierCurveTo(
          floatControlPointX1,
          floatControlPointY1,
          floatControlPointX2,
          floatControlPointY2,
          floatTargetX,
          floatTargetY,
        );
        break;
      }

      case 'ELLIPSE': {
        const {
          centerX,
          centerY,
          radiusX,
          radiusY,
          rotation,
          startAngle,
          endAngle,
        } = object;

        const floatCenterX = signedFloat(centerX);
        const floatCenterY = signedFloat(centerY);
        const floatRadiusX = unsignedFloat(radiusX);
        const floatRadiusY = unsignedFloat(radiusY);
        const floatRotation = unsignedFloat(rotation) * TWO_PI;
        const floatStartAngle = unsignedFloat(startAngle) * TWO_PI;
        const floatEndAngle = unsignedFloat(endAngle) * TWO_PI;

        path2D.ellipse(
          floatCenterX,
          floatCenterY,
          floatRadiusX,
          floatRadiusY,
          floatRotation,
          floatStartAngle,
          floatEndAngle,
          true
        );

        break;
      }

      case 'LINE_TO': {
        const {
          targetX,
          targetY,
        } = object;

        const floatTargetX = signedFloat(targetX);
        const floatTargetY = signedFloat(targetY);

        path2D.lineTo(floatTargetX, floatTargetY);
        break;
      }
  
      case 'MOVE_TO': {
        const {
          targetX,
          targetY,
        } = object;

        const floatTargetX = signedFloat(targetX);
        const floatTargetY = signedFloat(targetY);

        path2D.moveTo(floatTargetX, floatTargetY);
        break;
      }
  
      case 'QUADRATIC_CURVE_TO': {
        const {
          controlPointX,
          controlPointY,
          targetX,
          targetY,
        } = object;

        const floatControlX = signedFloat(controlPointX);
        const floatControlY = signedFloat(controlPointY);
        const floatTargetX = signedFloat(targetX);
        const floatTargetY = signedFloat(targetY);

        path2D.quadraticCurveTo(floatControlX, floatControlY, floatTargetX, floatTargetY);
        break;
      }
  
      case 'RECT': {
        const {
          centerX,
          centerY,
          width,
          height,
        } = object;

        const floatWidth = unsignedFloat(width);
        const floatHeight = unsignedFloat(height);
        const cornerX = unsignedFloat(centerX) - (floatWidth / 2);
        const cornerY = unsignedFloat(centerY) - (floatHeight / 2);

        path2D.rect(cornerX, cornerY, floatWidth, floatHeight);
        break;
      }

      default:
        break;
    }
  }

  return path2D;
};

const generateInstructions = (context, binaryObject) => {
  const {
    opaqueColors,
    alphaColors,
    linearGradients,
    radialGradients,
    paths,
    instructions,
  } = binaryObject;

  const colorsLength = opaqueColors.length + alphaColors.length;
  const gradientsLength = linearGradients.length + radialGradients.length;
  const paletteLength = colorsLength + gradientsLength;
  const palette = new Array(paletteLength);

  let i = 0;
  let j = 0;
  while (j < opaqueColors.length) {
    palette[i] = generateColor(opaqueColors[j]);

    i += 1;
    j += 1;
  }

  j = 0;
  while (j < alphaColors.length) {
    palette[i] = generateColor(alphaColors[j]);

    i += 1;
    j += 1;
  }

  j = 0;
  while (j < linearGradients.length) {
    palette[i] = generateLinearGradient(context, palette, linearGradients[j]);

    i += 1;
    j += 1;
  }

  j = 0;
  while (j < radialGradients.length) {
    palette[i] = generateRadialGradient(context, palette, radialGradients[j]);

    i += 1;
    j += 1;
  }

  const paths2D = new Array(paths.length);
  for (let k = 0; k < paths.length; k += 1) {
    paths2D[k] = generatePath2D(paths[k]);
  }

  const FILL_RULES = Object.freeze([null, 'nonzero', 'evenodd']);

  const SET_PROPERTIES = Object.freeze([
    null,
    'FILL',
    'LINE_DASH_OFFSET',
    'LINE_GAP',
    'LINE_JOIN',
    'LINE_WIDTH',
    'STROKE',
  ]);

  const realInstructions = new Array(instructions.length);
  for (let k = 0; k < instructions.length; k += 1) {
    const { verb, object } = instructions[k];
    let realObject = null;

    switch (verb) {
      case 'CLIP':
      case 'FILL': {
        const {
          fillRuleCode,
          pathIndex,
        } = object;

        realObject = {
          fillRule: FILL_RULES[fillRuleCode],
          path: paths2D[pathIndex],
        };
        break;
      }

      case 'RESTORE':
      case 'SAVE':
        break;

      case 'SET': {
        const { propertyCode, value } = object;
        const property = SET_PROPERTIES[propertyCode];
        switch (property) {
          case 'FILL':
          case 'STROKE': {
            realObject = {
              property,
              value: palette[value],
            };
            break;
          }

          case 'LINE_DASH_OFFSET':
          case 'LINE_GAP':
          case 'LINE_WIDTH':
            realObject = {
              property,
              value: unsignedFloat(value),
            };
            break;

          case 'LINE_JOIN':
            throw "SET LINE_JOIN not implemented yet.";

          case 'STROKE': {
            realObject = {
              property,
              value: {
                path: paths2D[pathIndex],
              },
            };
            break;
          }
        }

        break;
      }

      case 'STROKE': {
        const { pathIndex } = object;

        realObject = {
          path: paths2D[pathIndex],
        };
        break;
      }

      default:
        break;
    }

    realInstructions[k] = { verb, object: realObject };
  }

  return [palette, realInstructions];
};
