// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Horhuts is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    mapping(uint => uint) private _availableTokenId;
    uint256 private _numAvailableTokens;

     // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;
    
    string[] private NFTuri;
    
    
    constructor(string[] memory _NFTuri) ERC721("Horhuts", "HORH"){
        require(_NFTuri.length == 25, "Invalid URI list size");
        NFTuri = _NFTuri;
        _numAvailableTokens = _NFTuri.length;
    }
      
    function mint() public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        if (tokenId < 5) {
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
        }
        else {
            _safeMint(msg.sender, _random(tokenId));
        }
    }

    function _random(uint tokenId) public view returns (uint){
        return uint(
            keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))
        ) % tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return NFTuri[tokenId];
    }

    function setTokenURI(uint tokenId, string memory _tokenURI) public onlyOwner{
        require(!_exists(tokenId), "You can't change URI of already existing NFT");
        NFTuri[tokenId] = _tokenURI;
        
    }
    
}    
    
    

