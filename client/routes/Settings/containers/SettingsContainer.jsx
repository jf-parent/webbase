import { connect } from 'react-redux'

import Settings from 'routes/Settings/components/Settings'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Settings)

