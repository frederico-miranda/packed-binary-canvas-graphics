'use strict';

const actionClip = (context, object) => {
  const { path, fillRule } = object;
  context.clip(path, fillRule);
};

const actionFill = (context, object) => {
  const { path, fillRule } = object;
  context.fill(path, fillRule);
};

const actionRestore = (context, state) => {
  if (state.saveCount === 1) {
    throw new Error('An early restore has happened, which it should not.');
  }

  context.restore();
  state.saveCount -= 1;
};

const actionSave = (context, state) => {
  context.save();
  state.saveCount += 1;
};

const actionSet = (context, object) => {
  const { property, value } = object;
  switch (property) {
    case 'FILL':
      context.fillStyle = value;
      break;

    case 'LINE_DASH_OFFSET':
      context.lineDashOffset = value;
      break;

    case 'LINE_GAP':
      context.lineGap = value;
      break;

    case 'LINE_JOIN':
      context.lineJoin = value;
      break;

    case 'LINE_WIDTH':
      context.lineWidth = value;
      break;

    case 'STROKE':
      context.strokeStyle = value;
      break;

    default:
      throw new Error(`The verb SET has no property "${property}".`);
  }
};

const actionStroke = (context, object) => {
  const { path } = object;
  context.stroke(path);
};

const render = (context, instructions) => {
  let error = null;

  context.save();

  const state = {
    saveCount: 1,
  };

  try {
    for (let i = 0; i < instructions.length; i += 1) {
      const { verb, object } = instructions[i];
      switch (verb) {
        case 'CLIP':
          actionClip(context, object);
          break;

        case 'FILL':
          actionFill(context, object);
          break;

        case 'RESTORE':
          actionRestore(context, state);
          break;

        case 'SAVE':
          actionSave(context, state);
          break;

        case 'SET':
          actionSet(context, object);
          break;

        case 'STROKE':
          actionStroke(context, object);
          break;

        default:
          throw new Error(`No action for the given verb "${verb}"`);
      }
    }
  } catch (localError) {
    error = localError;
  } finally {
    for (let i = 0; i < state.saveCount; i += 1) {
      context.restore();
    }
  }

  if (error !== null) {
    throw error;
  }
};
