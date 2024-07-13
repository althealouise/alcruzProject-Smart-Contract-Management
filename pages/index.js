import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [endOfYearBalance, setEndOfYearBalance] = useState(undefined);
  const [history, setHistory] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  // function to connect to MetaMask wallet
  const connectAccount = async () => {
    if (!window.ethereum) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    getATMContract();
  };

  // function to initialize the ATM contract instance
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  // function to fetch current balance and estimated end-of-year balance from the contract
  const getBalance = async () => {
    if (atm) {
      const currentBalance = await atm.getBalance();
      setBalance(currentBalance.toNumber());

      const estimatedBalance = await atm.estimateBalanceEndOfYear();
      setEndOfYearBalance(estimatedBalance.toNumber());

      fetchTransactionHistory();
    }
  };

  // function to fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const filter = {
        address: contractAddress,
        topics: [ethers.utils.id("Deposit(uint256)")], 
        fromBlock: ethers.constants.Zero,  
        toBlock: 'latest',                 
      };

      const events = await atm.queryFilter(filter);
      const txHistory = [];

      for (const event of events) {
        const block = await provider.getBlock(event.blockNumber);
        const timestamp = block.timestamp;
        txHistory.push({ timestamp, dep: event.args.amount.toString() });
      }

      setHistory(txHistory);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // handle deposit and withdraw actions
  const deposit = async () => {
    if (atm && depositAmount !== "") {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      setDepositAmount("");
      getBalance();
    } else {
      alert("Please enter a deposit amount");
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmount !== "") {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      setWithdrawAmount("");
      getBalance();
    } else {
      alert("Please enter a withdraw amount");
    }
  };

  // useEffect hooks for connecting MetaMask and fetching balance
  useEffect(() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
  }, []);

  useEffect(() => {
    if (account && atm) {
      getBalance();
    }
  }, [account, atm]);

  // render JSX based on account and balance state
  return (
    <main className="container">
      <header>
        <h1 className="text-center mt-5">Welcome to Althea's Savings Account!</h1>
      </header>
      {!account && (
        <button className="btn-primary" onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      )}
      {account && (
        <div className="container">
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance} ETH</p>
          <p>Estimated Balance 12 months from now: {endOfYearBalance} ETH</p>

          <div className="mb-3 mt-3">
            <label htmlFor="depositAmount" className="form-label">
              Deposit Amount (ETH):
            </label>
            <input
              type="number"
              className="form-control"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount to deposit"
            />
            <button className="btn btn-primary mt-2 me-2" onClick={deposit}>
              Deposit
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="withdrawAmount" className="form-label">
              Withdraw Amount (ETH):
            </label>
            <input
              type="number"
              className="form-control"
              id="withdrawAmount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
            />
            <button className="btn btn-danger mt-2 me-2" onClick={withdraw}>
              Withdraw
            </button>
          </div>

          {/* display transaction history */}
          <div>
            <h2>Deposit History</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Deposit Amount (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx, index) => (
                  <tr key={index}>
                    <td>{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                    <td>{tx.dep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
