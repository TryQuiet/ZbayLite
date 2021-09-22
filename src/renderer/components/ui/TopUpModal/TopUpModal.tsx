import React from 'react'

import { AutoSizer } from 'react-virtualized'

import { Scrollbars } from 'rc-scrollbars'

import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AddFunds from '../../../components/widgets/settings/AddFunds'
import Modal from '../Modal'

const useStyles = makeStyles(() => ({
  content: {}
}))

interface TopUpModalProps {
  open: boolean
  handleClose: () => void
  openSettingsModal: () => void
  setTabToOpen: () => void
  [index: string]: any
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ open = false, handleClose, openSettingsModal, setTabToOpen, ...rest }) => {
  const classes = useStyles({})

  const [offset, setOffset] = React.useState(0)

  const adjustOffset = () => {
    if (window.innerWidth > 600) {
      setOffset((window.innerWidth - 600) / 2)
    }
  }

  React.useEffect(() => {
    if (window) {
      window.addEventListener('resize', adjustOffset)
      adjustOffset()
    }
  }, [])

  return (
    <Modal open={open} handleClose={handleClose} contentWidth='100%'>
      <AutoSizer>
        {({ _width, height }) => {
          return (
            <Scrollbars autoHideTimeout={500} style={{ width: window.innerWidth, height: height }}>
              <Grid container justify={'center'}>
                <Grid item xs>
                  <Grid
                    item
                    className={classes.content}
                    style={{ paddingRight: offset, paddingLeft: offset }}>
                    {/* @ts-ignore */}
                    <AddFunds
                      {...rest}
                      variant={'wide'}
                      setCurrentTab={() => {
                        openSettingsModal()
                        setTabToOpen()
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Scrollbars>
          )
        }}
      </AutoSizer>
    </Modal>
  )
}

export default TopUpModal
