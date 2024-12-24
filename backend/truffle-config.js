const path = require("path");

module.exports = {
  networks: {
    localhost: {
      host: "127.0.0.1",
      port: 8545, // Ganache default port
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.9", // Specify the Solidity version
    },
  },
};

// 0x2E37C1c1f5dFA8503665ef6A03504020019B5016  -- address