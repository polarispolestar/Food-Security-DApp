import { useEffect, useState } from "react";
import {
  initWeb3,
  createBatch,
  approveBatch,
  updateTemperature,
  pickBatch,
  receiveBatch,
  confirmDelivery,
  getAllBatches,
} from "./ethereum";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Farmer");
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [batches, setBatches] = useState([]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const data = await initWeb3();
      setWalletConnected(true);
      setWalletAddress(data.accounts[0]);
      await loadBatches();
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    try {
      const all = await getAllBatches();
      setBatches(all);
    } catch (err) {
      alert("Failed to load batches: " + err.message);
    }
  };

  // ---- HANDLERS ----
  const handleCreate = async () => {
    if (!cropType || !quantity || !temperature)
      return alert("Please fill all fields!");
    try {
      setLoading(true);
      await createBatch(cropType, quantity);
      const newBatchId = batches.length + 1; // assuming sequential IDs
      await updateTemperature(newBatchId, temperature);
      setCropType("");
      setQuantity("");
      setTemperature("");
      await loadBatches();
      alert("Batch created with initial temperature!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await approveBatch(id);
      await loadBatches();
      alert("Batch approved!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemp = async (id) => {
    if (!temperature) return alert("Enter temperature!");
    try {
      setLoading(true);
      await updateTemperature(id, temperature);
      setTemperature("");
      await loadBatches();
      alert("Temperature updated!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePick = async (id) => {
    try {
      setLoading(true);
      await pickBatch(id);
      await loadBatches();
      alert("Batch picked!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = async (id) => {
    try {
      setLoading(true);
      await receiveBatch(id);
      await loadBatches();
      alert("Batch received!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (id) => {
    try {
      setLoading(true);
      await confirmDelivery(id);
      await loadBatches();
      alert("Batch delivered!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // ---- FILTER BATCHES BY ROLE ----
  const filteredBatches = (role) => {
    switch (role) {
      case "Farmer":
        return batches;
      case "Manager":
        return batches.filter((b) => !b.approvedByManager);
      case "Transporter":
        return batches.filter(
          (b) => b.approvedByManager && !b.pickedByTransporter
        );
      case "Distributor":
        return batches.filter(
          (b) => b.pickedByTransporter && !b.receivedByDistributor
        );
      case "Consumer":
        return batches.filter(
          (b) => b.receivedByDistributor && !b.deliveredToConsumer
        );
      case "Status":
        return batches;
      default:
        return [];
    }
  };

  const actorTabs = [
    "Farmer",
    "Manager",
    "Transporter",
    "Distributor",
    "Consumer",
    "Status",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          🌾 Food Security DApp
        </h1>
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="bg-green-100 px-4 py-2 rounded-xl font-mono text-green-700">
            {formatAddress(walletAddress)}
          </span>
        )}
      </header>

      {walletConnected && (
        <>
          {/* Actor Tabs */}
          <div className="flex justify-center mb-6 space-x-4 flex-wrap">
            {actorTabs.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-xl ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-700 border border-green-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
            {/* Farmer Tab */}
            {activeTab === "Farmer" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-green-700">
                  Create Food Batch
                </h2>
                <input
                  type="text"
                  placeholder="Crop Type"
                  className="w-full border p-3 mb-3 rounded-lg"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantity (kg)"
                  className="w-full border p-3 mb-3 rounded-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Temperature (°C)"
                  className="w-full border p-3 mb-4 rounded-lg"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
                <button
                  onClick={handleCreate}
                  className="w-full bg-green-600 text-white py-3 rounded-lg"
                >
                  Create
                </button>
              </div>
            )}

            {/* Other Tabs */}
            {activeTab !== "Farmer" && (
              <table className="min-w-full border border-green-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="py-2 px-4">ID</th>
                    <th>Crop</th>
                    <th>Qty</th>
                    <th>Temp</th>
                    <th>Approved</th>
                    <th>Picked</th>
                    <th>Received</th>
                    <th>Delivered</th>
                    {activeTab !== "Status" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches(activeTab).map((b) => (
                    <tr key={b.id} className="text-center border-t">
                      <td>{b.id}</td>
                      <td>{b.cropType}</td>
                      <td>{b.quantity}</td>
                      <td>{b.temperature}</td>
                      <td>{b.approvedByManager ? "✅" : "❌"}</td>
                      <td>{b.pickedByTransporter ? "✅" : "❌"}</td>
                      <td>{b.receivedByDistributor ? "✅" : "❌"}</td>
                      <td>{b.deliveredToConsumer ? "✅" : "❌"}</td>

                      {/* Action Buttons */}
                      {activeTab !== "Status" && (
                        <td className="space-x-2">
                          {activeTab === "Manager" && !b.approvedByManager && (
                            <button
                              onClick={() => handleApprove(b.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Approve
                            </button>
                          )}
                          {activeTab === "Manager" && b.approvedByManager && (
                            <>
                              <input
                                type="number"
                                placeholder="Temp"
                                className="border p-1 rounded w-16"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                              />
                              <button
                                onClick={() => handleUpdateTemp(b.id)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                              >
                                Update
                              </button>
                            </>
                          )}
                          {activeTab === "Transporter" && !b.pickedByTransporter && (
                            <button
                              onClick={() => handlePick(b.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Pick
                            </button>
                          )}
                          {activeTab === "Distributor" && !b.receivedByDistributor && (
                            <button
                              onClick={() => handleReceive(b.id)}
                              className="bg-purple-600 text-white px-3 py-1 rounded"
                            >
                              Receive
                            </button>
                          )}
                          {activeTab === "Consumer" && !b.deliveredToConsumer && (
                            <button
                              onClick={() => handleDeliver(b.id)}
                              className="bg-pink-600 text-white px-3 py-1 rounded"
                            >
                              Deliver
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {!walletConnected && (
        <p className="text-center text-green-700 mt-10">
          Connect your wallet to get started.
        </p>
      )}
    </div>
  );
}

export default App;
