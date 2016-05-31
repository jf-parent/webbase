import React from 'react'
import { expect } from 'chai'
import { Link } from 'react-router'

import testHelper from 'helpers/test-helper'
import RegisterContainer from '../containers/RegisterContainer'
import { injectReducer } from 'store/reducers'
import registerReducer from 'routes/Register/modules/reducer'

describe('<Register />', () => {
  let wrapper

  beforeEach(() => {
    testHelper.injectRequiredReducer('register', registerReducer)
    try {
      wrapper = testHelper.mountWithContext(
        <RegisterContainer />
      )
    } catch (err) {
      debugger;
    }
  })

  it('Contains link to login', () => {
    debugger
    expect(wrapper.find('input')).to.have.lengthOf(3);
  })

})
