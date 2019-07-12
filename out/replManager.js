"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os = require('os');
const os_type = os.platform();
class REPLManager {
    constructor() {
        this._terminal = null;
    }
    //Instantiate a new REPL terminal.
    init_terminal() {
        return vscode.window.createTerminal("Racket");
    }
    //Runs the REPL using the current file.
    run(filepath) {
		//Always run in a new terminal (I found no other way to close the Racket shell)
		//Stop the old terminal
		this.stop(this._terminal);

		//Create a new terminal
		var dir = filepath.substring(0, filepath.lastIndexOf("/"));
		dir = this.formatPath(dir);
		const file = filepath.substring(filepath.lastIndexOf("/") + 1);
		// Start the REPL.

		this.launch(dir, file);
		// Focus terminal.
		this._terminal.show(false);
    }
    //Stops the REPL in the given terminal (defaults to running terminal).
    stop(terminal = this._terminal) {
		if (this._terminal == null) { return null; }

		terminal.hide();
		const pid = terminal.processId;
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
		this._terminal = vscode.window.createTerminal("Racket", "/bin/sh", ["-c", `racket -i -f "${__dirname}/enter.rkt" "${dir}" "${file}"`]);
    }
}
exports.REPLManager = REPLManager;
//# sourceMappingURL=replManager.js.map
