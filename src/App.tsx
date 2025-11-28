import { SequenceConnect } from '@0xsequence/connect'
import { SequenceWalletProvider } from '@0xsequence/wallet-widget'

import { config } from './config'
import { WalletExperience } from './components/WalletExperience'

export const App = () => (
  <SequenceConnect config={config}>
    <SequenceWalletProvider>
      <WalletExperience />
    </SequenceWalletProvider>
  </SequenceConnect>
)

export default App
