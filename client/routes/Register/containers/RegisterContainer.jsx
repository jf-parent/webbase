import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from '../modules/reducer'
import Register from '../components/Register'

function mapStateToProps (state) {
  return {
    register: state.register
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
