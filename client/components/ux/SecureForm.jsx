import React from 'react'
import { Form } from 'formsy-react'

import BaseComponent from 'core/BaseComponent'
import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'

class SecureForm extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
  }

  getModel () {
    let model = this.refs.form.getModel()
    Object.assign(model, { token: this.refs.token.value })
    return model
  }

  render () {
    return (
      <Form ref='form' onValid={this.props.onValid} onInvalid={this.props.onInvalid} className={SecureFormStyle['form-signin']}>
        <input ref='token' type='hidden' value={this.props.session.token} name='token' />
        {this.props.children}
      </Form>
    )
  }
}

module.exports = SecureForm
