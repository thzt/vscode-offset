"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const event_1 = require("./event");
const constant_1 = require("./constant");
const showOffset = (context) => {
    const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
    // dispose statusBarItem while extension deactivate
    context.subscriptions.push(statusBarItem);
    // show status bar when document opened
    context.subscriptions.push(vscode_1.workspace.onDidOpenTextDocument(() => event_1.onSelectionChange(statusBarItem)));
    // hide status bar when document closed
    context.subscriptions.push(vscode_1.workspace.onDidCloseTextDocument(() => statusBarItem.hide()));
    // user select some charaters
    context.subscriptions.push(vscode_1.window.onDidChangeTextEditorSelection(() => event_1.onSelectionChange(statusBarItem)));
    // user click the status bar
    statusBarItem.command = constant_1.command.gotoOffset;
    context.subscriptions.push(vscode_1.commands.registerCommand(constant_1.command.gotoOffset, () => event_1.onCommand(constant_1.command.gotoOffset)));
    // goto selection command
    context.subscriptions.push(vscode_1.commands.registerCommand(constant_1.command.gotoSelection, () => event_1.onCommand(constant_1.command.gotoSelection)));
};
exports.default = showOffset;
//# sourceMappingURL=index.js.map