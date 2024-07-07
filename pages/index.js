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

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const handleDepositInputChange = (event) => {
    setDepositAmount(event.target.value);
  };

  const handleWithdrawInputChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  const deposit = async () => {
    if (atm && depositAmount !== "") {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      setDepositAmount(""); // clear input field after deposit
      getBalance();
    } else {
      // deposit 1 ETH if no custom amount provided
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmount !== "") {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      setWithdrawAmount(""); // clear input field after withdraw
      getBalance();
    } else {
      // withdraw 1 ETH if no custom amount provided
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button class="btn-primary" onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="container">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button className="btn btn-success mt-2 mr-2" onClick={() => deposit(1)}>
            Deposit 1 ETH
        </button>

        <button className="btn btn-danger mt-2 ml-2" onClick={() => withdraw(1)}>
            Withdraw 1 ETH
        </button>
    

        <div className="mb-3 mt-3">
          <label htmlFor="depositAmount" className="form-label">
            Deposit Amount (ETH):
          </label>
          <input
            type="number"
            className="form-control"
            id="depositAmount"
            value={depositAmount}
            onChange={handleDepositInputChange}
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
            onChange={handleWithdrawInputChange}
            placeholder="Enter amount to withdraw"
          />
          <button className="btn btn-primary mt-2 me-2" onClick={withdraw}>
            Withdraw
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1 className="text-center mt-5">Welcome to Althea's ATM!</h1>
      </header>
      {initUser()}
    </main>
  );
}
