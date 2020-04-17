'use strict';

const SIXTEEN_BITS_LIMIT = (1 << 16) - 1;

const parseI16 = (blob, index) => {
  const lowerByte = blob[index + 1];
  const higherByte = blob[index];
  const value = ((higherByte << 24) | lowerByte << 16) >> 16;
  return value;
};

const parseU16  = (blob, index) => {
  const lowerByte = blob[index + 1];
  const higherByte = blob[index];
  const value = higherByte << 8 | lowerByte;
  return value;
};

const parseOpaqueColor = (blob, index) => {
  const red = blob[index]; index += 1;
  const green = blob[index]; index += 1;
  const blue = blob[index]; index += 1;

  const object = { red, green, blue };

  return object;
};

const parseAlphaColor = (blob, index) => {
  const red = blob[index]; index += 1;
  const green = blob[index]; index += 1;
  const blue = blob[index]; index += 1;
  const alpha = blob[index]; index += 1;

  const object = { red, green, blue, alpha };

  return object;
};

const parseLinearGradient = (blob, index) => {
  const x0 = parseI16(blob, index); index += 2;
  const y0 = parseI16(blob, index); index += 2;
  const x1 = parseI16(blob, index); index += 2;
  const y1 = parseI16(blob, index); index += 2;

  const colorStopsCount = parseU16(blob, index); index += 2;

  const colorStops = [];
  let k = 0;
  while (k < colorStopsCount) {
    const offset = parseU16(blob, index); index += 2;
    const paletteIndex = parseU16(blob, index); index += 2;
    colorStops.push({ offset, paletteIndex });
    k += 1;
  }

  const object = { x0, y0, x1, y1, colorStops };

  return [object, index];
};

const parseRadialGradient = (blob, index) => {
  const x0 = parseU16(blob, index); index += 2;
  const y0 = parseU16(blob, index); index += 2;
  const r0 = parseU16(blob, index); index += 2;
  const x1 = parseU16(blob, index); index += 2;
  const y1 = parseU16(blob, index); index += 2;
  const r1 = parseU16(blob, index); index += 2;

  const colorStopsCount = parseU16(blob, index); index += 2;

  const colorStops = [];
  k = 0;
  while (k < colorStopsCount) {
    const offset = parseU16(blob, index); index += 2;
    const paletteIndex = parseU16(blob, index); index += 2;
    colorsStops.push({ offset, paletteIndex });
    k += 1;
  }

  const object = { x0, y0, r0, x1, y1, r1, colorStops };

  return [object, index];
};

const PATH_PRIMITIVES = Object.freeze([
  'END',
  'ARC',
  'ARC_TO',
  'BEZIER_CURVE_TO',
  'ELLIPSE',
  'LINE_TO',
  'MOVE_TO',
  'QUADRATIC_CURVE_TO',
  'RECT',
]);

const parsePath = (blob, index) => {
  const path = [];

  let endFound = false;
  while (!endFound) {
    let code = blob[index]; index += 1;
    if (code >= PATH_PRIMITIVES.length) {
      throw new Error(`Undefined primitive code ${code} in path stream (offset: ${index - 1})`);
    }

    let step = null;
    const primitive = PATH_PRIMITIVES[code];
    switch (primitive) {
      case 'END':
        endFound = true;
        continue;

      case 'ARC': {
        const centerX = parseI16(blob, index); index += 2;
        const centerY = parseI16(blob, index); index += 2;
        const radius = parseU16(blob, index); index += 2;
        const startAngle = parseU16(blob, index); index += 2;
        const endAngle = parseU16(blob, index); index += 2;

        step = {
          primitive,
          object: {
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle,
          },
        };

        break;
      }

      case 'ARC_TO': {
        const controlPointX1 = parseI16(blob, index); index += 2;
        const controlPointY1 = parseI16(blob, index); index += 2;
        const controlPointX2 = parseI16(blob, index); index += 2;
        const controlPointY2 = parseI16(blob, index); index += 2;
        const radius = parseI16(blob, index); index += 2;

        step = {
          primitive,
          object: {
            controlPointX1,
            controlPointY1,
            controlPointX2,
            controlPointY2,
            radius,
          },
        };

        break;
      }

      case 'BEZIER_CURVE_TO': {
        const controlPointX1 = parseI16(blob, index); index += 2;
        const controlPointY1 = parseI16(blob, index); index += 2;
        const controlPointX2 = parseI16(blob, index); index += 2;
        const controlPointY2 = parseI16(blob, index); index += 2;
        const targetX = parseI16(blob, index); index += 2;
        const targetY = parseI16(blob, index); index += 2;

        step = {
          primitive,
          object: {
            controlPointX1,
            controlPointY1,
            controlPointX2,
            controlPointY2,
            targetX,
            targetY,
          },
        };

        break;
      }

      case 'ELLIPSE': {
        const centerX = parseI16(blob, index); index += 2;
        const centerY = parseI16(blob, index); index += 2;
        const radiusX = parseU16(blob, index); index += 2;
        const radiusY = parseU16(blob, index); index += 2;
        const rotation = parseU16(blob, index); index += 2;
        const startAngle = parseU16(blob, index); index += 2;
        const endAngle = parseU16(blob, index); index += 2;

        step = {
          primitive,
          object: {
            centerX,
            centerY,
            radiusX,
            radiusY,
            rotation,
            startAngle,
            endAngle,
          },
        };

        break;
      }

      case 'LINE_TO':
      case 'MOVE_TO': {
        const targetX = parseI16(blob, index); index += 2;
        const targetY = parseI16(blob, index); index += 2;

        step = {
          primitive,
          object: {
            targetX,
            targetY,
          },
        };

        break;
      }

      case 'QUADRATIC_CURVE_TO': {
        const controlPointX = parseI16(blob, index); index += 2;
        const controlPointY = parseI16(blob, index); index += 2;
        const targetX = parseI16(blob, index); index += 2;
        const targetY = parseI16(blob, index); index += 2;

        step = {
          primitive,        
          object: {
            controlPointX,
            controlPointY,
            targetX,
            targetY,
          },
        };

        break;
      }

      case 'RECT': {
        break;
      }

      default:
        break;
    }

    if (step === null) {
      throw new Error(`Assertion failed (index: ${index}). "step" should never be null. Report this bug.`);
    }

    path.push(step);
    step = null;
  }

  return [path, index];
};

