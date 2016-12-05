import { default as React, Component } from 'react';
import { render } from 'react-dom';
import Select2 from 'react-select2-wrapper';
import { dataOperation } from '../../service/DataOperation';
import { ErrorModal } from '../../others/ErrorModal';
import { MappingLink } from '../../appLogin/MappingLink';
import {codemirrorOptions, closeError, isJson} from '../../others/helper';

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
			importType: "data",
			mappingObj: {
				inputFormat: 'data',
				input: {}
			}
		};
		this.mappingOptions = [{
			value: 'data',
			placeholder: 'Data as JSON'
		}, {
			value: 'mapping',
			placeholder: 'Mappings as JSON'
		}];
		this.onTypeSelection = this.onTypeSelection.bind(this);
		this.updateCode = this.updateCode.bind(this);
		this.closeError = closeError.bind(this);
		this.submit = this.submit.bind(this);
		this.importTypeChange = this.importTypeChange.bind(this);
	}
	componentWillMount() {
		if (this.props.input_mapping && this.props.input_mapping.inputFormat && this.props.input_mapping.input) {
			let stateObj = {
				mappingObj: this.props.input_mapping,
				importType: this.props.input_mapping.inputFormat,
				code: JSON.stringify(this.props.input_mapping.input, null, 4),
				selectedType: this.props.input_mapping.selectedType ? this.props.input_mapping.selectedType : ''
			};
			this.setState(stateObj, this.submit.bind(this));
		} else {
			this.submit.call(this);
		}
	}
	updateCode(newCode) {
		this.setState({
			code: newCode
		}, this.submit.bind(this));
	}
	submit() {
		if (this.state.selectedType) {
			let isJson = this.isJson(this.state.code);
			let updateObj = {
				validFlag: isJson.validFlag
			};
			if (isJson.validFlag) {
				let parsedJson = isJson.jsonInput;
				this.props.detectMapping(parsedJson, this.state.selectedType, this.state.importType);
				updateObj.mappingObj = {
					inputFormat: this.state.importType,
					input: parsedJson,
					selectedType: this.state.selectedType
				};
			}
			this.setState(updateObj);
		}
	}
	isJson(jsonInput) {
		return isJson(jsonInput);
	}
	onTypeSelection(select) {
		let selectedType = select.currentTarget.value;
		if (selectedType) {
			this.setState({
				selectedType
			}, this.submit);
		}
	}
	getValidMessage() {
		return this.props.mappings ? (this.props.successMessage ? this.props.successMessage : (this.state.selectedType ? (this.state.validFlag ? 'JSON is valid  ☺.' : 'JSON is invalid  ☹.') : 'Type is not selected')) : 'Appname and url is not preset.';
	}
	importTypeChange(type) {
		this.setState({
			importType: type
		}, this.submit.bind(this));
	}
	renderRadioOption(options) {
		return options.map((option, index) => {
			return (
				<div key={index} className="col-xs-12 single-option">
					<label className="radio-inline">
						<input type="radio"
							checked={this.state.importType === option.value}
							onChange={() => this.importTypeChange(option.value)}
							name="importType" id="importType" value={option.value} /> {option.placeholder}
					</label>
				</div>
			);
		});
	}
	radioOptions() {
		return (
			<div className="row">
				{this.renderRadioOption(this.mappingOptions)}
			</div>
		);
	}
	renderComponent(method) {
		let element;
		switch (method) {
			case 'label':
				if (this.state.selectedType && this.state.selectedType != '') {
					element = (<label className="col-xs-12 p-0 pd-0">Selected Type:</label>);
				}
				break;
		}
		return element;
	}
	render() {
		this.types = [];
		if (this.props.mappings) {
			this.types = Object.keys(this.props.mappings);
			if (this.props.input_mapping && this.props.input_mapping.selectedType && this.types.indexOf(this.props.input_mapping.selectedType) < 0) {
				this.types.push(this.props.input_mapping.selectedType);
			}
			this.types.unshift('');
		} else if (this.props.input_mapping.selectedType) {
			this.types.push(this.props.input_mapping.selectedType);
		}
		return (
			<div className="JsonImport col-xs-12 col-sm-6">
				<div className={"json-header alert "+(this.state.validFlag ? 'success alert-success' : 'error alert-danger')}>
					<h3 className="title">
						<MappingLink shareAllowed={this.state.validFlag && this.props.mappings} mappingObj={this.state.mappingObj} />
						<span className="pull-left col-xs-12 col-sm-6 importType">
							{this.radioOptions()}
						</span>
						<span className={"pull-right extra-options col-xs-12 col-sm-6 "+ (this.state.selectedType && this.state.selectedType != '' ? 'selected' : '')}>
							{this.renderComponent('label')}
							<div className="col-xs-12 pd-0">
								<Select2
									multiple={false}
									data={ this.types }
									value={this.state.selectedType}
									options={{
										placeholder: 'Choose or create a Type',
										tags: true
									}}
									onChange={this.onTypeSelection}
								/>
							</div>
						</span>
					</h3>
				</div>
				<span className={"json-valid-message import-bottom alert "+(this.state.validFlag ? 'alert-success' : 'alert-danger')}>
					{this.getValidMessage()}
				</span>
				<Codemirror ref="editor" value={this.state.code} onChange={this.updateCode} placeholder='Add json here' options={codemirrorOptions} />
				<ErrorModal {...this.state.error} closeError={this.closeError} />
			</div>
		);
	}
}
