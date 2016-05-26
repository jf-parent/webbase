import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from '../modules/reducer'
import Logout from 'routes/Logout/components/Logout'

function mapStateToProps (state) {
  return {
    logout: state.logout
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
