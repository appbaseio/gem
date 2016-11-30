import { default as React, Component } from 'react';
import { render } from 'react-dom';
import Select2 from 'react-select2-wrapper';
import { dataOperation } from '../../service/DataOperation';
import { ErrorModal } from '../../others/ErrorModal';
var Codemirror = require('react-codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/dialog/dialog.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/comment/comment.js');
require('codemirror/addon/display/placeholder');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');

export class JsonImport extends Component {
  constructor(props) {
    super(props);
    this.sample = null;
  	this.state = {
  		code: '',
      error: {
        title: null,
        message: null
      },
      validFlag: false,
      "importType": "data"
  	};
    this.codemirrorOptions = {
      lineNumbers: false,
      mode: "markdown",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      tabSize: 2,
      extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    this.sampleObj = {
      "analyzer": {
        "standard_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "asciifolding"
          ]
        },
        "whitespace_analyzer": {
          "type": "whitespace",
          "tokenizer": "whitespace",
          "filter": [
            "lowercase",
            "asciifolding"
          ]
        }
      }
    };
    this.onTypeSelection = this.onTypeSelection.bind(this);
  	this.updateCode = this.updateCode.bind(this);
    this.closeError = this.closeError.bind(this);
    this.submit = this.submit.bind(this);
    this.importTypeChange = this.importTypeChange.bind(this);
    this.applySettings = this.applySettings.bind(this);
  }
  componentWillMount() {
    this.submit.call(this);
  }
  updateCode(newCode) {
  	this.setState({
  	    code: newCode
  	}, this.submit.bind(this));
  }
  loadSample() {
    this.updateCode(JSON.stringify(this.sampleObj, null, 4));
  }
  submit() {
    let isJson = this.isJson(this.state.code);
    if(isJson.validFlag) {
      let parsedJson = isJson.jsonInput;
      this.props.handleUpdate(parsedJson, this.state.selectedType, this.state.importType);
    }
    this.setState({
      validFlag: isJson.validFlag
    });
  }
  applySettings() {
    this.props.handleSubmit();
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
    console.log(jsonInput, validFlag);
    return {
      validFlag: validFlag,
      jsonInput: jsonInput
    };
  }
  onTypeSelection(select) {
    let selectedType = select.currentTarget.value;
    if(selectedType) {
      this.setState({
        selectedType
      }, this.submit);
    }
  }
  getValidMessage() {
    return  this.props.successMessage ? this.props.successMessage : (this.state.validFlag ? 'JSON is valid  ☺.' : 'JSON is invalid  ☹.');
  }
  importTypeChange(type) {
    this.setState({
      importType: type
    }, this.submit.bind(this));
  }
  render() {
    this.types = Object.keys(this.props.mappings);
    this.types.unshift('');
    return (
    	<div className="JsonImport col-xs-12">
        <span className={"json-valid-message import-bottom "+(this.state.validFlag ? 'text-success' : 'text-danger')}>
          {this.getValidMessage()}
        </span>
        <button
          onClick={() => this.applySettings()}
          className="btn btn-yellow import-bottom btn-submit">
          Apply settings
        </button>
        <button
          onClick={() => this.loadSample()}
          className="btn btn-yellow load-sample btn-submit">
          Load sample
        </button>
    		<Codemirror ref="editor" value={this.state.code} onChange={this.updateCode}
        placeholder='Add json here' options={this.codemirrorOptions} />
    		<ErrorModal {...this.state.error} closeError={this.closeError} />
    	</div>
    );
  }
}
