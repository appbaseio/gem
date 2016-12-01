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
export const copyToClipboard = function(elem) {
	// create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
	var origSelectionStart, origSelectionEnd;
	if (isInput) {
		// can just use the original source element for the selection and copy
		target = elem;
		origSelectionStart = elem.selectionStart;
		origSelectionEnd = elem.selectionEnd;
	} else {
		// must use a temporary form element for the selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = "0";
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = elem.textContent;
	}
	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand("copy");
	} catch (e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	if (isInput) {
		// restore prior selection
		elem.setSelectionRange(origSelectionStart, origSelectionEnd);
	} else {
		// clear temporary content
		target.textContent = "";
	}
	return succeed;
}
export const applyUrl = function(url) {
	this.setState({ url: url, copied: '' });
	setTimeout(function() {
		var ele = document.getElementById('for-share');
		var succeed = this.copyToClipboard(ele);
		if (succeed) {
			this.setState({ copied: 'Link is copied to clipboard!' });
		}
	}.bind(this), 500);
}
export const updateFailure = function(res) {
	let error = this.state.error;
	error.title = 'Error';
	error.message = res.responseText;
	this.setState({
		error: error
	});
}
export const findRegisteredAnalyzer = function(dataOperation) {
	let registeredAnalyzers = null;
	try {
		registeredAnalyzers = dataOperation.settings[dataOperation.inputState.appname].settings.index.analysis.analyzer;
	} catch (e) {
		console.log(e);
	}
	return registeredAnalyzers;
}