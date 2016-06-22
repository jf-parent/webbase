import React, { PropTypes } from 'react'

import BaseComponent from 'core/BaseComponent'

class Pager extends BaseComponent {

  static propTypes = {
    onFirstClick: PropTypes.func.isRequired,
    onPreviousClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
    onLastClick: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPage: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)

    this._initLogger()
  }

  render () {
    let first = <a onClick={this.props.onFirstClick} className='btn btn-default btn-link'>&lt;&lt;</a>
    let previous = <a onClick={this.props.onPreviousClick} className='btn btn-default btn-link'>&lt;</a>
    let next = <a onClick={this.props.onNextClick} className='btn btn-default btn-link'>&gt;</a>
    let last = <a onClick={this.props.onLastClick} className='btn btn-default btn-link'>&gt;&gt;</a>

    return (
      <div>
        {first}
        {previous}
        {next}
        {last}
      </div>
    )
  }
}

export default Pager
