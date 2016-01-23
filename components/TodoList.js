import React, { Component, PropTypes } from 'react'
import Todo from './Todo'

export default class TodoList extends Component {
  render () {
    return (
      <ul>
        {this.props.todos.map(id =>
          <Todo key={id}
                db={this.props.db}
                eid={id}
                onClick={() => this.props.onTodoClick(id)} />
        )}
      </ul>
    )
  }
}

TodoList.propTypes = {
  db: PropTypes.object.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
}
