import * as vscode from 'vscode';

class DateHoverProvider implements vscode.HoverProvider {
    private dateRegexp = {
        iso8601: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|\+\d{2}:\d{2})/,
        unix: /\d{9,14}/
    };

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        let date: any = undefined;
        let format: string = '';
        let msg = '';

        // ISO-8601形式の日付文字列を検出
        const isoRange = document.getWordRangeAtPosition(position, this.dateRegexp.iso8601);
        if (isoRange) {
            const hoveredWord = document.getText(isoRange);
            format = 'ISO 8601';
            date = Date.parse(hoveredWord);
        }
        const unixRange = document.getWordRangeAtPosition(position, this.dateRegexp.unix);
        if (unixRange) {
            const hoveredWord = document.getText(unixRange);
            format = 'UNIX time';
            date = Number(hoveredWord);
        }

        if (date !== undefined && format !== '') {
            msg = this.buildPreviewMessage(date, format);
        }

        return msg ? new vscode.Hover(msg) : undefined;
    }

    buildPreviewMessage(date: any, formatName: string): string {
        let res = '';
        if (formatName !== '') {
            const dateStr = new Date(date);
            res += this.buildSinglePreviewItem(formatName, dateStr);
        }
        return res;
    }

    buildSinglePreviewItem(name: string, dateString: Date): string {
        return `\n\n*${name}*  \n${dateString}`;
    }

    dispose() {
        // no operation
    }
}

export default DateHoverProvider;