import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/DataOperation';
import { ErrorModal } from '../../others/ErrorModal';
var Codemirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/dialog/dialog.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/comment/comment.js');
require('codemirror/addon/comment/comment.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/keymap/sublime.js');

export class JsonImport extends Component {
  constructor(props) {
    super(props);
    this.sample = {
      "name": "Foo",
      "id": 1234,
      "flag": true,
      "location": {
        "lat": 1234,
        "lon": 1234
      },
      "place": {
        "country": "india",
        "city": "ahmedabad",
        "pincode": 380055
      }
    };
  	this.state = {
  		code: JSON.stringify(this.sample, null, 4),
      error: {
        title: null,
        message: null
      }
  	};
  	this.updateCode = this.updateCode.bind(this);
    this.closeError = this.closeError.bind(this);
  }
  componentWillMount() {
    this.submit.call(this);
  }
  updateCode(newCode) {
  	this.setState({
  	    code: newCode
  	}, this.submit.bind(this));
  }
  submit() {
    if(this.props.selectedType.length === 1) {
      let isJson = this.isJson(this.state.code);
      if(isJson.validFlag) {
        let parsedJson = isJson.jsonInput;
        this.props.detectMapping(parsedJson);
      } 
    }
  }
  closeError() {
    let error = this.state.error;
    error.title = null;
    error.message = null;
    this.setState({
      error: error
    });
  }
  isJson(jsonInput) {
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
  render() {
  	 var options = {
  	 	lineNumbers: true,
        mode: "javascript",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        tabSize: 2,
        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    return (
    	<div className="JsonImport col-xs-12 col-sm-6">
    		<Codemirror value={this.state.code} onChange={this.updateCode} options={options} />
    		<div className="submit-row">
    			<button onClick={() => this.submit()} className="btn btn-primary btn-submit">Submit</button>
    		</div>
        <ErrorModal {...this.state.error} closeError={this.closeError} />
    	</div>
    );
  }
}

// test
/*
{
  "name": "Foo",
  "id": 1234,
  "flag": true,
  "location": {
    "lat": 1234,
    "lon": 1234
  },
  "place": {
    "country": "india",
    "city": "ahmedabad",
    "pincode": 380055
  }
}
*/