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
            const dateObj = new Date(date);
            const dateStr = dateObj.toTimeString();
            const dateLocale = dateObj.toLocaleString("ja");
            const dateLocaleLanguage = "ja";
            const dateUnix = dateObj.getTime();
            const markdown: any = this.markdown(format, dateStr, dateLocale, dateLocaleLanguage, dateUnix);
            return markdown ? new vscode.Hover(markdown) : undefined;
        }
    }

    markdown(name: string, dateStr: string, dateLocale: string, dateLocaleLanguage: string, dateUnix: Number) {
        const markdown = new vscode.MarkdownString(`<span style="color:#fff;background-color:#666;">&nbsp;&nbsp;&nbsp; ${name} &nbsp;&nbsp;&nbsp;</span>`);
        const codeBlock =
`LocaleString(${dateLocaleLanguage}): ${dateLocale}
Date: ${dateStr}
Unix: ${dateUnix}`;
        markdown.appendCodeblock(codeBlock, "javascript");
        markdown.isTrusted = true;
        return markdown;
    }

    dispose() {
        // no operation
    }
}

export default DateHoverProvider;