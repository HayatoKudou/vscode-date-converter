import * as vscode from 'vscode';
import { env } from 'vscode';
import DateHoverProvider from './DateProvider';

export function activate(context: vscode.ExtensionContext) {

	let userLanguage = env.language;
	const dateHoverProvider = new DateHoverProvider(userLanguage);
	context.subscriptions.push(dateHoverProvider, vscode.languages.registerHoverProvider('*', dateHoverProvider));
}
