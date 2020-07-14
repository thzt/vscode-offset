import {
  ExtensionContext, StatusBarAlignment,
  window, commands, workspace,
} from 'vscode';

import { onSelectionChange, onCommand } from './event';
import { command } from './constant';

const showOffset = (context: ExtensionContext) => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);

  // dispose statusBarItem while extension deactivate
  context.subscriptions.push(statusBarItem);

  // show status bar when document opened
  context.subscriptions.push(workspace.onDidOpenTextDocument(() => onSelectionChange(statusBarItem)));
  // hide status bar when document closed
  context.subscriptions.push(workspace.onDidCloseTextDocument(() => statusBarItem.hide()));

  // user select some charaters
  context.subscriptions.push(window.onDidChangeTextEditorSelection(() => onSelectionChange(statusBarItem)));

  // user click the status bar
  statusBarItem.command = command.gotoOffset;
  context.subscriptions.push(commands.registerCommand(command.gotoOffset, () => onCommand(command.gotoOffset)));

  // goto selection command
  context.subscriptions.push(commands.registerCommand(command.gotoSelection, () => onCommand(command.gotoSelection)));
};

export default showOffset;
