pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _NFTCount;
    Counters.Counter private _NFTListed;
    address payable owner;

    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
    }

    event NFTListed (
      address nftContract,
      uint256 tokenId,
      address seller,
      address owner,
      uint256 price,
      bool listed
    );

    event NFTMinted (
      address nftContract,
      uint256 tokenId,
      address seller,
      address owner,
      uint256 price,
      bool listed
    );

    event NFTSold (
      address nftContract,
      uint256 tokenId,
      address seller,
      address owner,
      uint256 price,
      bool listed
    );

    mapping(uint256 => NFT) private _idNFT;

    constructor() ERC721("ElectricNFT", "EE") {
        owner = payable(msg.sender);
    }

    function mintNFT(string memory _tokenURI) public {
        _NFTCount.increment();
        uint256 newTokenId = _NFTCount.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        _idNFT[newTokenId] = NFT(
          address(this),
          newTokenId, 
          payable(msg.sender),
          payable(msg.sender),
          0,
          false
        );

        emit NFTMinted(address(this), newTokenId, msg.sender, msg.sender, 0,false);
    }

    function listNFT(address _nftContract,uint256 _tokenId, uint256 _price)  public payable {
        require(_price > 0, "Make sure the price isn't negative");
        _NFTListed.increment();

        _transfer(msg.sender, address(this), _tokenId);

        NFT storage nft = _idNFT[_tokenId];
        nft.seller = payable(msg.sender);
        nft.owner = payable(address(this));
        nft.listed = true;
        nft.price = _price;

        emit NFTListed(_nftContract, _tokenId, msg.sender, address(this), _price,true);
    }

    function buyNFT(address _nftContract,uint256 _tokenId) public payable {
      NFT storage nft = _idNFT[_tokenId];
      require(msg.value >= nft.price, "Value to low");

      address payable buyer = payable(msg.sender);
      payable(nft.seller).transfer(msg.value);
      _transfer(address(this), buyer, nft.tokenId);
      nft.owner = buyer;
      nft.listed = false;

      _NFTListed.decrement();
      emit NFTSold(_nftContract, nft.tokenId, nft.seller, buyer, msg.value,false);
    }

    function cancelNft(address _nftContract, uint256 _tokenId) public payable {
    
      NFT storage nft = _idNFT[_tokenId];
      require(msg.sender == nft.seller, "You need to be seller");
      _transfer( address(this),nft.seller, nft.tokenId);
      nft.owner = nft.seller;
      nft.listed = false;

      _NFTListed.decrement();
      emit NFTSold(_nftContract, nft.tokenId, nft.seller, nft.seller, msg.value,false);
    }
    

    function getAllNFTs() public view returns (NFT[] memory) {
      uint256 nftCount = _NFTCount.current();

      NFT[] memory nfts = new NFT[](nftCount);
      uint nftsIndex = 0;
      for (uint i = 0; i < nftCount; i++) {
          nfts[nftsIndex] = _idNFT[i + 1];
          nftsIndex++;
      }
      return nfts;
    }
    

  function getMyNfts() public view returns (NFT[] memory) {
    uint nftCount = _NFTCount.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idNFT[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idNFT[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyListedNfts() public view returns (NFT[] memory) {
    uint nftCount = _NFTCount.current();
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idNFT[i + 1].seller == msg.sender && _idNFT[i + 1].listed) {
        myListedNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idNFT[i + 1].seller == msg.sender && _idNFT[i + 1].listed) {
        nfts[nftsIndex] = _idNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getListedNfts() public view returns (NFT[] memory) {
    uint256 nftCount = _NFTCount.current();
    uint256 nftListed =  _NFTListed.current();

    NFT[] memory nfts = new NFT[](nftListed);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idNFT[i + 1].listed) {
        nfts[nftsIndex] = _idNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

}