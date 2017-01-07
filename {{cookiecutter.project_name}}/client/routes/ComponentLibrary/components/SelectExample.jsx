import React from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import BaseComponent from 'core/BaseComponent'

class Select extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSelectChange'
    )

    this.state = {
      value: ''
    }
  }

  onSelectChange (event, index, value) {
    this.setState({value})
  }

  render () {
    return (
      <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
        <div className='row'>
          <div className='medium-6 columns'>
            <SelectField
              floatingLabelText='What is your favorite season?'
              value={this.state.value}
              onChange={this.onSelectChange}>
              <MenuItem value={null} primaryText='' />
              <MenuItem value='fall' primaryText='Fall' />
              <MenuItem value='winter' primaryText='Winter' />
              <MenuItem value='summer' primaryText='Summer' />
              <MenuItem value='spring' primaryText='Spring' />
            </SelectField>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Select
