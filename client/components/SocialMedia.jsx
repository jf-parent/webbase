import React, { Component } from 'react'

var config = require('!json!../../configs/social_media.json')

class SocialMedia extends Component {

  getSocialMediaElement () {
    return Object.keys(config).map((key, i) => {
      let classname = 'fa fa-' + key
      let href = config[key]

      if (href) {
        return (
          <li key={i}>
            <a href={href} target='_blank'>
              <i className={classname} aria-hidden='true' />
            </a>
          </li>
        )
      }
    })
  }

  render () {
    return (
      <ul className='nav navbar-nav navbar-right'>
        {this.getSocialMediaElement()}
      </ul>
    )
  }
}

export default SocialMedia
