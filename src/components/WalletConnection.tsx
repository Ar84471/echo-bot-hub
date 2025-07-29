import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, LogOut } from "lucide-react";

export const WalletConnection = () => {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-5 w-5" />
          Web3 Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to access Web3 features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {address ? (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Connected Address:</p>
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
            <Button 
              onClick={disconnect} 
              variant="outline" 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        ) : (
          <ConnectWallet 
            theme="light"
            btnTitle="Connect Wallet"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
};