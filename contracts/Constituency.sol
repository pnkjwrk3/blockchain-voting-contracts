pragma solidity ^0.5.0;

contract Constituency{
    
    struct Contract{
        uint id;
        string name;
        address add;
    }
    
    address public owner;
    uint public contractsCount;
    
    mapping(uint => Contract) public contracts;
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    function addCostituency(string memory name, address conadd) ownerOnly public {
        contractsCount ++;
        contracts[contractsCount] = Contract(contractsCount, name, conadd);
    }
}