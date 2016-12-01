export const codemirrorOptions = {
	lineNumbers: false,
	mode: "markdown",
	autoCloseBrackets: true,
	matchBrackets: true,
	showCursorWhenSelecting: true,
	tabSize: 2,
	extraKeys: { "Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); } },
	foldGutter: true,
	gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
};
export const closeError = function() {
	let error = this.state.error;
	error.title = null;
	error.message = null;
	this.setState({
		error: error
	});
}
export const isJson = function(jsonInput) {
	let validFlag = true;
	if (jsonInput != "") {
		try {
			jsonInput = JSON.parse(jsonInput);
		} catch (e) {
			validFlag = false;
		}
	} else {
		validFlag = false;
	}
	return {
		validFlag: validFlag,
		jsonInput: jsonInput
	};
}