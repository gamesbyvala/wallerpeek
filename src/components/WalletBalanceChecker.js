// import React, { useState } from "react";
// import { ethers } from "ethers";

// export default function WalletBalanceChecker() {
//   const [address, setAddress] = useState("");
//   const [balance, setBalance] = useState(null);
//   const [error, setError] = useState("");

//   const getBalance = async () => {
//     try {
//       if (!ethers.isAddress(address)) {
//         setError("Invalid Ethereum address");
//         setBalance(null);
//         return;
//       }

//       setError("");
//       const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

//       // You can replace Infura with Alchemy, QuickNode, or any public RPC

//       const balanceWei = await provider.getBalance(address);
//       const balanceEth = ethers.formatEther(balanceWei);
//       setBalance(balanceEth);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching balance. Check RPC or network.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md text-center">
//       <h2 className="text-xl font-bold mb-4">Ethereum Wallet Manager</h2>
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter Ethereum wallet address"
//         className="w-full p-2 border rounded mb-4"
//       />
//       <button
//         onClick={getBalance}
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Check Balance
//       </button>

//       {balance !== null && (
//         <p className="mt-4 font-semibold">Balance: {balance} ETH</p>
//       )}
//       {error && <p className="mt-4 text-red-600">{error}</p>}
//     </div>
//   );
// }

import React, { useState } from "react";
import { ethers } from "ethers";

function WalletPeek() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [usdValue, setUsdValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBalance = async () => {
    try {
      setLoading(true);
      setError(null);

      // Provider
      const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

      // Fetch ETH balance
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(ethers.formatEther(balanceWei));

      setBalance(balanceEth);

      // Fetch ETH price from CoinGecko
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      const ethPrice = data.ethereum.usd;

      setUsdValue((balanceEth * ethPrice).toFixed(2));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balance. Check the wallet address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">💳 Wallet Peek</h1>
      <input
        type="text"
        placeholder="Enter ETH wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-96 p-3 rounded-lg text-white mb-4 border"
      />
      <button
        onClick={getBalance}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Balance"}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {balance !== null && !error && (
        <div className="mt-6 text-center">
          <p className="text-xl">Balance: <span className="font-bold">{balance} ETH</span></p>
          <p className="text-lg text-gray-300">≈ ${usdValue} USD</p>
        </div>
      )}
    </div>
  );
}

export default WalletPeek;
