import {default as React, Component } from 'react';
import { render } from 'react-dom';
import { Popover, OverlayTrigger, Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { dataOperation } from '../service/DataOperation';
import { SingleField } from './SingleField';
import { Editable } from './Editable';
import { ErrorModal } from '../others/ErrorModal';
import { ReadMore } from '../others/ReadMore';
import { SingleOption } from './SingleOption';
import {updateFailure, closeError, findRegisteredAnalyzer} from '../others/helper';

export class Field extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: [],
			options: [],
			modifiedField: [],
			fieldRecord: {
				index: 'analyzed'
			},
			defaultEdit: false,
			error: {
				title: null,
				message: null
			}
		};
		this.defaultRow = {
			name: '',
			type: '',
			index: 'analyzed',
			analyzer: ''
		};
		this.defaultOption = {
			key: '',
			value: ''
		};
		this.excludeProperties = ['type', 'properties', 'index', 'fields'];
		this.setModifiedField = this.setModifiedField.bind(this);
		this.removeField = this.removeField.bind(this);
		this.closeError = closeError.bind(this);
		this.editCb = this.editCb.bind(this);
		this.optionEdit = this.optionEdit.bind(this);
		this.updateFailure = updateFailure.bind(this);
	}
	componentWillMount() {
		if (this.props.fieldRecord) {
			this.setState({
				fieldRecord: this.props.fieldRecord
			});
		}
	}
	setModifiedField(oldfieldName, newfield) {
		let modifiedField = this.state.modifiedField;
		let fieldRecord = JSON.parse(JSON.stringify(this.state.fieldRecord));
		let fields = fieldRecord.fields;
		let rows = this.state.rows;
		rows = rows.filter((row) => {
			return row.fieldName !== oldfieldName
		});
		if (fields) {
			delete fields[oldfieldName];
		} else {
			fields = {};
		}
		fields[newfield.fieldName] = {
			type: newfield.type
		};
		if (newfield.index) {
			fields[newfield.fieldName].index = newfield.index;
		}
		if (newfield.analyzer) {
			fields[newfield.fieldName].analyzer = newfield.analyzer;
		}
		fieldRecord.fields = fields;
		modifiedField.push(newfield);
		this.fieldRecord = fieldRecord;
		this.modifiedField = modifiedField;
		this.rows = rows;
		this.fieldRecord = fieldRecord;
		this.submit(fieldRecord);
	}
	addField(field, type) {
		let rows = this.state.rows;
		let defaultRow = JSON.parse(JSON.stringify(this.defaultRow));
		rows.push(defaultRow);
		this.setState({
			rows: rows,
			defaultEdit: true
		});
	}
	addOptions() {
		let options = this.state.options;
		let defaultOption = JSON.parse(JSON.stringify(this.defaultOption));
		options.push(defaultOption);
		this.setState(options);
	}
	setTitle(placeholder, readValue) {
		return (<h4 className="sub-title col-xs-12" key="subtitle">{placeholder} <ReadMore link={readValue} /></h4>);
	}
	fieldContent(fields) {
		let title = this.setTitle('Sub Fields', 'subfield');
		let generateFields = [];
		let index = 0;
		for (let singleField in fields) {
			 if (fields.hasOwnProperty(singleField)) {
				index++;
				let fieldMarkup = (
					<SingleField 
						fieldInfo={fields[singleField]} 
						fieldName={singleField}
						field={this.props.field}
						singleType={this.props.singleType} 
						setModifiedField = {this.setModifiedField}
						removeField = {this.removeField}
						view = {this.props.view}
						key={index}>
					</SingleField>);
				generateFields.push(fieldMarkup);
			}
		}
		if (generateFields.length && !this.state.rows.length) {
			generateFields.unshift(title);
		}
		return generateFields;
	}
	addRows() {
		let title = this.setTitle('Sub Fields', 'subfield');
		let generateFields = [];
		let index = 0;
		let existingRows = this.state.rows;
		generateFields = existingRows.map((field, index) => {
			return ( 
					<SingleField fieldInfo = {
							{
								type: field.type,
								index: field.index,
								analyzer: field.analyzer
							}
						}
						fieldName = { field.name }
						defaultEdit = { this.state.defaultEdit }
						field = { field }
						singleType = { this.props.singleType }
						setModifiedField = { this.setModifiedField }
						removeField = { this.removeField }
						view = { this.props.view }
						key = { index }>
					</SingleField>
				);
			});
			if (generateFields.length) {
				generateFields.unshift(title);
			}
			return generateFields;
		}
		removeField() {
			this.setState({
				rows: []
			});
		}
		submit(fieldRecord = this.state.fieldRecord) {
			let request = {
				properties: {
					[this.props.field]: fieldRecord
				}
			};
			if (!this.props.editable) {
				console.log(request);
				dataOperation.updateMapping(request, this.props.singleType).done((res) => {
					this.updateAfterSubmit();
					this.props.getMapping();
				}).fail(this.updateFailure);
			} else {
				this.updateAfterSubmit();
			}
		}
		updateAfterSubmit() {
			this.setState({
				modifiedField: this.modifiedField,
				fieldRecord: this.fieldRecord,
				rows: this.rows,
				defaultEdit: false
			}, function() {
				if (this.props.editable && this.props.subfieldUpdate) {
					this.props.subfieldUpdate(this.state.fieldRecord.fields, this.props.id);
				}
			}.bind(this));
		}
		multipleField() {
			let fieldList = this.props.fieldList.filter((item, index) => this.props.id === item.parent);
			return fieldList.map((item, index) => {
				return (
					<Field 
						mappings = {this.props.mappings}
						fieldRecord = {item.mappingObj}
						field = {item.field}
						singleType = {item.singleType}
						className="singleProperty col-xs-12" 
						fieldList = {this.props.fieldList}
						getMapping = {this.props.getMapping}
						id = {item.id}
						parent = {item.parent}
						editable = {this.props.editable}
						subfieldUpdate = {this.props.subfieldUpdate}
						operationalBtn = {this.props.operationalBtn}
						view = {this.props.view}
						key = {index} >
					</Field>
				);
			})
		}
		editCb(key, value) {
			let fieldRecord = this.state.fieldRecord;
			if ((key === 'type' || key === 'index') && fieldRecord) {
				fieldRecord[key] = value;
				this.setState({
					fieldRecord: fieldRecord
				});
			}
			if (this.props.handleUpdate && value && value !== '') {
				this.props.handleUpdate(key, value, this.props.id);
			}
		}
		optionEdit(index, value, deleteFlag = false) {
			let options = this.state.options;
			if (deleteFlag) {
				options.splice(index, 1);
			} else {
				options[index] = value;
			}
			this.setState(options);
			if (this.props.handleUpdate) {
				this.props.handleUpdate('options', options, this.props.id);
			}
		}
		additionalOptions() {
			let additionalOptionsContainer, additionalOptions = [];
			let fieldRecord = this.state.fieldRecord;
			let fieldName = this.props.field;
			let title = this.setTitle('Add extra properties', 'extraProperties');
			if (this.props.editable && this.state.options.length) {
				additionalOptions = this.state.options.map((option, index) => {
					return (<SingleOption defaultEdit={true} optionEdit={this.optionEdit} key={index} index={index} option={option} />)
				});
			}
			if (additionalOptions.length) {
				additionalOptions.unshift(title);
				additionalOptionsContainer = (<div className="fieldAdditionalRow-container">
		{additionalOptions}
	  </div>);
			}
			return additionalOptionsContainer;
		}
		setJsonPopover() {
			let fieldRecord = this.state.fieldRecord;
			let fieldRecordStringify = JSON.stringify(fieldRecord, null, 2);
			const jsonPopover = (
				<Popover id="jsonPopover" className='jsonPopover'>
		<Highlight className="json">{fieldRecordStringify}</Highlight>
	  </Popover>
			);
			const jsonOverlay = (
				<OverlayTrigger trigger={['click']} rootClose placement="left" overlay={jsonPopover}>
		<button className="jsonPopoverBtn"></button>
	  </OverlayTrigger>
			);
			return jsonOverlay;
		}
		operationalBtn() {
			let addRow, addOptions, operationalBtn;
			let fieldRecord = this.state.fieldRecord;
			let allowSubField = (fieldRecord.type && !this.state.rows.length  && (fieldRecord.type === 'string' || fieldRecord.type === 'text' || fieldRecord.type === 'keyword') && fieldRecord.index !== 'not_analyzed') ? true : false;
			if (!this.props.operationalBtn) {
				if (allowSubField) {
					addRow = (
						<a key="add-subfield" className="btn btn-xs btn-primary pull-right edit-btn" onClick={() => this.addField()} >
							Add subfield
						</a>
					);
				}
				if (fieldRecord.type && !this.state.rows.length && this.props.editable) {
					addOptions = (
						<a key="add-options" className="btn btn-xs btn-primary pull-right add-option-btn" onClick={() => this.addOptions()} >
							Add extra properties
						</a>
					);
				}
			}
			if (fieldRecord.type && this.props.operationalBtn) {
				if (allowSubField) {
					addRow = (
						<MenuItem eventKey="1" onClick={() => this.addField()}>
							Add subfield
						</MenuItem>
					);
				}
				if (this.props.editable && !this.state.options.length) {
					addOptions = (
						<MenuItem eventKey="2" onClick={() => this.addOptions()}>
							Add extra properties
						</MenuItem>
					);
				}
				operationalBtn = (
					<Dropdown id="operationa-btn" pullRight className="edit-btn operational-btn">
						<Dropdown.Toggle>
							<i className="fa fa-ellipsis-v"></i>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{addRow}
							{addOptions}
						</Dropdown.Menu>
					</Dropdown>
				);
			} else {
				operationalBtn = [addRow, addOptions];
			}
			return operationalBtn;
		}
		editableAnalyzer() {
			let fieldRecord = this.state.fieldRecord;
			let analyzer, analyzerRow, registeredAnalyzers = null;
			if (dataOperation.settings && fieldRecord.type) {
				registeredAnalyzers = findRegisteredAnalyzer(dataOperation);
				registeredAnalyzers = registeredAnalyzers ? Object.keys(registeredAnalyzers) : [];
				if (registeredAnalyzers.length) {
					analyzerRow = (
						<span className="fieldAnalyzer col-xs-12 col-sm-6 col-md-3">
							<Editable 
								editKey='analyzer'
								editCb={this.editCb}
								editValue={fieldRecord.analyzer} 
								defaultEdit={true}
								registeredAnalyzers={registeredAnalyzers}
								placeholder="analyzer" />
						</span>
					);
				}
			}
			return analyzerRow;
		}
		setFieldRow() {
			let fieldRecord = this.state.fieldRecord;
			let fieldName = this.props.field;
			let singleType = this.props.parent === 0 ? (<span className="typeName">{this.props.singleType+' / '} </span>) : '';
			let finalField = (
				<div className="field-row">
					<h3 className='title row'>
						{this.setJsonPopover()}
						<span className="col-xs-12 col-sm-4 pd-l0">{singleType} {fieldName}</span>
						<span className="col-xs-12 col-sm-4">
							<span className={'datatype '+ (!fieldRecord.type ? ' hide ' : '')}>
								{fieldRecord.type}
							</span>
						</span>
						<span className={'index '+ (!fieldRecord.index ? ' hide ' : '')}>
							{fieldRecord.index}
						</span>
						{this.operationalBtn()}
					</h3>
					{this.additionalOptions()}
				</div>
			);
			if (this.props.editable) {
				let editableType, editableIndex, editableAnalyzer;
				if (fieldRecord.type) {
					editableType = (
					<span className="col-xs-12 col-sm-6 col-md-3 fieldDataType">
						<Editable
							editKey='type'
							editCb={this.editCb}
							editValue={fieldRecord.type} 
							defaultEdit={true} />
					</span>
					);
					if (fieldRecord.type === 'string') {
						editableIndex = (
							<span className="fieldIndex col-xs-12  col-sm-6 col-md-3">
								<Editable 
									editKey='index'
									editCb={this.editCb}
									editValue={fieldRecord.index || 'analyzed'} 
									defaultEdit={true}
									placeholder="index type" />
							</span>
						);
					}
				}
				finalField = (
					<div className="field-row">
						<h3 className='title row'>
							<span className="fieldName col-xs-12 col-sm-6 col-md-3">
							<Editable 
								editKey='fieldName'
								editCb={this.editCb}
								editValue={fieldName} 
								defaultEdit={true} >
							</Editable>
							</span>
							{editableType}
							{editableIndex}
							{this.editableAnalyzer()}
							{this.operationalBtn()}
						</h3>
						<div>
							{this.additionalOptions()}
						</div>
					</div>
				);
			}
			return finalField;
		}
		render() {
			let fieldRecord = this.state.fieldRecord;
			let fields = fieldRecord.fields;
			return (
				<div className="singleProperty col-xs-12">
					{this.setFieldRow()}
						<div className="fieldContent row">
						{this.addRows()}
						{this.fieldContent(fields)}
						<div className="col-xs-12 nestedField">
							{this.multipleField()}
						</div>
					</div>
					<ErrorModal {...this.state.error} closeError={this.closeError} />
				</div>
			);
		}
	}
