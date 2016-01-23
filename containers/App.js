import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
import ds from 'datascript'

function flatten (seq) {
  return seq.reduce((state, next) => state.concat(next), [])
}

class App extends Component {
  render () {
    const { db, dispatch, visibleTodos, visibilityFilter } = this.props
    return (
      <div>
        <AddTodo
          onAddSubmit={text => dispatch(addTodo(text))} />
        <TodoList
          db={db}
          todos={visibleTodos}
          onTodoClick={id => dispatch(completeTodo(id))} />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
          onUndo={() => dispatch(ActionCreators.undo())}
          onRedo={() => dispatch(ActionCreators.redo())}
          undoDisabled={this.props.undoDisabled}
          redoDisabled={this.props.redoDisabled} />
      </div>
    )
  }
}

App.propTypes = {
  db: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  visibleTodos: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired
}

function selectTodos (db, filter = VisibilityFilters.SHOW_ALL) {
  var q = [true, false]
  switch (filter) {
    case VisibilityFilters.SHOW_COMPLETED:
      q = [true]
      break
    case VisibilityFilters.SHOW_ACTIVE:
      q = [false]
      break
  }
  return flatten(ds.q(`[:find ?e
                        :in $ [?filter ...]
                        :where [?e "completed" ?filter]]`, db, q))
}

function select ({ db }) {
  var [filter] = flatten(ds.q(`[:find ?f
                                :where [_ "visibilityFilter" ?f]]`, db.present))
  return {
    undoDisabled: db.past.length === 0,
    redoDisabled: db.future.length === 0,
    visibleTodos: selectTodos(db.present, filter),
    visibilityFilter: filter || VisibilityFilters.SHOW_ALL,
    db: db.present
  }
}

export default connect(select)(App)
