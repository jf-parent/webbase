import React, { Component } from 'react'
import fontAwesome from 'font-awesome/css/font-awesome.css'

var config = require('!json!../../configs/social_media.json')

class SocialMedia extends Component {

  getSocialMediaElement () {
    return Object.keys(config).map((key, i) => {
      let iconCls = 'fa-' + key
      let liClassName = [fontAwesome['fa'], fontAwesome[iconCls]]
      let href = config[key]

      if (href) {
        return (
          <li key={i}>
            <a href={href} target='_blank'>
              <i className={liClassName.join(' ')} aria-hidden='true' />
            </a>
          </li>
        )
      }
    })
  }

  render () {
    const navClassName = [bootstrap['nav'], bootstrap['navbar-nav'], bootstrap['navbar-right']]
    return (
      <ul className={navClassName.join(' ')}>
        {this.getSocialMediaElement()}
      </ul>
    )
  }
}

export default SocialMedia
