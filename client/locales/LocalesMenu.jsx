import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import bootstrap from 'bootstrap/dist/css/bootstrap.css'

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

    this.props.actions.doChangeLocale(event.target.value)
  }

  render () {
    this.debug('Render')

    const aClassName = [bootstrap['btn'], bootstrap['btn-link']]

    return (
      <div className={bootstrap['container']}>
        <ul className={bootstrap['list-inline'] + ' ' + bootstrap['pull-right']}>
          <li>
            <a className={aClassName.join(' ')} onClick={this.onClick} value='en'>English</a>
          </li>
          <li>
            <a className={aClassName.join(' ')} onClick={this.onClick} value='fr' >Français</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalesMenu)
