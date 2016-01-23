import React, { Component, PropTypes } from 'react'
import ds from 'datascript'

export default class Todo extends Component {
  render () {
    const { db, eid, onClick } = this.props
    var { completed, text } = ds.pull(db, '["completed" "text"]', eid)
    return (
      <li
        onClick={onClick}
        style={{
          textDecoration: completed ? 'line-through' : 'none',
          cursor: completed ? 'default' : 'pointer'
        }}>
        {text}
      </li>
    )
  }
}

Todo.propTypes = {
  db: PropTypes.object.isRequired,
  eid: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}
