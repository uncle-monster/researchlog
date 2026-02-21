const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * 激活扩展时调用。
 * - 记录/读取本工作区的 researchlog 起始日期（年/月/日）。
 * - 在项目根目录下创建 researchlog 文件夹（若不存在）。
 * - 注册创建日志命令。
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const state = context.workspaceState;

    const disposable = vscode.commands.registerCommand('researchlog.createLog', async () => {
        const workspaceFoldersInner = vscode.workspace.workspaceFolders;
        if (!workspaceFoldersInner || workspaceFoldersInner.length === 0) {
            vscode.window.showWarningMessage('researchlog: 请先打开一个包含项目的工作区。');
            return;
        }

        const rootPathInner = workspaceFoldersInner[0].uri.fsPath;
        let start = state.get('researchlog.startDate');

        if (!start) {
            const nowForStart = new Date();
            start = formatDate(nowForStart);
            await state.update('researchlog.startDate', start);
        }

        const startParts = String(start).split('/');
        const startDateObj = new Date(
            parseInt(startParts[0], 10),
            parseInt(startParts[1], 10) - 1,
            parseInt(startParts[2], 10)
        );

        const now = new Date();
        const diffMs = toMidnight(now).getTime() - toMidnight(startDateObj).getTime();
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

        const logDirInner = path.join(rootPathInner, 'researchlog');
        if (!fs.existsSync(logDirInner)) {
            fs.mkdirSync(logDirInner, { recursive: true });
        }

        const fileName = `${diffDays}.md`;
        const filePath = path.join(logDirInner, fileName);

        if (!fs.existsSync(filePath)) {
            const content = `# Day ${diffDays} (${formatDate(now)})\n\n`;
            fs.writeFileSync(filePath, content, { encoding: 'utf8' });
        }

        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
    });

    context.subscriptions.push(disposable);
}

/**
 * 将日期转换为当天 0 点，便于计算天数差。
 * @param {Date} date
 */
function toMidnight(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * 按 年/月/日 格式化日期。
 * @param {Date} date
 */
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
