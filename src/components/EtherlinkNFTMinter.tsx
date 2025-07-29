import React, { useState } from "react";
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet, ExternalLink } from "lucide-react";

export const EtherlinkNFTMinter = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected, chain } = useAccount();
  const { toast } = useToast();

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs on Etherlink",
        variant: "destructive",
      });
      return;
    }

    if (!name || !description || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!contractAddress) {
      toast({
        title: "Contract Address Required",
        description: "Please enter a valid NFT contract address on Etherlink",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create metadata JSON
      const metadata = {
        name,
        description,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Platform",
            value: "NeuralForge AI"
          },
          {
            trait_type: "Network",
            value: "Etherlink"
          }
        ]
      };

      // Simulate the NFT minting process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "NFT Mint Prepared!",
        description: `NFT "${name}" metadata ready for Etherlink. Connect a Web3 wallet to complete minting.`,
      });

      // Reset form
      setName("");
      setDescription("");
      setImageUrl("");
      setRecipient("");
    } catch (error) {
      console.error("Error preparing mint:", error);
      toast({
        title: "Preparation Failed",
        description: "There was an error preparing the NFT metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Please connect your wallet to mint NFTs on Etherlink
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint NFT on Etherlink</CardTitle>
        <CardDescription>
          Create and mint your NFT on Tezos' EVM-compatible rollup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contract">NFT Contract Address *</Label>
          <Input
            id="contract"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Enter NFT name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your NFT"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL *</Label>
          <Input
            id="image"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient (optional)</Label>
          <Input
            id="recipient"
            placeholder="0x... (defaults to your wallet)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleMint} 
          disabled={isLoading || !isConnected}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing mint...
            </>
          ) : (
            "Prepare NFT Mint (0.01 XTZ)"
          )}
        </Button>

        {chain && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Network: {chain.name}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://explorer.etherlink.com', '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Etherlink: Tezos' EVM-compatible rollup</p>
          <p>• Uses XTZ as native currency</p>
          <p>• Full Ethereum compatibility with Tezos security</p>
          <p>• Deploy an ERC721 contract first or use existing one</p>
        </div>
      </CardContent>
    </Card>
  );
};