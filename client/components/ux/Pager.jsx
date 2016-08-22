import React, { PropTypes } from 'react'

import BaseComponent from 'core/BaseComponent'

class Pager extends BaseComponent {

  static propTypes = {
    totalItem: PropTypes.number.isRequired,
    skippedItem: PropTypes.number.isRequired,
    fetchData: PropTypes.func.isRequired,
    itemPerPage: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onFirstClick',
      'onPreviousClick',
      'onNextClick',
      'onLastClick'
      )
  }

  onFirstClick () {
    this.debug('onFirstClick')
    this.props.fetchData(0)
  }

  onPreviousClick () {
    this.debug('onPreviousClick')
    let newSkippedItem = this.props.skippedItem - this.props.itemPerPage
    this.props.fetchData(newSkippedItem)
  }

  onNextClick () {
    this.debug('onNextClick')
    let newSkippedItem = this.props.skippedItem + this.props.itemPerPage
    this.props.fetchData(newSkippedItem)
  }

  onLastClick () {
    this.debug('onLastClick')

    let newSkippedItem
    if (!(this.props.totalItem % this.props.itemPerPage)) {
      newSkippedItem = this.props.totalItem - this.props.itemPerPage
    } else {
      newSkippedItem = this.props.totalItem - (this.props.totalItem % this.props.itemPerPage)
    }
    this.props.fetchData(newSkippedItem)
  }

  render () {
    // FIRST & PREVIOUS
    let firstDisabled = !this.props.skippedItem
    let first
    let previous
    if (firstDisabled) {
      first = <a className='btn btn-default btn-link' disabled>&lt;&lt;</a>
      previous = <a className='btn btn-default btn-link' disabled>&lt;</a>
    } else {
      first = <a onClick={this.onFirstClick} className='btn btn-default btn-link'>&lt;&lt;</a>
      previous = <a onClick={this.onPreviousClick} className='btn btn-default btn-link'>&lt;</a>
    }

    // NEXT & LAST
    let nextDisabled = !this.props.totalItem || (this.props.totalItem <= (this.props.skippedItem + this.props.itemPerPage))
    let next
    let last
    if (nextDisabled) {
      next = <a className='btn btn-default btn-link' disabled>&gt;</a>
      last = <a className='btn btn-default btn-link' disabled>&gt;&gt;</a>
    } else {
      next = <a onClick={this.onNextClick} className='btn btn-default btn-link'>&gt;</a>
      last = <a onClick={this.onLastClick} className='btn btn-default btn-link'>&gt;&gt;</a>
    }

    if (nextDisabled && firstDisabled) {
      return null
    } else {
      return (
        <div name='pager'>
          {first}
          {previous}
          {next}
          {last}
        </div>
      )
    }
  }
}

export default Pager
