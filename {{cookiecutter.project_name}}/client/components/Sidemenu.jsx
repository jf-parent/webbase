import React, { PropTypes } from 'react'
import Radium from 'radium'
import { Link } from 'react-router'
import {slide as Menu} from 'react-burger-menu'
import MediaQuery from 'react-responsive'

import BaseComponent from 'core/BaseComponent'

class Sidemenu extends BaseComponent {

  constructor (props) {
    super(props)

    this._bind(
      'onClick'
    )

    this.state = {
      menuOpen: false
    }
  }

  onClick (event) {
    this.setState({menuOpen: false})
  }

  render () {
    const RadiumLink = Radium(Link)
    return (
      <div>
        <MediaQuery query='(min-device-width: 1224px)'>
          <Menu noOverlay isOpen>
            {(() => {
              return this.props.links.map((link, index) => {
                return (
                  <RadiumLink key={index} to={link.props.to}>{link}</RadiumLink>
                )
              })
            })()}
          </Menu>
        </MediaQuery>
        <MediaQuery query='(max-device-width: 1224px)'>
          <Menu isOpen={this.state.menuOpen}>
            {(() => {
              return this.props.links.map((link, index) => {
                return (
                  <RadiumLink onClick={this.onClick} key={index} to={link.props.to}>{link}</RadiumLink>
                )
              })
            })()}
          </Menu>
        </MediaQuery>
      </div>
    )
  }
}

Sidemenu.PropTypes = {
  links: PropTypes.array.isRequired
}

export default Sidemenu
