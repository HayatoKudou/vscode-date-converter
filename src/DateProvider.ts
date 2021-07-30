import * as vscode from 'vscode';

class DateHoverProvider implements vscode.HoverProvider {

    userLanguage: string;

    constructor(userLanguage: string){
        this.userLanguage = userLanguage;
    }

    private dateRegexp = {
        iso8601: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|\+\d{2}:\d{2})/,
        rfc2822: /\d(?:(Sun|Mon|Tue|Wed|Thu|Fri|Sat),\s+)?(0[1-9]|[1-2]?[0-9]|3[01])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19[0-9]{2}|[2-9][0-9]{3})\s+(2[0-3]|[0-1][0-9]):([0-5][0-9])(?::(60|[0-5][0-9]))?\s+([-\+][0-9]{2}[0-5][0-9]|(?:UT|GMT|(?:E|C|M|P)(?:ST|DT)|[A-IK-Z]))(\s+|\(([^\(\)]+|\\\(|\\\))*\))*/,
        mysql: /\d([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?/,
        dateHyphen1: /\d{4}-\d{2}-\d{2}/,
        dateHyphen2: /\d{2}-\d{2}-\d{4}/,
        dateSlash1: /\d{4}\/\d{2}\/\d{2}/,
        dateSlash2: /\d{2}\/\d{2}\/\d{4}/,
        unix: /\d{9,14}/
    };

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        let date: any = undefined;
        let format: string = '';

        // ISO-8601形式の日付文字列を検出
        const isoRange = document.getWordRangeAtPosition(position, this.dateRegexp.iso8601);
        if (isoRange) {
            const hoveredWord = document.getText(isoRange);
            format = 'ISO 8601';
            date = Date.parse(hoveredWord);
        }

        // RFC 2822形式の日付文字列を検出
        const rfc2822 = document.getWordRangeAtPosition(position, this.dateRegexp.rfc2822);
        if (rfc2822) {
            const hoveredWord = document.getText(rfc2822);
            format = 'RFC 2822';
            date = Date.parse(hoveredWord);
        }

        // mysql date形式の日付文字列を検出
        const mysql = document.getWordRangeAtPosition(position, this.dateRegexp.mysql);
        if (mysql) {
            const hoveredWord = document.getText(mysql);
            format = 'mysql';
            date = Date.parse(hoveredWord);
        }

        // YYYY-MM-DD形式の日付文字列を検出
        const dateHyphen1 = document.getWordRangeAtPosition(position, this.dateRegexp.dateHyphen1);
        if (dateHyphen1) {
            const hoveredWord = document.getText(dateHyphen1);
            format = 'YYYY-MM-DD';
            date = Date.parse(hoveredWord);
        }

        // YYYY-MM-DD形式の日付文字列を検出
        const dateSlash1 = document.getWordRangeAtPosition(position, this.dateRegexp.dateSlash1);
        if (dateSlash1) {
            const hoveredWord = document.getText(dateSlash1);
            format = 'YYYY/MM/DD';
            date = Date.parse(hoveredWord);
        }

        // DD-MM-YYYY形式の日付文字列を検出
        const dateHyphen2 = document.getWordRangeAtPosition(position, this.dateRegexp.dateHyphen2);
        if (dateHyphen2) {
            const hoveredWord = document.getText(dateHyphen2);
            format = 'DD-MM-YYYY';
            date = Date.parse(hoveredWord);
        }

        // DD-MM-YYYY形式の日付文字列を検出
        const dateSlash2 = document.getWordRangeAtPosition(position, this.dateRegexp.dateSlash2);
        if (dateSlash2) {
            const hoveredWord = document.getText(dateSlash2);
            format = 'DD/MM/YYYY';
            date = Date.parse(hoveredWord);
        }

        // UNIX形式の日付文字列を検出
        const unixRange = document.getWordRangeAtPosition(position, this.dateRegexp.unix);
        if (unixRange) {
            const hoveredWord = document.getText(unixRange);
            format = 'UNIX time';
            date = Number(hoveredWord) * 1000;
        }

        if (date !== undefined && format !== '') {
            const dateObj = new Date(date);
            const dateStr = dateObj.toTimeString();

            const defaultLocale = this.userLanguage;
            const dateLocale = dateObj.toLocaleString(defaultLocale);
            const dateLocaleLanguage = defaultLocale;
            const dateUnix = dateObj.getTime();
            const markdown: any = this.markdown(format, dateStr, dateLocale, dateLocaleLanguage, dateUnix);
            return markdown ? new vscode.Hover(markdown) : undefined;
        }
    }

    markdown(name: string, dateStr: string, dateLocale: string, dateLocaleLanguage: string, dateUnix: Number) {
        const markdown = new vscode.MarkdownString(`<span style="color:#fff;background-color:#666;">&nbsp;&nbsp;&nbsp; ${name} &nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;${dateLocaleLanguage}`);
        const codeBlock =
 `Date: ${dateStr}
Locale: ${dateLocale}
UNIX: ${dateUnix}`;
        markdown.appendCodeblock(codeBlock, "javascript");
        markdown.isTrusted = true;
        return markdown;
    }

    dispose() {
        // no operation
    }
}

export default DateHoverProvider;