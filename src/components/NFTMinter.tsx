import { useState } from "react";
import { useContract, useContractWrite, useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";

export const NFTMinter = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const { toast } = useToast();

  // Replace with your actual NFT contract address
  const contractAddress = "0x..."; // You'll need to deploy an NFT contract first
  
  const { contract } = useContract(contractAddress);
  const { mutateAsync: mintNFT, isLoading } = useContractWrite(contract, "mintTo");

  const handleMint = async () => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
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

    try {
      const metadata = {
        name,
        description,
        image: imageUrl,
      };

      const targetAddress = recipient || address;
      
      await mintNFT({
        args: [targetAddress, metadata],
      });

      toast({
        title: "NFT Minted Successfully!",
        description: `NFT "${name}" has been minted to ${targetAddress}`,
      });

      // Reset form
      setName("");
      setDescription("");
      setImageUrl("");
      setRecipient("");
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (connectionStatus === "disconnected") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Please connect your wallet to mint NFTs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint NFT</CardTitle>
        <CardDescription>
          Create and mint your own NFT on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          disabled={isLoading || !address}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            "Mint NFT"
          )}
        </Button>

        {address && (
          <p className="text-sm text-muted-foreground text-center">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};