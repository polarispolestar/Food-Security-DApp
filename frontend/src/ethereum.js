import Web3 from "web3";
import FoodSecurity from "../../build/contracts/FoodSecurity.json";

let web3;
let contract;
let accounts;

export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = FoodSecurity.networks[networkId];
    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ${networkId}.`);
    }

    contract = new web3.eth.Contract(FoodSecurity.abi, deployedNetwork.address);
    return { web3, accounts, contract };
  } else {
    throw new Error("MetaMask not detected!");
  }
};

// ---- FARMER (anyone can call) ----
export const createBatch = async (cropType, quantity) => {
  await contract.methods.createBatch(cropType, quantity).send({ from: accounts[0] });
};

// ---- MANAGER (anyone can call) ----
export const approveBatch = async (id) => {
  await contract.methods.approveBatch(id).send({ from: accounts[0] });
};

export const updateTemperature = async (id, temperature) => {
  await contract.methods.updateTemperature(id, temperature).send({ from: accounts[0] });
};

// ---- TRANSPORTER (anyone can call) ----
export const pickBatch = async (id) => {
  await contract.methods.pickBatch(id).send({ from: accounts[0] });
};

// ---- DISTRIBUTOR (anyone can call) ----
export const receiveBatch = async (id) => {
  await contract.methods.receiveBatch(id).send({ from: accounts[0] });
};

// ---- CONSUMER (anyone can call) ----
export const confirmDelivery = async (id) => {
  await contract.methods.confirmDelivery(id).send({ from: accounts[0] });
};

// ---- VIEW ----
export const getAllBatches = async () => {
  const count = await contract.methods.batchCount().call();
  const all = [];

  for (let i = 1; i <= count; i++) {
    const b = await contract.methods.getBatch(i).call();
    all.push({
      id: i,
      farmer: b[0],
      cropType: b[1],
      quantity: b[2],
      approvedByManager: b[3],
      pickedByTransporter: b[4],
      receivedByDistributor: b[5],
      deliveredToConsumer: b[6],
      temperature: b[7],
    });
  }

  return all;
};