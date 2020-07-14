import {
  Selection, StatusBarItem, Position,
  window, commands,
} from 'vscode';

import { statusBarPrefix, command } from './constant';

const onSelectionChange = (statusBarItem: StatusBarItem) => {
  // this event would trigger even there was no active text editor
  if (window.activeTextEditor == null) {
    return;
  }

  const allSelectionOffsets = getAllSelectionOffsets();

  // only show the first selection offset in the status bar
  const [{ start, end }] = allSelectionOffsets;
  statusBarItem.text = `${statusBarPrefix} [${start}, ${end})`;

  // show all selections' offset in the status bar tooltip
  statusBarItem.tooltip = allSelectionOffsets.map(({ start, end }) => `[${start}, ${end})`).join('\n');

  statusBarItem.show();
};

const onCommand = async cmd => {
  switch (cmd) {
    case command.gotoOffset:
      return gotoOffset();
    case command.gotoSelection:
      return gotoSelection();
    default:
      throw new Error(`Unsupported command: ${cmd}`);
  }
};

const gotoOffset = async () => {
  const {
    activeTextEditor,
    activeTextEditor: {
      document,
    },
  } = window;

  const maximumOffset = getMaximumOffset();
  const cursorOffset = getCursorOffset();

  const input = await window.showInputBox({
    value: cursorOffset.toString(),
    prompt: `Please enter an offset: 0 ~ ${maximumOffset}`,
    validateInput: async input => {
      const offset = +input;
      if (isNaN(offset)) {
        return 'Number required';
      }
    },
  });

  // if canceled (eg. press `Esc`)
  if (input == null) {
    return;
  }

  const position = document.positionAt(+input);
  activeTextEditor.selection = new Selection(position, position);

  await showPositionInTheDocument(position);
};

const gotoSelection = async () => {
  const {
    activeTextEditor,
    activeTextEditor: {
      document,
    },
  } = window;

  const maximumOffset = getMaximumOffset();
  const [{ start, end }] = getAllSelectionOffsets();

  const format = /^ *?(\d+) *?, *?(\d+) *$/;
  const input = await window.showInputBox({
    value: `${start}, ${end}`,
    prompt: `Please enter a selection: \`0, 0\` ~ \`${maximumOffset}, ${maximumOffset}\``,
    validateInput: async input => {
      if (!format.test(input)) {
        return 'Please input selection in the format as follow: `number, number`';
      }
    },
  });

  // if canceled (eg. press `Esc`)
  if (input == null) {
    return;
  }

  const [, startOffset, endOffset] = format.exec(input);

  const startPosition = document.positionAt(+startOffset);
  const endPosition = document.positionAt(+endOffset);
  activeTextEditor.selection = new Selection(startPosition, endPosition);

  await showPositionInTheDocument(startPosition);
};

const showPositionInTheDocument = async (position: Position) => {
  const {
    activeTextEditor: {
      document,
    },
  } = window;

  // focus the cursor to the document
  window.showTextDocument(document);

  // show cursor at the middle of the editor
  await commands.executeCommand("revealLine", {
    lineNumber: position.line,
    at: 'center',
  });
};

const getAllSelectionOffsets = () => {
  const {
    activeTextEditor: {
      document,
      selections,
    },
  } = window;

  const selectionOffsets = selections.map(({ start, end, anchor, active }: Selection) => ({
    start: document.offsetAt(start),    // the left point of the selection
    end: document.offsetAt(end),        // the right point of the selection
    anchor: document.offsetAt(anchor),  // the start point of the selection (eg. selection some characters from right to left)
    active: document.offsetAt(active),  // the end point of the selection
  }));

  return selectionOffsets;
};

// if there are many selections, show cursor offset in the first selection
const getCursorOffset = () => {
  const {
    activeTextEditor: {
      document,
      selection: {
        active,
      },
    },
  } = window;

  const offset = document.offsetAt(active);
  return offset;
};

// the magic way to compute the maximum offset of an arbitrary document
const getMaximumOffset = () => {
  const offset = window.activeTextEditor.document.offsetAt(new Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
  return offset;
};

export {
  onSelectionChange,
  onCommand,
};