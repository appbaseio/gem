import {default as React,Component} from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Types } from './Types';
import { Fields } from './Fields';
import { ErrorModal } from '../others/ErrorModal';
import { ImportModal } from './importContainer';
import { ImportSettings } from './importSettings/';
import { closeError } from '../others/helper';

export class MappingContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedType: [],
			error: {
				title: null,
				message: null
			},
			view: 'default',
			key: 1
		};
		this.input_mapping = null;
		this.typeSelection = this.typeSelection.bind(this);
		this.submitField = this.submitField.bind(this);
		this.closeError = closeError.bind(this);
		this.changeView = this.changeView.bind(this);
	}
	componentWillMount() {
		// get mapping object from the input state and delete it from url once applying it.
		dataOperation.getInputState().then((data) => {
			if (data && data.mappingObj) {
				try {
					this.input_mapping = data.mappingObj;
					this.setState({
						view: 'mapping'
					});
					let inputObj = dataOperation.inputState;
					delete inputObj.mappingObj;
					dataOperation.updateInputState(inputObj);
				} catch (e) {}
			}
		}).catch(() => {

		});
	}
	typeSelection(selectedType) {
		let inputState = dataOperation.inputState;
		inputState.selectedType = selectedType;
		inputState.selectedTypes = selectedType;
		dataOperation.updateInputState(inputState);
		this.setState({
			selectedType: selectedType
		});
	}
	submitField(formObj) {
		let mappings = this.props.mappings;
		let fieldObj = {
			type: formObj.datatype,
			index: formObj.index
		};
		if (mappings[formObj.type].hasOwnProperty('properties')) {
			mappings[formObj.type].properties[formObj.name] = fieldObj;
		} else {
			mappings[formObj.type].properties = {
				[formObj.name]: fieldObj
			};
		}
		let request = {
			properties: mappings[formObj.type].properties
		};
		dataOperation.updateMapping(request, formObj.type).done((res) => {
			this.props.setField(mappings);
		}).fail((res) => {
			let error = this.state.error;
			error.title = 'Error';
			error.message = res.responseText;
			this.setState({
				error: error
			});
		});
	}
	changeView() {
		let view = this.state.view === 'default' ? 'mapping' : 'default';
		this.setState({
			view: view
		});
	}
	viewFor() {
		let markup = null;
		let method = this.state.view;
		switch (method) {
			case 'default':
				if (this.props.mappings) {
					markup = (
						<div className="mappingWrapper">
			  <Types 
				key = {0}
				mappings={this.props.mappings}
				setField={this.props.setField}
				typeSelection={this.typeSelection}>
			  </Types>      
			  <Fields 
				key = {1}
				setField={this.props.setField}
				mappings={this.props.mappings} 
				getMapping = {this.props.getMapping}
				selectedType={this.state.selectedType} >
			  </Fields>
			</div>
					);
				}
				break;
			case 'mapping':
				markup = (
					<div className="mappingWrapper">
			  <ImportModal 
				key={1}
				selectedType={this.state.selectedType}
				mappings={this.props.mappings} 
				getMapping={this.props.getMapping}
				changeView = {this.changeView}
				input_mapping = {this.input_mapping}
				>
			  </ImportModal>
			</div>
				);
				break;
		}
		return markup;
	}
	changeViewBtn() {
		let markup = null;
		if (this.props.mappings) {
			let changeViewText = (<span><i className="fa fa-plus"></i> Create New Mappings</span>);
			if (this.state.view !== 'default') {
				changeViewText = (<span><i className="fa fa-table"></i> View Current Mappings</span>);
			}
			let btnClass = this.state.view === 'default' ? 'btn-yellow' : 'btn-primary';
			markup = (
				<div className="btn-group btn-operational">
		  <button type="button" className={"btn viewBtn "+btnClass} onClick={() => this.changeView()}>
			{changeViewText}
		  </button> 
		  <button type="button" className={"btn dropdown-toggle "+btnClass} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<span className="caret"></span>
			<span className="sr-only">Toggle Dropdown</span>
		  </button>
		  <ul className="dropdown-menu pull-right">
			<li>
			  <ImportSettings 
				key={2}
				selectedType={this.state.selectedType}
				mappings={this.props.mappings} 
				getMapping={this.props.getMapping}
				btnClass={btnClass}
			  />
			</li>
		  </ul>
		</div>

			);
		}
		return markup;
	}
	render() {
		let view;
		return (
			<div className={"mappingContainer " + this.state.view+"View"}>
	  {this.viewFor()}
	  {this.changeViewBtn()}
	  <ErrorModal {...this.state.error} closeError={this.closeError} />
	</div>
		);
	}
}
