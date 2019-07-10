"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const replManager_1 = require("./replManager");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //Manages terminal and REPL.
    const manager = new replManager_1.REPLManager();
    //Register run command
    let run = vscode.commands.registerTextEditorCommand('racket-repl.run', (editor) => {
        const filepath = editor.document.fileName;

        //Start REPL
        manager.run(filepath);
        // Display a message box to the user containing the filename.
        vscode.window.showInformationMessage('Running: ' + filepath.substr(filepath.lastIndexOf('/') + 1));
    });
    //Register stop command
    let stop = vscode.commands.registerCommand('racket-repl.stop', () => {
        //Stop REPL
        manager.stop();
    });
    context.subscriptions.push(run);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
