import { all as effectsAll, takeEvery } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { directMessagesActions, DirectMessagesActions } from './directMessages.reducer'

import usersSelectors from '../../store/selectors/users'

import { actions } from '../../store/handlers/directMessages'
import { publicKey } from '../../store/selectors/directMessages'

const all: any = effectsAll

export function* addUser(action: DirectMessagesActions['addUser']): Generator {
  if (action.payload) {
    console.log(action.payload)
  }
  console.log('add user in saga')
  console.log('adding user')
}

export function* getAvailableUsers(action: DirectMessagesActions['getAvailableUsers']): Generator {
  if (action.payload) {
    console.log('action in getavailableusers has a payload')
    console.log(action.payload)
  }
}

export function* responseGetAvailableUsers(
  action: DirectMessagesActions['responseGetAvailableUsers']
): Generator {
  for (const [key, value] of Object.entries(action.payload)) {
    const user = yield* select(usersSelectors.registeredUser(key))
 
    yield put(
      actions.fetchUsers({
        usersList: {
          [key]: {
            publicKey: key,
            halfKey: value,
            nickname: user?.nickname || `anonsranon`
          }
        }
      })
      )
    }
    }

export function* sendMessage(action: DirectMessagesActions['sendMessage']): Generator {
  console.log('sending direct message')
}

export function* initializeConversation(
  action: DirectMessagesActions['initializeConversation']
): Generator {
  console.log('initialize Conversation in saga')
}

export function* responseGetPrivateConversations(
  action: DirectMessagesActions['responseGetPrivateConversations']
): Generator {
  console.log('received users from wagggle')
  console.log(action.payload)
}

export function* getPrivateConversations(
  action: DirectMessagesActions[
  'getPrivateConversations'
  ]
): Generator {
  console.log('GET PRIVATE CONVERSATIONS')
}

export function* directMessagesSaga(): Generator {
  yield all([
    takeEvery(`${directMessagesActions.getAvailableUsers}`, getAvailableUsers),
    takeEvery(`${directMessagesActions.addUser}`, addUser),
    takeEvery(`${directMessagesActions.responseGetAvailableUsers}`, responseGetAvailableUsers),
    takeEvery(`${directMessagesActions.sendMessage}`, sendMessage),
    takeEvery(`${directMessagesActions.initializeConversation}`, initializeConversation),
    takeEvery(`${directMessagesActions.responseGetPrivateConversations}`, responseGetPrivateConversations),
    takeEvery(`${directMessagesActions.getPrivateConversations}`, getPrivateConversations)
  ])
}
