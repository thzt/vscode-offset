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
exports.onStatusBarClick = exports.onSelectionChange = void 0;
const vscode_1 = require("vscode");
const onSelectionChange = (statusBarItem) => {
    // this event would trigger even there was no active text editor
    if (vscode_1.window.activeTextEditor == null) {
        return;
    }
    const allSelectionOffsets = getAllSelectionOffsets();
    // only show the first selection offset in the status bar
    const [{ start, end }] = allSelectionOffsets;
    statusBarItem.text = `Offset [${start}, ${end})`;
    // show all selections' offset in the status bar tooltip
    statusBarItem.tooltip = allSelectionOffsets.map(({ start, end }) => `[${start}, ${end})`).join('\n');
    statusBarItem.show();
};
exports.onSelectionChange = onSelectionChange;
const onStatusBarClick = () => __awaiter(void 0, void 0, void 0, function* () {
    const { activeTextEditor, activeTextEditor: { document, }, } = vscode_1.window;
    // the magic way to compute the maximum offset of an arbitrary document
    const maxOffset = document.offsetAt(new vscode_1.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
    const cursorOffset = getCursorOffset();
    const input = yield vscode_1.window.showInputBox({
        value: cursorOffset.toString(),
        prompt: `Please enter an offset: 0 ~ ${maxOffset}`,
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
    // focus the cursor to the document
    vscode_1.window.showTextDocument(document);
    // show cursor at the middle of the editor
    yield vscode_1.commands.executeCommand("revealLine", {
        lineNumber: position.line,
        at: 'center',
    });
});
exports.onStatusBarClick = onStatusBarClick;
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
//# sourceMappingURL=event.js.map