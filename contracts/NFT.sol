// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract Horhuts is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    string[] private NFTuri;

    constructor(string[] memory _NFTuri) ERC721("Horhuts", "HORH"){
        require (_NFTuri.length == 25);
        NFTuri = _NFTuri;
    }
    
     function Mint() public  onlyOwner {
        safeMint(msg.sender);
        
    }
    // SafeMint не работает, это я пытался разными способами нужный результат получить, пока что на этом остановился
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        if (tokenId < 5){
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        }
        else {
        _safeMint(to, _random.tokenId);
        }
     }
    
    function _random(uint tokenId) public view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        msg.sender))) % tokenId;

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
        return super.tokenURI(tokenId);
    }
}
