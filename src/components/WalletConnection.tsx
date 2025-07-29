import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, LogOut, ExternalLink } from "lucide-react";

export const WalletConnection = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-5 w-5" />
          Etherlink Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to Etherlink - Tezos EVM-compatible rollup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Connected Address:</p>
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              {chain && (
                <p className="text-xs text-muted-foreground mt-1">
                  Network: {chain.name}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => disconnect()} 
                variant="outline" 
                className="flex-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open('https://explorer.etherlink.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal} 
                            className="w-full"
                          >
                            Connect to Etherlink
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button onClick={openChainModal} variant="destructive" className="w-full">
                            Wrong network
                          </Button>
                        );
                      }

                      return null;
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p>• Etherlink is Tezos' EVM-compatible rollup</p>
              <p>• Uses XTZ as native currency</p>
              <p>• Full Ethereum compatibility with Tezos security</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};