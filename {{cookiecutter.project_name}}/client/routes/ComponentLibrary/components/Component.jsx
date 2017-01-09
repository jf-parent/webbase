import React from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import FormExample from './FormExample'
import SelectExample from './SelectExample'
import GridExample from './GridExample'
import GraphExample from './GraphExample'
import BaseComponent from 'core/BaseComponent'

/*
[*] [https://ant.design/ Antd]
[*] https://react.rocks/
[*] [https://github.com/callemall/material-ui Material-UI]
[*] https://github.com/brillout/awesome-react-components
*/

class ComponentLibrary extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onComponentChange',
      'getForm',
      'getSelect',
      'getGraph',
      'getGrid'
    )
    this.state = {
      component: 'Form'
    }
  }

  onComponentChange (event, index, value) {
    this.setState({component: value})
  }

  getGraph () {
    return <GraphExample />
  }

  getGrid () {
    return <GridExample />
  }

  getSelect () {
    return <SelectExample />
  }

  getForm () {
    return <FormExample />
  }

  render () {
    let component = this['get' + this.state.component]()
    return (
      <div>
        <div className='row'>
          <div className='medium-6 columns'>
            <SelectField
              style={{"{{"}}width: '100%'{{"}}"}}
              name='component-options'
              floatingLabelText='Components'
              value={this.state.component}
              onChange={this.onComponentChange}
            >
              <MenuItem value='Form' primaryText='Form' />
              <MenuItem value='Select' primaryText='Select' />
              <MenuItem value='Grid' primaryText='Grid' />
              <MenuItem value='Graph' primaryText='Graph' />
            </SelectField>
          </div>
        </div>
        {component}
      </div>
    )
  }
}

module.exports = ComponentLibrary
