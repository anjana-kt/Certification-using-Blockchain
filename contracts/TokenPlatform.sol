//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //prevents re entrancy attacks

contract TokenPlatform is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemIssued;

    address payable owner; //owner of the smart contract
    uint256 listingPrice = 0.025 ether; // price to issue

    constructor(){
        owner = payable(msg.sender);
    }

    struct Certification{
        uint itemId;
        address tokenContract;
        uint256 tokenId;
        address payable board;
        address payable owner;
        address receiver;
        uint256 price;
        bool issued;
    }

    //to use the Certificate struct using integer id
    mapping(uint256 => Certification) private idCertification;

    // event to print messsage to console
    event CertificationCreated(
        uint indexed itemId,
        address indexed  tokenContract,
        uint256 indexed tokenId,
        address payable board,
        address payable owner,
        address receiver,
        uint256 price,
        bool issued
    );

    /// @notice function to get listing price
    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public returns(uint256){
        if(msg.sender == address(this)){
            listingPrice = _price;
        }
        return listingPrice;
    }

    //board lists the owners and price by paying listing price. 
    // below price is only applicable for board
    /// @notice function to create certificate
    function createCertificate(address tokenContract,address receiver, uint256 tokenId, uint256 price) public payable nonReentrant{
        require(price > 0,"Price cannot be zero, atleast 0.25 ether");
        require(msg.value == listingPrice,"Price must be equal to listing price");

        _itemIds.increment();
         uint256 itemId = _itemIds.current();

        idCertification[itemId] = Certification(
            itemId,
            tokenContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            receiver,
            price,
            false
        );

        //transfer ownership of certificate to contract itself
        IERC721(tokenContract).transferFrom(msg.sender,address(this),tokenId);

        //to print the transaction
        emit CertificationCreated(itemId,tokenContract,tokenId,payable(msg.sender),payable(address(0)),receiver,price,false);
    }

    /// @notice function to claim
    function createMarketSale(address tokenContract, uint256 itemId) public payable nonReentrant{
        uint price = idCertification[itemId].price;
        uint tokenId = idCertification[itemId].tokenId;
        address receiver = idCertification[itemId].receiver;

        require(msg.value == price,"Please submit the asking price inorder to complete purchase");
        // require(msg.sender == receiver,"This certificate doesn't belong to you !");

        //pay the amount to board
        idCertification[itemId].board.transfer(msg.value);

        //transfer ownership of certificate from board to receiver
        IERC721(tokenContract).safeTransferFrom(address(this),msg.sender,tokenId);

        idCertification[itemId].owner = payable(msg.sender);
        idCertification[itemId].issued = true;
        _itemIssued.increment();
        payable(owner).transfer(listingPrice); //pay owner of contract the listing price
    }

    /// @notice total unclaimed certificates
    function fetchMarketItems() public view returns (Certification[] memory){
        uint itemCount = _itemIds.current(); // total no of items created ever
        uint unsoldItemCount = _itemIds.current() - _itemIssued.current();
        uint currentIndex = 0;

        Certification[] memory items = new Certification[](unsoldItemCount); // unsoldItemCount is size of array

        //loop to get unclaimed items
        for(uint i=0; i<itemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].owner == address(0)){
                //yes this is not claimed
                uint currentId = idCertification[i+1].itemId;
                Certification storage currentItem = idCertification[currentId];
                items[currentIndex] = currentItem;
                currentIndex+=1;
            }
        }
        return items;
    }

    /// @notice fetch Certificates owned by this user
    function fetchMyCertificates() public view returns(Certification[] memory){
        uint totalItemCount = _itemIds.current(); // total no of cert created ever

        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].owner == msg.sender){
                //get only the certificates this user claimed
                itemCount+=1;
            }
        }
        Certification[] memory items = new Certification[](itemCount);

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].owner == msg.sender){
                //get only the items this user bought
                uint currentId = idCertification[i+1].itemId;
                Certification storage currentItem = idCertification[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

    /// @notice fetch list of NFTs owned by this user
    function fetchItemsCreated() public view returns(Certification[] memory){
        uint totalItemCount = _itemIds.current(); // total no of items created ever

        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].board == msg.sender){
                //get only the items this user bought
                itemCount+=1;
            }
        }
        Certification[] memory items = new Certification[](itemCount);

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].board== msg.sender){
                //get only the items this user bought
                uint currentId = idCertification[i+1].itemId;
                Certification storage currentItem = idCertification[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }
    /// @notice fetch list of NFTs owned by this user
    function searchCertificates(address r) public view returns(Certification[] memory){
        uint totalItemCount = _itemIds.current(); // total no of items created ever

        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].board == r){
                //get only the items this user bought
                itemCount+=1;
            }
        }
        Certification[] memory items = new Certification[](itemCount);

        for(uint i=0; i<totalItemCount; i++){
            //check if owner field is empty
            if(idCertification[i+1].board== r){
                //get only the items this user bought
                uint currentId = idCertification[i+1].itemId;
                Certification storage currentItem = idCertification[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

}
