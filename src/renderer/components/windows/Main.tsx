import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import classnames from 'classnames'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import WindowWrapper from '../ui/WindowWrapper/WindowWrapper'
import Sidebar from '../widgets/sidebar/Sidebar'
import Channel from '../../containers/pages/Channel'
import Offer from '../../containers/pages/Offer'
import DirectMessages from '../../containers/pages/DirectMessages'
import SeedModal from '../../containers/widgets/channels/SeedModal'

const useStyles = makeStyles(() => ({
  gridRoot: {
    'min-height': '100vh',
    'min-width': '100vw',
    overflow: 'hidden',
    position: 'relative'
  },
  logsContainer: {
    'z-index': 2000,
    position: 'absolute',
    top: 0,
    right: 0
  }
}))

interface MainProps {
  match: {
    url: string
  }
  isLogWindowOpened: boolean
}

export const Main: React.FC<MainProps> = ({
  match,
  isLogWindowOpened
}) => {
  const classes = useStyles({})
  const debounce = (fn, ms) => {
    let timer
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null
        fn.apply(this) // // eslint-disable-line
      }, ms)
    }
  }
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })
  // useEffect(() => {
  //   electronStore.set('AppStatus.blockchain.isRescanned', true)
  //   disablePowerSleepMode()
  // }, [])
  return (
    <>
      <SeedModal />
      <WindowWrapper>
        <Grid container direction='row' className={classes.gridRoot}>
          <Grid item>
            <Sidebar />
          </Grid>
          <Grid item xs>
            <Route path={`${match.url}/channel/:id`} component={Channel} />
            <Route path={`${match.url}/direct-messages/:username`} component={DirectMessages} />
            <Route path={`${match.url}/offers/:id/:address`} component={Offer} />
          </Grid>
          {isLogWindowOpened && (
            <Grid
              className={classnames({
                [classes.logsContainer]: dimensions.width <= 900
              })}
              item></Grid>
          )}
        </Grid>
      </WindowWrapper>
    </>
  )
}

export default Main
