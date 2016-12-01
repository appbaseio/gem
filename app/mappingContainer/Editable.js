import {default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { defaultTypes, defaultIndexType } from '../service/default';

export class Editable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editValue: ''
		};
		this.types = defaultTypes['2.x'];
		this.indexes = defaultIndexType;
	}
	componentWillMount() {
		this.setState({
			editValue: this.props.editValue
		});
		this.props.editCb(this.props.editKey, this.props.editValue);
		this.version = dataOperation.inputState.version && dataOperation.inputState.version.charAt(0) === '5' ? '5.x' : '2.x';
		this.types = defaultTypes[this.version];
	}
	inputHandle() {
		let editValue = this.refs.editInput.value;
		this.setState({
			editValue: editValue
		});
		this.props.editCb(this.props.editKey, editValue);
	}
	getOptions(data, placeholder) {
		let types = data.map((type, i) => {
			return (<option key={i} value={type}>{type}</option>)
		});
		types.unshift(<option key={-1} value=''>{placeholder}</option>);
		return types;
	}
	getData(method) {
		let obj = {
			data: [],
			placeholder: ''
		};
		switch(method) {
			case 'type':
				obj.data = this.types;
				obj.placeholder = 'select datatype';
			break;
			case 'index':
				obj.data = this.indexes;
				obj.placeholder = 'select index type';
			break;
			case 'analyzer':
				obj.data = this.props.registeredAnalyzers;
				obj.placeholder = 'select analyzer';
			break;
		}
		return obj;
	}
	inputOptions() {
		let inputSample;
		switch (this.props.editKey) {
			case 'type':
			case 'index':
			case 'analyzer': {
				let getRelated = this.getData(this.props.editKey);
				inputSample = (
					<select className="form-control" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} >
						{this.getOptions(getRelated.data, getRelated.placeholder)}
					</select>
				);
				break;
			}
			case 'fieldName':
			default: {
				inputSample = (<input className="form-control" type="text" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} placeholder={this.props.placeholder} ></input>);
				break;
			}
		}
		return inputSample;
	}
	render() {
		return (
			<div className={"editableContainer col-xs-12" + (this.props.defaultEdit ? ' on ' : ' off ')}>
				<div className="frontEditable">
					{this.props.editValue}
				</div>
				<div className="backEditable">
					<div className="form-group">
						{this.inputOptions()}
					</div>
				</div>
			</div>
		);
	}
}
