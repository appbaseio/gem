import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';

export class Fields extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    
  }
  generateFieldList() {
    let fieldList = [];
    if(this.props.selectedType && this.props.mappings) {
      let index = 0;
      for(let singleType in this.props.mappings) {
        if(this.props.selectedType.indexOf(singleType) > -1) {
          let fields = this.props.mappings[singleType].properties;
          for(let field in fields) {
            index++;
            let markup = (<div className="singleProperty col-xs-12" key = {index}>
              <h3 className='title row'>
                <span>
                  {field} ({singleType})
                </span>
                <span className='datatype'>
                  {fields[field].type}
                </span>
              </h3>
              <div className="fieldContent row">
                {this.fieldContent(fields[field].fields)}
              </div>
            </div>);
            fieldList.push(markup);
          }
        }
      }  
    }
    return fieldList;
  }
  fieldContent(fields) {
    let generateFields = [];
    let index = 0;
    for(let singleField in fields) {
      index++;
      let fieldMarkup = (<div className="internalField col-xs-12" key={index}>
        <span className="fieldName col-xs-12 col-sm-4">
          {singleField}
        </span>
        <span className="datatype col-xs-12 col-sm-4">
          {fields[singleField].type}
        </span>
        <span className="fieldIndex col-xs-12 col-sm-4">
          {fields[singleField].index}
        </span>
      </div>);
      generateFields.push(fieldMarkup);
    }
    return generateFields;
  }
  render() {
    let fieldList = this.generateFieldList();
    return (
      <div className="FieldContainer">
        {fieldList}
      </div>
    );
  }
}