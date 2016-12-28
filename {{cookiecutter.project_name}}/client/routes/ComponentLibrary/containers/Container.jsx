import { connect } from 'react-redux'

import Component from '../components/Component'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Component)

