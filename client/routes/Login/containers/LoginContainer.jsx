import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as AuthActions from 'actions/AuthActions'
import Login from 'routes/Login/components/Login'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
