import { ExtensionContext } from 'vscode';
import showOffset from './offset';

const activate = (context: ExtensionContext) => {
  showOffset(context);
};

export {
  activate,
};
