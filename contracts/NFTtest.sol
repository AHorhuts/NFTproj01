// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "..//.deps/github/erc721r/ERC721R/contracts/ERC721R.sol";
//import "https://github.com/erc721r/ERC721R/blob/main/contracts/ERC721R.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Horhuts is ERC721r,  Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string[] private NFTuri;
    

    constructor(string[] memory _NFTuri ) ERC721r("Horhuts", "HORH", 25){
        require(_NFTuri.length == 25, "Invalid URI list size");
        NFTuri = _NFTuri;
    }

    function mint(uint quantity) external onlyOwner {
        _mintRandom(msg.sender, quantity);
    }

     function mintFirstFive() external onlyOwner {
        for (uint i = 5; i > 0; i--) {
            _mintAtIndex(msg.sender, i - 1);
        }
    }
     
     function setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        NFTuri[tokenId] = _tokenURI;
    }

    //function tokenURI(uint256 tokenId)
    //public
    //view
    //override(ERC721r, ERC721URIStorage)
    //returns (string memory)
    //{
      //  return NFTuri[tokenId];
    //}
}