import React from 'react'
import { Bar } from 'react-chartjs-2'

import BaseComponent from 'core/BaseComponent'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'smile by month',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
}

/*
[*] http://gor181.github.io/react-chartjs-2/
[*] https://github.com/gor181/react-chartjs-2/tree/master/example/src/components
*/

class GraphExample extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    // this._bind()
  }

  render () {
    return (
      <div>
        <Bar
          data={data}
          width={100}
          height={50}
        />
      </div>
    )
  }
}

module.exports = GraphExample
