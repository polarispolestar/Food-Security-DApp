// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodSecurity {
    struct FoodBatch {
        uint256 id;
        address farmer;
        string cropType;
        uint256 quantity; // in kg
        bool approvedByManager;
        bool pickedByTransporter;
        bool receivedByDistributor;
        bool deliveredToConsumer;
        int256 temperature; // latest temperature record
    }

    mapping(uint256 => FoodBatch) public batches;
    uint256 public batchCount;

    // ---- Events ----
    event BatchCreated(uint256 id, address farmer, string cropType, uint256 quantity);
    event BatchApproved(uint256 id);
    event BatchPicked(uint256 id, address transporter);
    event BatchReceived(uint256 id, address distributor);
    event BatchDelivered(uint256 id, address consumer);
    event TemperatureUpdated(uint256 id, int256 temperature);

    // ---- FARMER (anyone can call) ----
    function createBatch(string memory _cropType, uint256 _quantity) public {
        batchCount++;
        batches[batchCount] = FoodBatch({
            id: batchCount,
            farmer: msg.sender,
            cropType: _cropType,
            quantity: _quantity,
            approvedByManager: false,
            pickedByTransporter: false,
            receivedByDistributor: false,
            deliveredToConsumer: false,
            temperature: 0
        });

        emit BatchCreated(batchCount, msg.sender, _cropType, _quantity);
    }

    // ---- MANAGER (anyone can call) ----
    function approveBatch(uint256 _id) public {
        FoodBatch storage b = batches[_id];
        b.approvedByManager = true;
        emit BatchApproved(_id);
    }

    function updateTemperature(uint256 _id, int256 _temperature) public {
        FoodBatch storage b = batches[_id];
        b.temperature = _temperature;
        emit TemperatureUpdated(_id, _temperature);
    }

    // ---- TRANSPORTER (anyone can call) ----
    function pickBatch(uint256 _id) public {
        FoodBatch storage b = batches[_id];
        b.pickedByTransporter = true;
        emit BatchPicked(_id, msg.sender);
    }

    // ---- DISTRIBUTOR (anyone can call) ----
    function receiveBatch(uint256 _id) public {
        FoodBatch storage b = batches[_id];
        b.receivedByDistributor = true;
        emit BatchReceived(_id, msg.sender);
    }

    // ---- CONSUMER (anyone can call) ----
    function confirmDelivery(uint256 _id) public {
        FoodBatch storage b = batches[_id];
        b.deliveredToConsumer = true;
        emit BatchDelivered(_id, msg.sender);
    }

    // ---- VIEW FUNCTION ----
    function getBatch(uint256 _id)
        public
        view
        returns (
            address farmer,
            string memory cropType,
            uint256 quantity,
            bool approvedByManager,
            bool pickedByTransporter,
            bool receivedByDistributor,
            bool deliveredToConsumer,
            int256 temperature
        )
    {
        FoodBatch memory b = batches[_id];
        return (
            b.farmer,
            b.cropType,
            b.quantity,
            b.approvedByManager,
            b.pickedByTransporter,
            b.receivedByDistributor,
            b.deliveredToConsumer,
            b.temperature
        );
    }
}
