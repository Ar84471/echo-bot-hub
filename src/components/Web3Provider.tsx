import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Ethereum, Polygon, Mumbai } from "@thirdweb-dev/chains";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <ThirdwebProvider
      activeChain={Ethereum}
      supportedChains={[Ethereum, Polygon, Mumbai]}
      clientId="your-client-id" // You'll need to get this from ThirdWeb dashboard
    >
      {children}
    </ThirdwebProvider>
  );
};