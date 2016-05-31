import { connect } from 'react-redux'

import ErrorPage from '../../../routes/ErrorPage/components/ErrorPage'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(ErrorPage)