const INSTRUCTION_VERBS = Object.freeze([
  null,
  'CLIP',
  'FILL',
  'RESTORE',
  'SAVE',
  'SET',
  'STROKE',
]);

const SET_PROPERTIES = Object.freeze([
  null,
  'FILL',
  'LINE_DASH_OFFSET',
  'LINE_GAP',
  'LINE_JOIN',
  'LINE_WIDTH',
  'STROKE',
]);

const parseInstruction = (blob, index) => {
  const code = blob[index]; index += 1;

  if (code >= INSTRUCTION_VERBS.length) {
    throw new Error(`Undefined instruction code ${code} in instruction stream at position ${index - 1}.`);
  }

  const verb = INSTRUCTION_VERBS[code];
  let object = null;
  switch (verb) {

    case 'CLIP':
    case 'FILL': {
      const fillRuleCode = blob[index]; index += 1;
      const pathIndex = parseU16(blob, index); index += 2;
      object = { fillRuleCode, pathIndex };
      break;
    }

    case 'RESTORE':
    case 'SAVE':
      break;

    case 'SET': {
      const propertyCode = blob[index]; index += 1;
      const value = parseU16(blob, index); index += 2;
      object = { propertyCode, value };
      break;
    }

    case 'STROKE': {
      const pathIndex = parseU16(blob, index); index += 2;
      object = { pathIndex };
      break;
    }

    default:
      break;
  }

  const instruction = { verb, object };

  return [instruction, index];
};

const parseBinary = (blob) => {
  const standardHeader = [80, 66, 67, 71, 0, 1]; /* 'P', 'B', 'C', 'G', 0x00, 0x01 */

  let i = 0;
  let j = 0;
  let k = 0;
  while (i < standardHeader.length) {
    if (blob[i] !== standardHeader[i]) {
      throw new Error('The given blob is not an PBCG image file.');
    }

    i += 1;
  }

  const opaqueColorsCount = parseU16(blob, i); i += 2;
  const alphaColorsCount = parseU16(blob, i); i += 2;
  const linearGradientsCount = parseU16(blob, i); i += 2;
  const radialGradientsCount = parseU16(blob, i); i += 2;
  const pathsCount = parseU16(blob, i); i += 2;
  const instructionsCount = parseU16(blob, i); i += 2;

  const opaqueColors = [];
  j = 0;
  while (j < opaqueColorsCount) {
    const opaqueColor = parseOpaqueColor(blob, i); i += 3;
    opaqueColors.push(opaqueColor);

    j += 1;
  }

  const alphaColors = [];
  j = 0;
  while (j < alphaColorsCount) {
    const alphaColor = parseAlphaColor(blob, i); i += 4;
    alphaColors.push(alphaColor);

    j += 1;
  }

  const linearGradients = [];
  j = 0;
  while (j < linearGradientsCount) {
    const [linearGradient, nextIndex] = parseLinearGradient(blob, i); i = nextIndex;
    linearGradients.push(linearGradient);

    j += 1;
  }

  const radialGradients = [];
  j = 0;
  while (j < radialGradientsCount) {
    const [radialGradient, nextIndex] = parseRadialGradient(blob, i); i = nextIndex;
    radialGradients.push(radialGradient);

    j += 1;
  }

  const paths = [];
  j = 0;
  while (j < pathsCount) {
    const [path, nextIndex] = parsePath(blob, i); i = nextIndex;
    paths.push(path);

    j += 1;
  }

  const instructions = [];
  j = 0;
  while (j < instructionsCount) {
    const [instruction, nextIndex] = parseInstruction(blob, i); i = nextIndex;
    instructions.push(instruction);

    j += 1;
  }

  const object = {
    opaqueColors,
    alphaColors,
    linearGradients,
    radialGradients,
    paths,
    instructions,
  };

  return object;
};
