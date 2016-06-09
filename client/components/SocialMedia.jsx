import React, { Component } from 'react'

import 'font-awesome-webpack'

var config = require('!json!../../configs/social_media.json')

class SocialMedia extends Component {

  getSocialMediaElement () {
    return Object.keys(config).map((key, i) => {
      let href = config[key]

      if (href) {
        return (
          <a className='btn btn-link' key={i} href={href} target='_blank'>
            <i className={'fa fa-' + key} aria-hidden='true' />
          </a>
        )
      }
    })
  }

  render () {
    return (
      <ul className='nav navbar-nav navbar-right'>
        <center>
          {this.getSocialMediaElement()}
        </center>
      </ul>
    )
  }
}

export default SocialMedia
