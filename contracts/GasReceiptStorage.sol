// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasReceiptStorage {
    struct Receipt {
        uint256 totalAmount;
        string date;
        string time;
        uint256 fuelQuantity;
    }

    mapping(address => Receipt[]) private receipts;

    event ReceiptStored(address indexed user, uint256 totalAmount, string date, string time, uint256 fuelQuantity);

    function storeReceipt(uint256 _totalAmount, string memory _date, string memory _time, uint256 _fuelQuantity) public {
        Receipt memory newReceipt = Receipt(_totalAmount, _date, _time, _fuelQuantity);
        receipts[msg.sender].push(newReceipt);
        emit ReceiptStored(msg.sender, _totalAmount, _date, _time, _fuelQuantity);
    }

    function getReceiptCount() public view returns (uint256) {
        return receipts[msg.sender].length;
    }

    function getReceipt(uint256 index) public view returns (uint256, string memory, string memory, uint256) {
        require(index < receipts[msg.sender].length, "Receipt index out of bounds");
        Receipt memory receipt = receipts[msg.sender][index];
        return (receipt.totalAmount, receipt.date, receipt.time, receipt.fuelQuantity);
    }
}