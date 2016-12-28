import React, { Component } from 'react'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

var keyframes = {
  '0%': {
    transform: 'scaley(1.0)'
  },
  '50%': {
    transform: 'scaley(0.4)'
  },
  '100%': {
    transform: 'scaley(1.0)'
  }
}

var animationName = insertKeyframesRule(keyframes)

var Loader = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    verticalAlign: React.PropTypes.string,
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    height: React.PropTypes.string,
    width: React.PropTypes.string,
    margin: React.PropTypes.string,
    radius: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      loading: true,
      color: '#ffffff',
      height: '35px',
      width: '4px',
      margin: '2px',
      radius: '2px'
    }
  },

  getLineStyle: function () {
    return {
      backgroundColor: this.props.color,
      height: this.props.height,
      width: this.props.width,
      margin: this.props.margin,
      borderRadius: this.props.radius,
      verticalAlign: this.props.verticalAlign
    }
  },

  getAnimationStyle: function (i) {
    var animation = [animationName, '1s', (i * 0.1) + 's', 'infinite', 'cubic-bezier(.2,.68,.18,1.08)'].join(' ')
    var animationFillMode = 'both'

    return {
      animation: animation,
      animationFillMode: animationFillMode
    }
  },

  getStyle: function (i) {
    return assign(
      this.getLineStyle(i),
      this.getAnimationStyle(i),
      {
        display: 'inline-block'
      }
    )
  },

  renderLoader: function (loading) {
    if (loading) {
      return (
        <div id={this.props.id} className={this.props.className}>
          <div style={this.getStyle(1)}></div>
          <div style={this.getStyle(2)}></div>
          <div style={this.getStyle(3)}></div>
          <div style={this.getStyle(4)}></div>
          <div style={this.getStyle(5)}></div>
        </div>
      )
    }

    return null
  },

  render: function () {
    return this.renderLoader(this.props.loading)
  }
})

class Loading extends Component {
  render () {
    return (
      <Loader name='loader' className='wb-loader' color='#000' size='16px' margin='4px' />
    )
  }
}

module.exports = Loading
