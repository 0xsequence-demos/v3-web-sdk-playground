import { SequenceConnect } from "@0xsequence/connect";

import { config } from "./config";
import { WalletExperience } from "./components/WalletExperience";

export const App = () => (
  <SequenceConnect config={config}>
    <WalletExperience />
  </SequenceConnect>
);

export default App;
