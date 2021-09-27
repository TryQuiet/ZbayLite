import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import MenuAction from '../../ui/MenuAction'
import addIcon from '../../../static/images/zcash/add-icon.svg'
import { Action, ActionFunction0 } from 'redux-actions'

const useStyles = makeStyles((theme) => ({
  icon: {
    width: 15,
    height: 15
  },
  button: {
    width: 25,
    height: 25,
    padding: 4,
    color: theme.typography.body2.color,
    backgroundColor: 'rgb(0,0,0,0.26)',
    borderRadius: '50%'
  }
}))

interface AddDirectMessageProps {
  openModal: ActionFunction0<Action<{
    modalName: string
    data: any
  }>>
}

export const AddDirectMessage: React.FC<AddDirectMessageProps> = ({ openModal }) => {
  const classes = useStyles({})
  return (
    <React.Fragment>
      <MenuAction
        classes={{
          button: classes.button,
          icon: classes.icon
        }}
        icon={addIcon}
        iconHover={addIcon}
        IconButton={IconButton}
        offset='0 8'
        onClick={openModal}
      />
    </React.Fragment>
  )
}

export default AddDirectMessage
