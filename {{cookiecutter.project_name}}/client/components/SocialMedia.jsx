import React from 'react'

import BaseComponent from 'core/BaseComponent'

let config = require('../../configs/social_media.json')

class SocialMedia extends BaseComponent {

  getSocialMediaElement () {
    return Object.keys(config).map((key, i) => {
      let href = config[key]

      if (href) {
        return (
          <li key={i} style={{"{{"}}marginLeft: 15{{"}}"}}>
            <a href={href} target='_blank'>
              <i className={'fa fa-' + key} aria-hidden='true' />
            </a>
          </li>
        )
      }
    })
  }

  render () {
    return (
      <ul style={{"{{"}}display: 'flex', listStyle: 'none', marginLeft: '7em', paddingTop: '2em'{{"}}"}}>
        {this.getSocialMediaElement()}
      </ul>
    )
  }
}

export default SocialMedia
