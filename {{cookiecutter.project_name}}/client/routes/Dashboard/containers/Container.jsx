import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from '../modules/reducer'
import Component from '../components/Component'

function mapStateToProps (state) {
  return {
    state
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
