// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SBML is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter internal _tokenIdCounter;

    string[25] private NFTuri;
    address payable wallet1;
    address payable wallet2;

    uint private mintPrice;
    uint8[] internal availableTokenIds = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    constructor(string[25] memory _NFTuri, address payable wallet1_, address payable wallet2_, uint mintPrice_) ERC721("SBML X", "SBML"){
        require(_NFTuri.length == 25, "Invalid URI list size");
        NFTuri = _NFTuri;
        wallet1 = wallet1_;
        wallet2 = wallet2_;
        mintPrice = mintPrice_;
    }

    function mint() public payable onlyOwner {
        require(availableTokenIds.length != 0, "No more available NFT");
        require(msg.value >= mintPrice, "Not enough ETH sent");

        uint256 tokenId = _tokenIdCounter.current();
        if (tokenId < 5) {
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
        }
        else {
            uint randomIndex = random(availableTokenIds.length);
            _safeMint(msg.sender, availableTokenIds[randomIndex]);

            // remove randomIndex element from availableTokenIds
            availableTokenIds[randomIndex] = availableTokenIds[availableTokenIds.length - 1];
            availableTokenIds.pop();
        }
    }

    function random(uint max) public view returns (uint){
        return uint(
            keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))
        ) % max;
    }

    function withdraw(uint256 amount) public {
        require(amount <= address(this).balance, "Not enough balance");
        wallet1.transfer(amount * 10 / 100);
        wallet2.transfer(amount * 90 / 100);
    }

    function _burn(uint256 tokenId) internal pure override(ERC721, ERC721URIStorage) {
        revert("Not available");
    }

    // set new price for Mint
    function setMintPrice(uint newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    function getMintPrice() public view returns(uint){
        return mintPrice;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return NFTuri[tokenId];
    }

    function setTokenURI(uint tokenId, string memory _tokenURI) public onlyOwner {
        require(!_exists(tokenId), "You can't change URI of already existing NFT");
        NFTuri[tokenId] = _tokenURI;
    }
}

