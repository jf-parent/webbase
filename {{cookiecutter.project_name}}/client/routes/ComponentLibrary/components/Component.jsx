import React from 'react'
import Select from 'react-select'
import 'layouts/react-select.css'

import BaseComponent from 'core/BaseComponent'

/*
[*] [https://ant.design/ Antd]
[*] https://react.rocks/
*/

class Settings extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onComponentChange',
      'getForm',
      'getGrid',
      'getRow'
    )
    let rows = []
    for (let i = 1; i < 20; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      })
    }
    this.state = {
      component: '',
      rows: rows
    }
    this.componentOptions = [
      { value: 'form', label: 'Form' },
      { value: 'grid', label: 'Grid' }
    ]
  }

  onComponentChange (component) {
    this.setState({component: component.value})
  }

  getRow (i) {
    return this.state.rows[i]
  }

  getGrid () {
    return (
      <div>Todo</div>
    )
  }

  getForm () {
    return (
      <div>TODO</div>
    )
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
    return (
      <div>TODO</div>
    )
  }
}

module.exports = Settings
