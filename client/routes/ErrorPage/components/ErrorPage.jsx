import React, { Component } from 'react'

var url = require('file!../assets/images/404.png')

class ErrorPage extends Component {
  render () {
    return (
      <center>
        <h1>
          Page Not Found!
        </h1>
        <img src={url} />
        <p>
          <small>
            010100110110111101110010011100100111100100111010 01010000011000010110011101100101 010011100110111101110100 010001100110111101110101011011100110010000100001
          </small>
        </p>
        <i>
          <small>
            536F7272793A 50616765 4E6F74 466F756E6421
          </small>
        </i>
      </center>
    )
  }
}

module.exports = ErrorPage
