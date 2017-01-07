import React from 'react'
import Select from 'react-select'
import 'layouts/react-select.css'

import FormExample from './FormExample'
import SelectExample from './SelectExample'
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
      'getGrid'
    )
    this.state = {
      component: 'Form'
    }
    this.componentOptions = [
      { value: 'Form', label: 'Form' },
      { value: 'Select', label: 'Select' },
      { value: 'Grid', label: 'Grid' }
    ]
  }

  onComponentChange (component) {
    this.setState({component: component.value})
  }

  getSelect () {
    return <SelectExample />
  }

  getGrid () {
    return (
      <div>Todo</div>
    )
  }

  getForm () {
    return <FormExample />
  }

  getComponentDropdown () {
    return (
      <Select
        style={{"{{"}}zIndex: 20{{"}}"}}
        placeholder='Components'
        name='component-options'
        value={this.state.component}
        options={this.componentOptions}
        onChange={this.onComponentChange}
      />
    )
  }

  render () {
    let component = this['get' + this.state.component]()
    return (
      <div>
        {this.getComponentDropdown()}
        {component}
      </div>
    )
  }
}

module.exports = ComponentLibrary
