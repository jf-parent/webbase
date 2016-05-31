import { connect } from 'react-redux'

import Profile from '../components/Profile'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Profile)
