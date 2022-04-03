pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {

// Structure to store user profile Information
  struct _userInfo {
    string name;
    string description;
    address addr;
    string usn;
  }
// Structure to store metadata of the token
  struct _nftmetadata {
    string name;
    string hashed_name;
    string description;
    string link;

  }

  mapping (address => _userInfo) public userInfo;
  mapping (uint256 => _nftmetadata) public nftMetadata;
  mapping (string => bool) public nftExists;
  string[] public colors;

  mapping(string => bool) _colorExists;
  address owner; 

  constructor() ERC721Full("Color", "COLOR") public {
    owner = msg.sender;
    userInfo[address(this)] = _userInfo("Contract", "Contract of this Dapp", address(this), "0x0");

  }

  // Modifier to allow only contract owner to call functions
  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
//  Creating new NFT only by contract owner
  function mint(string memory _color, string memory _hash, string memory description, string memory link) public onlyOwner {

    require(!nftExists[_hash], "NFT does exist !!!");

    uint next_token = this.totalSupply();

    _nftmetadata memory next_token_metadata = _nftmetadata(_color,_hash, description, link);
    nftMetadata[next_token] = next_token_metadata;
    nftExists[_hash] = true;
    _mint(address(this), next_token); 

  }

  function getContractOwner() public view returns (address) {
    return owner;
  }

//  Function to set user information
  function registerUser(string memory name, string memory description, string memory usn ) public {
    _userInfo memory user = _userInfo(name ,description, msg.sender, usn);
    userInfo[msg.sender] = user;
  }

//  Function to send token to another address from contract account
  function sendToken(address _to, uint256 _tokenId) public {
    _transferFrom(address(this),_to, _tokenId);
  }

  function getOwnerData(uint256 _tokenId) public view returns ( string memory) {
    address own =  ownerOf(_tokenId);
    return userInfo[own].name;

  }

}
