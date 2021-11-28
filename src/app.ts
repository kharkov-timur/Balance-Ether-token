import express from 'express';
import config from 'config';
import Web3 from 'web3';
import fs from 'fs';

const app = express();

const PORT = config.get('app.port') || 3000;
const CHECK_INTERVAL = config.get('app.checkInterval');

app.get('/', (req, res) => {
  res.send('Blockchain-Ether');
});
app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});

const provider = config.get('app.blockchain.url');
const tokenAddress = config.get('app.blockchain.tokenAddress');

class TransactionCheck {
  web3;

  constructor(providerId) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerId));
    setInterval(this.getBalance.bind(this), CHECK_INTERVAL);
  }

  async getBalance(): Promise<void> {
    try {
      const token = await this.web3.eth.getBalance(tokenAddress);

      if (fs.existsSync('./tokenBalance.txt')) {
        return fs.appendFileSync(
          './tokenBalance.txt',
          `\n${new Date().toISOString()}: ${token}`,
        );
      }

      return fs.writeFileSync(
        './tokenBalance.txt',
        `${new Date().toISOString()}: ${token}`,
      );
    } catch (e) {
      console.error(e);
    }
  }
}

new TransactionCheck(provider).getBalance().then();
