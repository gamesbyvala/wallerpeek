import React, { useState } from "react";
import { ethers } from "ethers";

export default function WalletBalanceChecker() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const getBalance = async () => {
    try {
      if (!ethers.isAddress(address)) {
        setError("Invalid Ethereum address");
        setBalance(null);
        return;
      }

      setError("");
      const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

      // You can replace Infura with Alchemy, QuickNode, or any public RPC

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (err) {
      console.error(err);
      setError("Error fetching balance. Check RPC or network.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Ethereum Wallet Manager</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Ethereum wallet address"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={getBalance}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Check Balance
      </button>

      {balance !== null && (
        <p className="mt-4 font-semibold">Balance: {balance} ETH</p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
