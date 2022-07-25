//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Token is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // state vars cost u money beware!
    //so we specify strings are to be stored in memory inorder to reduce cost
    address contractAddress;

    constructor(address platformAddress) ERC721("Degree Tokens", "CERT"){
        contractAddress = platformAddress;
    }

    /// @notice create a new token
    function createToken(string memory tokenURI) public returns(uint){

        // set a new token id for tokens to be minted
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(payable(msg.sender), newItemId); //// mint token
        _setTokenURI(newItemId,tokenURI); //generate uri
        setApprovalForAll(contractAddress, true); //grant transaction permission to platform

        return newItemId;
    }
}