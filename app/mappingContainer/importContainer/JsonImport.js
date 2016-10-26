import { default as React, Component } from 'react';
import { render } from 'react-dom';
import Select2 from 'react-select2-wrapper';
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
require('codemirror/addon/display/placeholder');
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
      },
      validFlag: false,
      "importType": "data"
  	};
    this.codemirrorOptions = {
      lineNumbers: false,
      mode: "javascript",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      tabSize: 2,
      extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    this.onTypeSelection = this.onTypeSelection.bind(this);
  	this.updateCode = this.updateCode.bind(this);
    this.closeError = this.closeError.bind(this);
    this.submit = this.submit.bind(this);
    this.importTypeChange = this.importTypeChange.bind(this);
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
    if(this.state.selectedType) {
      let isJson = this.isJson(this.state.code);
      if(isJson.validFlag) {
        let parsedJson = isJson.jsonInput;
        this.props.detectMapping(parsedJson, this.state.selectedType, this.state.importType);
      } 
      this.setState({
        validFlag: isJson.validFlag
      });
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
  onTypeSelection(select) {
    let selectedType = select.currentTarget.value;
    if(selectedType) {
      this.setState({
        selectedType
      }, this.submit);
    }
  }
  getValidMessage() {
    return this.state.selectedType ? (this.state.validFlag ? 'Json is valid.' : 'Json is invalid.') : 'Type is not selected';
  }
  importTypeChange(type) {
    this.setState({
      importType: type
    }, this.submit.bind(this));
  }
  radioOptions() {
    return (
      <div className="row">
        <div className="col-xs-12 single-option">
          <label className="radio-inline">
            <input type="radio"
              checked={this.state.importType === 'data'} 
              onChange={() => this.importTypeChange('data')} 
              name="importType" id="importType" value="data" /> json data
          </label>
        </div>
        <div className="col-xs-12 single-option">
          <label className="radio-inline">
            <input type="radio" 
              checked={this.state.importType === 'mapping'} 
              onChange={() => this.importTypeChange('mapping')} 
              name="importType1" id="importType1" value="mapping" /> json mapping
          </label>
        </div>
      </div>
    );
  }
  render() {
    this.types = Object.keys(this.props.mappings);
    this.types.unshift('');
    return (
    	<div className="JsonImport col-xs-12 col-sm-6">
        <div className={"json-header "+(this.state.validFlag ? 'success' : 'error')}>
          <h3 className="title">
            <span className="pull-left col-xs-12 col-sm-6 importType">
              {this.radioOptions()}
            </span>
            <span className="pull-right extra-options col-xs-12 col-sm-6">
              <Select2
                multiple={false}
                data={ this.types }
                value={this.state.selectedType}
                options={{
                  placeholder: 'Choose or create a new type',
                  tags: {true}
                }}
                onChange={this.onTypeSelection}
              />
            </span>
          </h3>
        </div>
        <span className={"json-valid-message import-bottom "+(this.state.validFlag ? 'text-success' : 'text-danger')}>
          {this.getValidMessage()}
        </span>
    		<Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} 
        placeholder='Add json here' options={this.codemirrorOptions} />
    		<ErrorModal {...this.state.error} closeError={this.closeError} />
    	</div>
    );
  }
}