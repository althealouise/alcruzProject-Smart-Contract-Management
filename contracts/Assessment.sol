// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event DepositCustom(uint256 amount);
    event WithdrawCustom(uint256 amount);
    event BalanceEstimated(uint256 indexed estimatedBalance);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");

        uint256 _previousBalance = balance;
        balance += _amount;

        emit Deposit(_amount);

        assert(balance == _previousBalance + _amount);
    }

    function depositCustom(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_amount > 0, "Deposit amount must be greater than zero");

        uint256 _previousBalance = balance;
        balance += _amount;

        emit DepositCustom(_amount); // emitting custom event for deposit with custom amount

        assert(balance == _previousBalance + _amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= _withdrawAmount, "Insufficient balance");

        uint256 _previousBalance = balance;
        balance -= _withdrawAmount;

        emit Withdraw(_withdrawAmount);

        assert(balance == _previousBalance - _withdrawAmount);
    }

    function withdrawCustom(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_withdrawAmount > 0, "Withdraw amount must be greater than zero");
        require(balance >= _withdrawAmount, "Insufficient balance");

        uint256 _previousBalance = balance;
        balance -= _withdrawAmount;

        emit WithdrawCustom(_withdrawAmount); 

        assert(balance == _previousBalance - _withdrawAmount);
    }

    function estimateBalanceEndOfYear() public view returns (uint256) {
        // assuming simple estimate: multiply current balance by 12
        uint256 estimatedBalance = balance * 12;
        return estimatedBalance;
    }
}
