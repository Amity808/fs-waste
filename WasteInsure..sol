// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract WasteInsured {
    // Struct to represent waste records - optimized for gas efficiency
    struct Waste {
        address payable wasteAdmin;
        address payable producer;
        string ipfsHash; // IPFS hash pointing to detailed waste data on Filecoin
        uint256 weight;
        uint256 wasteAmount; // Payment amount for the waste
        address payable hospitalAddress;
        uint256 timestamp; // When the waste was recorded
        bool isRecorded;
        bool isValidated;
        bool isPaid;
    }

    // Struct to represent information about hospitals
    struct Hospital {
        string name;
        string image;
        string location;
        string hospitalType;
        address payable walletAddress;
    }

    struct TokenConfig {
        bool status;
        uint256 fee;
        uint256 balance;
    }

    mapping(address => TokenConfig) public allowedTokens;
    mapping(uint256 => TokenConfig) public savedToken;

    // Mapping to store waste records
    mapping(uint256 => Waste) public wasteRecords;
    uint256 public wasteCounter;
    uint256 tokenSaved;

    // Mapping to keep track of assigned point of collection
    mapping(address => bool) public assignedCollector;

    // Address of the waste admin (previously named Collector)
    address payable public wasteAdmin;

    // Mapping to store information about hospitals
    mapping(uint256 => Hospital) public hospitals;

    uint256 public hospitalCounter; // Counter to track the number of registered hospitals

    // Events - optimized for gas efficiency
    event WasteRecorded(
        uint256 indexed wasteId,
        address indexed producer,
        string ipfsHash,
        uint256 weight,
        uint256 wasteAmount,
        address payable hospitalAddress,
        uint256 timestamp
    );
    event WasteValidated(uint256 indexed wasteId, address indexed wasteAdmin);
    event PaymentSent(address indexed recipient, uint256 amount);
    event FundsWithdrawn(address indexed wasteAdmin, uint256 amount);
    event FundsDeposited(address indexed wasteAdmin, uint256 amount);
    event HospitalRegistered(
        uint256 indexed hospitalId,
        string name,
        string location,
        string hospitalType,
        address walletAddress
    );
    event AddNewToken(address token, uint256 fee, uint256 balance);
    event EditToken(address token, uint256 fee, uint256 balance);
    event DeleteToken(address token);

    // Modifier to restrict access to assigned producers
    modifier onlyCollector() {
        require(assignedCollector[msg.sender], "Must be a collector");
        _;
    }

    // Modifier to restrict access to the waste admin
    modifier onlyWasteAdmin() {
        require(
            msg.sender == wasteAdmin,
            "Only the waste admin can perform this action"
        );
        _;
    }

    // Constructor to set the waste admin during deployment
    constructor() {
        wasteAdmin = payable(msg.sender);
    }

    // Function for the waste admin to register a partnered hospital
    function registerPartnerHospital(
        string memory _name,
        string memory _image,
        string memory _location,
        string memory _hospitalType,
        address payable _walletAddress
    ) public onlyWasteAdmin {
        require(_walletAddress != address(0), "Invalid hospital address");

        hospitals[hospitalCounter] = Hospital(
            _name,
            _image,
            _location,
            _hospitalType,
            _walletAddress
        );
        hospitalCounter++;
        emit HospitalRegistered(
            hospitalCounter,
            _name,
            _location,
            _hospitalType,
            _walletAddress
        );
    }

    // Function for a producer to choose a hospital based on the hospital ID
    function assignProducer(address payable _collector) public {
        require(_collector != address(0), "Invalid producer address");

        assignedCollector[_collector] = true;
    }

    // Function for a producer to record waste information - optimized for gas efficiency
    function recordWaste(
        string memory _ipfsHash,
        uint256 _weight,
        uint256 _wasteAmount,
        address payable _hospitalAddress
    ) public onlyCollector {
        wasteRecords[wasteCounter] = Waste(
            wasteAdmin,
            payable(msg.sender),
            _ipfsHash,
            _weight,
            _wasteAmount,
            _hospitalAddress,
            block.timestamp,
            true,
            false,
            false
        );

        wasteCounter++;
        emit WasteRecorded(
            wasteCounter,
            msg.sender,
            _ipfsHash,
            _weight,
            _wasteAmount,
            _hospitalAddress,
            block.timestamp
        );
    }

    // Function for the waste admin to know if the waste recorded waste is validated
    function validateWaste(uint256 _wasteId) public onlyWasteAdmin {
        require(_wasteId <= wasteCounter, "Invalid waste ID");
        require(wasteRecords[_wasteId].isRecorded, "Waste is not yet recorded");
        require(
            !wasteRecords[_wasteId].isValidated,
            "Waste is already validated"
        );

        emit WasteValidated(_wasteId, msg.sender);
    }

    // Function for the waste admin to send payment to a hospital
    function wastePayment(
        uint256 _wasteId,
        address tokenW
    ) external onlyWasteAdmin {
        require(allowedTokens[tokenW].status, "Invalid token adddress");
        require(
            !wasteRecords[_wasteId].isValidated,
            "Waste is already validated"
        );

        wasteRecords[_wasteId].isValidated = true;
        wasteRecords[_wasteId].isPaid = true;
        uint256 amount = wasteRecords[_wasteId].wasteAmount;

        // require(IERC20(token).transferFrom(msg.sender,address(this),amountInToken), "Token transfer failed");
        require(
            IERC20Token(tokenW).transfer(
                wasteRecords[_wasteId].hospitalAddress,
                amount
            ),
            "Token transfer failed"
        );
        // (bool sent, ) = wasteRecords[_wasteId].hospitalAddress.call{value: amount}("");
        // require(sent, "Failed to send Ether");

        emit PaymentSent(wasteRecords[_wasteId].hospitalAddress, amount);
    }

    function withdrawFunds(uint256 _amount) public onlyWasteAdmin {
        require(
            _amount <= address(this).balance,
            "Insufficient contract balance"
        );

        (bool sent, ) = wasteAdmin.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        emit FundsWithdrawn(wasteAdmin, _amount);
    }

    // Function to get waste information by waste ID
    // Function to get waste information by waste ID - optimized for gas efficiency
    function getWasteInfo(
        uint256 _wasteId
    )
        public
        view
        returns (
            address,
            address,
            string memory,
            uint256,
            uint256,
            address payable,
            uint256,
            bool,
            bool,
            bool
        )
    {
        Waste storage waste = wasteRecords[_wasteId];

        return (
            waste.wasteAdmin,
            waste.producer,
            waste.ipfsHash,
            waste.weight,
            waste.wasteAmount,
            waste.hospitalAddress,
            waste.timestamp,
            waste.isRecorded,
            waste.isValidated,
            waste.isPaid
        );
    }

    // Function to get the total number of registered hospitals
    function getWasteLength() public view returns (uint256) {
        return wasteCounter;
    }

    function getHospitalCount() public view returns (uint256) {
        return hospitalCounter;
    }

    // Function to get information about a specific hospital by hospital ID
    function getHospitalInfo(
        uint256 _hospitalId
    )
        public
        view
        returns (
            string memory name,
            string memory image,
            string memory location,
            string memory hospitalType,
            address walletAddress
        )
    {
        require(_hospitalId <= hospitalCounter, "Invalid hospital ID");

        Hospital storage hospital = hospitals[_hospitalId];

        return (
            hospital.name,
            hospital.image,
            hospital.location,
            hospital.hospitalType,
            hospital.walletAddress
        );
    }

    function addNewToken(
        address token,
        uint256 fee,
        uint256 balance
    ) external onlyWasteAdmin {
        require(!allowedTokens[token].status, "Token already exists");
        allowedTokens[token] = TokenConfig(true, fee, balance);
        savedToken[tokenSaved] = TokenConfig(true, fee, balance);
        emit AddNewToken(token, fee, balance);
    }
    function editToken(
        address token,
        uint256 fee,
        uint256 balance
    ) external onlyWasteAdmin {
        require(allowedTokens[token].status, "Token does not exist");
        allowedTokens[token] = TokenConfig(true, fee, balance);
        // address,uint256, uint256
        emit EditToken(token, fee, balance);
    }

    function removeToken(address token) external onlyWasteAdmin {
        require(allowedTokens[token].status, "Token does not exist");
        delete allowedTokens[token];

        emit DeleteToken(token);
    }

    // Function to get all waste records for a specific producer
    function getWasteRecordsByProducer(
        address _producer
    ) public view returns (uint256[] memory) {
        uint256[] memory producerWastes = new uint256[](wasteCounter);
        uint256 count = 0;

        for (uint256 i = 0; i < wasteCounter; i++) {
            if (wasteRecords[i].producer == _producer) {
                producerWastes[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = producerWastes[i];
        }

        return result;
    }

    // Function to get waste statistics
    function getWasteStats()
        public
        view
        returns (
            uint256 totalWaste,
            uint256 totalWeight,
            uint256 totalAmount,
            uint256 validatedCount,
            uint256 paidCount
        )
    {
        totalWaste = wasteCounter;

        for (uint256 i = 0; i < wasteCounter; i++) {
            Waste storage waste = wasteRecords[i];
            totalWeight += waste.weight;
            totalAmount += waste.wasteAmount;

            if (waste.isValidated) {
                validatedCount++;
            }

            if (waste.isPaid) {
                paidCount++;
            }
        }
    }

    // Fallback function to receive funds
    receive() external payable {}
}
