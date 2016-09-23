import { connect } from 'react-redux'

import Component from '../components/Component'

function mapStateToProps (state) {
  return {
    state
  }
}

export default connect(mapStateToProps)(Component)
