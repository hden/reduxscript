import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import ds from 'datascript'

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER } from './actions'

const transact = ds.db_with

function reducer (db = ds.empty_db(), action) {
  switch (action.type) {
    case ADD_TODO:
      return transact(db, [[':db/add', -1, 'text', action.text],
                           [':db/add', -1, 'completed', false]])
    case COMPLETE_TODO:
      return transact(db, [[':db/add', action.id, 'completed', true]])
    case SET_VISIBILITY_FILTER:
      return transact(db, [[':db/add', 0, 'visibilityFilter', action.filter]])
    default:
      return db
  }
}

const todoApp = combineReducers({ db: undoable(reducer) })

export default todoApp
