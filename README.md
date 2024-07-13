# alcruzProject-Smart-Contract-Management
This project allows users to interact with a simple Ethereum smart contract deployed on the Ethereum blockchain using MetaMask.

## Features
- Deposit Ethereum (ETH) into the contract.
- Withdraw Ethereum (ETH) from the contract.
- View account balance and address.
- Estimate the balance after 12 months based on current savings.
- View deposit transaction history with timestamps.


## Setup instructions
1. Create an empty folder in your desired directory.
2. Clone the repository
```
git clone <repository-url>
cd <folder-name>
```
3. Inside the project directory, in the terminal type: ```npm i```
4. Open three additional terminals in your VS code
  - In the second terminal, type the command: ```npx hardhat node```
  - In the third terminal: ```npx hardhat run --network localhost scripts/deploy.js```
  - In the fourth terminal: ```npm install bootstrap```. This is for the appearance of the frontend.
5. Back in the first terminal, type ```npm run dev``` to launch the front-end.
6. After this, the project will be running on your localhost. Open this ``` http://localhost:3000/``` in your browser window.

## Running the frontend application
1. Connect Metamask.
  - You will do this by installing the [Metamask extension](https://metamask.io/download/) for the browser that you are using
  - For setting up the metamask network and importing the owner account, follow this [tutorial](https://youtu.be/e_4-Q77XJkw?si=ZT3-UaTQiF_TjGkA) by Metacrafter Chris. This video is very helpful as it also contains the fixes for all the possible errors you may encounter
2. Connect Wallet.
3. **Deposit ETH**:
  - Click the "Deposit 1 ETH" button or;
  - Enter the amount of Ethereum you wish to deposit and click "Deposit".
4. **Withdraw ETH**:
  - Click the "Withdraw 1 ETH" button or;
  - Enter the amount of Ethereum you wish to withdraw and click "Withdraw".
5. **Estimate Balance**:
  - View the estimated balance after 12 months displayed on the dashboard.
6. **View Deposit History**:
  - View the deposit history with timestamps displayed on the dashboard. This automatically refreshes every time you make a new deposit
7. You will get an error when the ```withdrawAmount``` entered is greater than the ```balance``` of the account.

## Credits
This project was made with the help of the [starter template](https://github.com/MetacrafterChris/SCM-Starter/tree/main) by Christopher Gold (Metacrafter Chris)

## Author
Althea Louise Cruz
