import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from '../modules/reducer'
import Login from '../components/Login'

function mapStateToProps (state) {
  return {
    login: state.login
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
