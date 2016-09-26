import React from 'react'
import ReactDataGrid from 'react-data-grid'
import 'react-data-grid/themes/react-data-grid.css'
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input
} from 'reactstrap'
import Select from 'react-select'
import 'layouts/react-select.css'

import BaseComponent from 'core/BaseComponent'

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
    let columns = [
      {key: 'id', name: 'ID'},
      {key: 'title', name: 'Title'},
      {key: 'count', name: 'Count'}
    ]
    return (
      <Row>
        <ReactDataGrid
          columns={columns}
          rowGetter={this.getRow}
          rowsCount={this.state.rows.length}
          minHeight={500}
        />
      </Row>
    )
  }

  getForm () {
    return (
      <Row>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <Input placeholder='username' />
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>
            <Input addon type='checkbox' aria-label='Checkbox for following text input' />
          </InputGroupAddon>
          <Input placeholder='Check it out' />
        </InputGroup>
        <br />
        <InputGroup>
          <Input placeholder='username' />
          <InputGroupAddon>@example.com</InputGroupAddon>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupAddon>$</InputGroupAddon>
          <Input placeholder='Dolla dolla billz yo!' />
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupAddon>$</InputGroupAddon>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <Input placeholder='Amount' type='number' step='1' />
          <InputGroupAddon>.00</InputGroupAddon>
        </InputGroup>
      </Row>
    )
  }

  getComponentDropdown () {
    return (
      <Select
        style={{zIndex: 20}}
        placeholder='Components'
        name='component-options'
        value={this.state.component}
        options={this.componentOptions}
        onChange={this.onComponentChange}
      />
    )
  }

  render () {
    let component = null
    if (this.state.component === 'form') {
      component = this.getForm()
    } else if (this.state.component === 'grid') {
      component = this.getGrid()
    }
    // https://reactstrap.github.io/components/buttons/
    return (
      <Container>
        <h1 name='components-library-page'>
          Component Library
        </h1>
        <Row>
          <Col>
            {this.getComponentDropdown()}
          </Col>
        </Row>
        <Row>
          <Col>
            {component}
          </Col>
        </Row>
      </Container>
    )
  }
}

module.exports = Settings
