"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCommand = exports.onSelectionChange = void 0;
const vscode_1 = require("vscode");
const constant_1 = require("./constant");
const onSelectionChange = (statusBarItem) => {
    // this event would trigger even there was no active text editor
    if (vscode_1.window.activeTextEditor == null) {
        return;
    }
    const allSelectionOffsets = getAllSelectionOffsets();
    // only show the first selection offset in the status bar
    const [{ start, end }] = allSelectionOffsets;
    statusBarItem.text = `${constant_1.statusBarPrefix} [${start}, ${end})`;
    // show all selections' offset in the status bar tooltip
    statusBarItem.tooltip = allSelectionOffsets.map(({ start, end }) => `[${start}, ${end})`).join('\n');
    statusBarItem.show();
};
exports.onSelectionChange = onSelectionChange;
const onCommand = (cmd) => __awaiter(void 0, void 0, void 0, function* () {
    switch (cmd) {
        case constant_1.command.gotoOffset:
            return gotoOffset();
        case constant_1.command.gotoSelection:
            return gotoSelection();
        default:
            throw new Error(`Unsupported command: ${cmd}`);
    }
});
exports.onCommand = onCommand;
const gotoOffset = () => __awaiter(void 0, void 0, void 0, function* () {
    const { activeTextEditor, activeTextEditor: { document, }, } = vscode_1.window;
    const maximumOffset = getMaximumOffset();
    const cursorOffset = getCursorOffset();
    const input = yield vscode_1.window.showInputBox({
        value: cursorOffset.toString(),
        prompt: `Please enter an offset: 0 ~ ${maximumOffset}`,
        validateInput: (input) => __awaiter(void 0, void 0, void 0, function* () {
            const offset = +input;
            if (isNaN(offset)) {
                return 'Number required';
            }
        }),
    });
    // if canceled (eg. press `Esc`)
    if (input == null) {
        return;
    }
    const position = document.positionAt(+input);
    activeTextEditor.selection = new vscode_1.Selection(position, position);
    yield showPositionInTheDocument(position);
});
const gotoSelection = () => __awaiter(void 0, void 0, void 0, function* () {
    const { activeTextEditor, activeTextEditor: { document, }, } = vscode_1.window;
    const maximumOffset = getMaximumOffset();
    const [{ start, end }] = getAllSelectionOffsets();
    const format = /^ *?(\d+) *?, *?(\d+) *$/;
    const input = yield vscode_1.window.showInputBox({
        value: `${start}, ${end}`,
        prompt: `Please enter a selection: \`0, 0\` ~ \`${maximumOffset}, ${maximumOffset}\``,
        validateInput: (input) => __awaiter(void 0, void 0, void 0, function* () {
            if (!format.test(input)) {
                return 'Please input selection in the format as follow: `number, number`';
            }
        }),
    });
    // if canceled (eg. press `Esc`)
    if (input == null) {
        return;
    }
    const [, startOffset, endOffset] = format.exec(input);
    const startPosition = document.positionAt(+startOffset);
    const endPosition = document.positionAt(+endOffset);
    activeTextEditor.selection = new vscode_1.Selection(startPosition, endPosition);
    yield showPositionInTheDocument(startPosition);
});
const showPositionInTheDocument = (position) => __awaiter(void 0, void 0, void 0, function* () {
    const { activeTextEditor: { document, }, } = vscode_1.window;
    // focus the cursor to the document
    vscode_1.window.showTextDocument(document);
    // show cursor at the middle of the editor
    yield vscode_1.commands.executeCommand("revealLine", {
        lineNumber: position.line,
        at: 'center',
    });
});
const getAllSelectionOffsets = () => {
    const { activeTextEditor: { document, selections, }, } = vscode_1.window;
    const selectionOffsets = selections.map(({ start, end, anchor, active }) => ({
        start: document.offsetAt(start),
        end: document.offsetAt(end),
        anchor: document.offsetAt(anchor),
        active: document.offsetAt(active),
    }));
    return selectionOffsets;
};
// if there are many selections, show cursor offset in the first selection
const getCursorOffset = () => {
    const { activeTextEditor: { document, selection: { active, }, }, } = vscode_1.window;
    const offset = document.offsetAt(active);
    return offset;
};
// the magic way to compute the maximum offset of an arbitrary document
const getMaximumOffset = () => {
    const offset = vscode_1.window.activeTextEditor.document.offsetAt(new vscode_1.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
    return offset;
};
//# sourceMappingURL=event.js.map