import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BaseComponent from '../core/BaseComponent'
import { actions } from './reducer'

function mapStateToProps (state) {
  return {
    locales: state.locales
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

class LocalesMenu extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('onClick')
  }

  onClick (event) {
    this.debug('Changing locale')

    this.props.actions.doChangeLocale(event.target.dataset.locale)
  }

  render () {
    return (
      <div className='row'>
        <div className='medium-2 medium-offset-10 columns end'>
          <a onClick={this.onClick} data-locale='en'>English</a>
          {' - '}
          <a onClick={this.onClick} data-locale='fr' >Français</a>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalesMenu)
