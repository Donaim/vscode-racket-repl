"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os = require('os');
const os_type = os.platform();
class REPLManager {
    constructor() {
        this._terminal = this.init_terminal();
    }
    //Instantiate a new REPL terminal.
    init_terminal() {
        return vscode.window.createTerminal("Racket");
    }
    //Runs the REPL using the current file.
    run(fileUri) {
        return __awaiter(this, void 0, void 0, function* () {
            //Always run in a new terminal (I found no other way to close the Racket shell)
            //Stop the old terminal
            this.stop(this._terminal);
            //Create a new terminal
            this._terminal = this.init_terminal();
            var dir = fileUri.path.substring(0, fileUri.path.lastIndexOf("/"));
            dir = this.formatPath(dir);
            const file = fileUri.path.substring(fileUri.path.lastIndexOf("/") + 1);
            //Start the REPL.
            this.launch(dir, file);
			//Focus terminal.
			this._terminal.show(false);
		});
    }
    //Stops the REPL in the given terminal (defaults to running terminal).
    stop(terminal = this._terminal) {
        return __awaiter(this, void 0, void 0, function* () {
            terminal.hide();
            const pid = yield terminal.processId;
            //On windows and linux/mac require a different kill method.
            switch (os_type) {
                case 'win32': {
                    const kill = require('tree-kill');
                    kill(pid);
                    return;
                }
                default: {
                    const exec = require('child_process').exec;
                    exec(`kill -9 ${pid}`); //kill terminal process using SIGKILL
                }
            }
        });
    }
    //Stop REPL when object gets disposed.
    dispose() {
        this.stop();
    }
    //Formats a filepath correctly.
    formatPath(path) {
        switch (os_type) {
            //On Windows systems, remove the first "/" in "/c:..."
            case 'win32': return path.substr(1, path.length);
            default: return path;
        }
    }
    //Launches the REPL script.
    //This is a Rust program which clears the current terminal and then launches the REPL.
    //Each OS has a different binary.
    launch(dir, file) {
        var launcher;
        switch (os_type) {
            case 'win32':
                launcher = `./launch_windows.bat ${dir} ${file}`;
                break;
            case 'linux':
                launcher = `sh launch_linux ${dir} ${file} ; exit`;
                break;
            case 'darwin':
                launcher = `./launch_mac ${dir} ${file}`;
                break;
            default: {
                vscode.window.showErrorMessage(`Your operating system: ${os_type}, is not yet supported.`);
                return;
            }
        }
		//Rust program launches Racket REPL and cleans up terminal, this hides the "sendText" command

		this._terminal.sendText(`cd ${__dirname}`); //binaries are stored in "out" folder
		this._terminal.sendText(launcher);
    }
}
exports.REPLManager = REPLManager;
//# sourceMappingURL=replManager.js.map