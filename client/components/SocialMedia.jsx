import React from 'react'
import 'font-awesome-webpack'

import BaseComponent from 'core/BaseComponent'

var config = require('../../configs/social_media.json')

class SocialMedia extends BaseComponent {

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
      <ul className='nav navbar-nav navbar-left'>
        {this.getSocialMediaElement()}
      </ul>
    )
  }
}

export default SocialMedia
