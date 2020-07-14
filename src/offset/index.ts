import {
  ExtensionContext, StatusBarAlignment,
  window, commands, workspace,
} from 'vscode';

import { onSelectionChange, onStatusBarClick } from './event';

const showOffset = (context: ExtensionContext) => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
  statusBarItem.command = 'offset.goto';

  // dispose statusBarItem while extension deactivate
  context.subscriptions.push(statusBarItem);

  // show status bar when document opened
  context.subscriptions.push(workspace.onDidOpenTextDocument(() => onSelectionChange(statusBarItem)));
  // hide status bar when document closed
  context.subscriptions.push(workspace.onDidCloseTextDocument(() => statusBarItem.hide()));

  // user select some charaters
  context.subscriptions.push(window.onDidChangeTextEditorSelection(() => onSelectionChange(statusBarItem)));
  // user click the status bar
  context.subscriptions.push(commands.registerCommand(statusBarItem.command, onStatusBarClick));
};

export default showOffset;
