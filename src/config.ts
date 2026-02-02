import { type ConnectConfig, createConfig } from "@0xsequence/connect";

const projectAccessKey =
  import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY ||
  "AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI";

const baseConfig: ConnectConfig = {
  projectAccessKey,
  defaultTheme: "light",
  signIn: {
    projectName: "Sequence Web SDK Demo",
    descriptiveSocials: true,
    disableTooltipForDescriptiveSocials: true,
  },
};

export const config = createConfig({
  ...baseConfig,
  appName: "Sequence Web SDK Demo",
  walletUrl: "https://v3.sequence-dev.app",
});
