import React from 'react'
import { FormattedMessage } from 'react-intl'
import Slider from 'material-ui/Slider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import Form from 'components/ux/Form'
import MaterialInput from 'components/ux/MaterialInput'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'

class FormExample extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit',
      'onSliderChange',
      'onSelectChange'
    )

    this.state = {
      errorMsgId: null,
      successMsgId: null,
      sliderValue: 50,
      selectValue: 'summer',
      loading: false
    }
  }

  onSelectChange (event, index, value) {
    this.setState({selectValue: value})
  }

  onSliderChange (event, newValue) {
    this.setState({sliderValue: newValue})
  }

  onSubmit (event) {
    event.preventDefault()
    this.setState({successMsgId: 'general.Success'})
  }

  render () {
    return (
      <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
        <Form ref='form' intl={this._reactInternalInstance._context.intl}>
          <div className='row'>
            <div className='medium-6 columns'>
              <h2>
                <FormattedMessage
                  id='componentLibrary.FormExample'
                  defaultMessage='Form Example'
                />
              </h2>
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.EmailPlaceholder'
                validate
                type='text'
                name='email'
                isEmail
                isRequired
                validationMsgId='general.EmailValidation'
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.NamePlaceholder'
                validationMsgId='general.NameValidation'
                name='name'
                validate
                isRequired
                isLongerThan={1}
                type='text'
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <span className='label'>Power</span>
              <Slider
                max={100}
                onChange={this.onSliderChange}
                min={1}
                value={this.state.sliderValue}
                step={1}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <p>
                <span>{'The value of this slider is: '}</span>
                <span>{this.state.sliderValue}</span>
                <span>{' from a range of 1 to 100 inclusive'}</span>
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <SelectField
                floatingLabelText='What is your favorite season?'
                value={this.state.selectValue}
                onChange={this.onSelectChange}>
                <MenuItem value='fall' primaryText='Fall' />
                <MenuItem value='winter' primaryText='Winter' />
                <MenuItem value='summer' primaryText='Summer' />
                <MenuItem value='spring' primaryText='Spring' />
              </SelectField>
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <LaddaButton name='login-btn' type='submit' isLoading={this.state.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='general.Submit'
                  defaultMessage='Submit'
                />
              </LaddaButton>
            </div>
          </div>
          {(() => {
            if (this.state.errorMsgId) {
              return (
                <div className='row'>
                  <div className='medium-6 columns'>
                    <ErrorMsg msgId={this.state.errorMsgId} />
                  </div>
                </div>
              )
            } else if (this.state.successMsgId) {
              return (
                <div className='row'>
                  <div className='medium-6 columns'>
                    <SuccessMsg msgId={this.state.successMsgId} />
                  </div>
                </div>
              )
            } else {
              return null
            }
          })()}
        </Form>
      </div>
    )
  }
}

module.exports = FormExample
