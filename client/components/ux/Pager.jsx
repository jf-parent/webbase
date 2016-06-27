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
    // FIRST & PREVIOUS
    let firstDisabled = !this.props.currentPage
    let first
    let previous
    if (firstDisabled) {
      first = <a className='btn btn-default btn-link' disabled>&lt;&lt;</a>
      previous = <a className='btn btn-default btn-link' disabled>&lt;</a>
    } else {
      first = <a onClick={this.props.onFirstClick} className='btn btn-default btn-link'>&lt;&lt;</a>
      previous = <a onClick={this.props.onPreviousClick} className='btn btn-default btn-link'>&lt;</a>
    }

    // NEXT & LAST
    let nextDisabled = this.props.currentPage === (this.props.totalPage - 1)
    let next
    let last
    if (nextDisabled) {
      next = <a className='btn btn-default btn-link' disabled>&gt;</a>
      last = <a className='btn btn-default btn-link' disabled>&gt;&gt;</a>
    } else {
      next = <a onClick={this.props.onNextClick} className='btn btn-default btn-link'>&gt;</a>
      last = <a onClick={this.props.onLastClick} className='btn btn-default btn-link'>&gt;&gt;</a>
    }

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
