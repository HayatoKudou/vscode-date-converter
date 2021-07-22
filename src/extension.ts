import * as vscode from 'vscode';
import DateHoverProvider from './DateProvider';

export function activate(context: vscode.ExtensionContext) {
	const dateHoverProvider = new DateHoverProvider();
	context.subscriptions.push(dateHoverProvider, vscode.languages.registerHoverProvider('*', dateHoverProvider));
}
