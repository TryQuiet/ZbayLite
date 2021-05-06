import 'typeface-roboto'
import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import store from './store'
import Index from './containers/windows/Index'
import Main from './containers/windows/Main'
import Vault from './containers/windows/Vault'
import Loading from './containers/windows/Loading'
import Notifier from './containers/ui/Notifier'
import ErrorModal from './containers/ui/ErrorModal'
import MigrationModal from './containers/ui/MigrationModal'
import QuitAppDialog from './containers/ui/QuitAppDialog'
import TopUpModal from './containers/ui/TopUpModal'
import SecurityModal from './containers/widgets/settings/SecurityModal'
import SendMoneyModal from './containers/ui/sendMoney/SendMoneyModal'
import UpdateModal from './containers/widgets/update/UpdateModal'
import CreateChannelModal from './containers/widgets/channels/CreateChannelModal'
import NewMessageModal from './containers/widgets/channels/NewMessageModal'
import SendMessageModal from './containers/ui/sendMessage/SendMessage'
import JoinChannelModal from './containers/widgets/channels/JoinChannelModal'
import ChannelSettingsModal from './containers/widgets/channelSettings/ChannelSettingsModal'
import AdvertModal from './containers/ui/adverts/AdvertModal'
import AdvertActionsModal from './containers/ui/adverts/AdvertActionsModal'
import PublishChannelModal from './containers/ui/PublishChannelModal'
import SentFundsModal from './containers/ui/SentFundsModal'
import OpenExternalLinkModal from './containers/ui/OpenExternalLinkModal'
import SendFundsModal from './containers/ui/adverts/SendFundsModal'
import AddModerator from './containers/widgets/channelSettings/AddModerator'
import BlockchainLocationModal from './containers/widgets/blockchainLocation/BlockchainLocation'
import FailedUsernameRegister from './containers/ui/FailedUsernameRegister'
import SendMoney from './containers/ui/sendMoneySeparate/sendMoney'
import theme from './theme'
import DevTools from './DevTools'

export default () => {
  const persistor = persistStore(store)
  return (
    <MuiThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SnackbarProvider maxSnack={3}>
              <Notifier />
              <MigrationModal />
              <ErrorModal />
              <QuitAppDialog />
              <UpdateModal />
              <SendMoneyModal />
              <SecurityModal />
              <TopUpModal />
              <CssBaseline />
              <CreateChannelModal />
              <NewMessageModal />
              <SendMessageModal />
              <JoinChannelModal />
              <AdvertModal />
              <AdvertActionsModal />
              <SendFundsModal />
              <ChannelSettingsModal />
              <PublishChannelModal />
              <SentFundsModal />
              <AddModerator />
              <OpenExternalLinkModal />
              <BlockchainLocationModal />
              <SendMoney />
              <FailedUsernameRegister />
              <Route path='/vault' exact component={Vault} />
              <Route path='/main' component={Main} />
              <Route path='/zcashNode' component={Index} />
              <Route path='/loading' component={Loading} />
            </SnackbarProvider>
            {process.env.NODE_ENV === 'development' ? <DevTools /> : <></>}
          </PersistGate>
        </Provider>
      </HashRouter>
    </MuiThemeProvider>
  )
}
