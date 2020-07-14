"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const event_1 = require("./event");
const showOffset = (context) => {
    const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
    statusBarItem.command = 'offset.goto';
    // dispose statusBarItem while extension deactivate
    context.subscriptions.push(statusBarItem);
    // show status bar when document opened
    context.subscriptions.push(vscode_1.workspace.onDidOpenTextDocument(() => event_1.onSelectionChange(statusBarItem)));
    // hide status bar when document closed
    context.subscriptions.push(vscode_1.workspace.onDidCloseTextDocument(() => statusBarItem.hide()));
    // user select some charaters
    context.subscriptions.push(vscode_1.window.onDidChangeTextEditorSelection(() => event_1.onSelectionChange(statusBarItem)));
    // user click the status bar
    context.subscriptions.push(vscode_1.commands.registerCommand(statusBarItem.command, event_1.onStatusBarClick));
};
exports.default = showOffset;
//# sourceMappingURL=index.js.map