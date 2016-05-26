import { connect } from 'react-redux'

import Profile from 'routes/Profile/components/Profile'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Profile)
