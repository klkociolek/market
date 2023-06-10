import React, { useEffect, useState } from 'react';
import {
  Box, 
  Button,
  Block,
  Description,
  Price,
  Title,
  Image
} from '../elements';
import {getCurrentWalletConnected, handleImageError} from "../utils/interact.js";
import axios from 'axios';
const MarketplacetABI = require('../Marketplace.json');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_API_URL;
const web3 = createAlchemyWeb3(alchemyKey);
const marketplaceAdress= process.env.REACT_APP_MARKETPLACE_ADRESS;

const Discover = () => {
  
  const [nfts, setNfts] = useState([]);


  useEffect(() => { 
    loadNFTs();
  }, [])

  async function loadNFTs() {
    
    const {address} = await getCurrentWalletConnected();
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)
    const listings = await marketPlaceContract.methods.getListedNfts().call({from: address})
    
    const nfts = await Promise.all(listings.map(async i => {
      try {
        const tokenURI = await marketPlaceContract.methods.tokenURI(i.tokenId).call()
        const meta = await axios.get(tokenURI)
        const nft = {
          price: i.price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.buyer,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return nft
      } catch(err) {
        console.log(err)
        return null
      }
    }))
    setNfts(nfts.filter(nft => nft !== null))
  }

  async function buyNft(nft) {
    const {address} = await getCurrentWalletConnected();
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress);
    await marketPlaceContract.methods.buyNFT(marketplaceAdress, nft.tokenId).send({ from: address, value: nft.price });
    loadNFTs()
  }
  
  return (
    <div>
      <h1>Listed items</h1>
      <Box>
      {
        nfts.map((nft, i) => (
          <Block key={i}>
            <a href = {nft.image}>
              <Image src={nft.image} onError={handleImageError} />
            </a>
            <Title>{nft.name}</Title>
            <Description>{nft.description}</Description>
            <Price>Price: {web3.utils.fromWei(nft.price, "ether")} ETH</Price>
            <Button type="submit" onClick={() => { buyNft(nft) }}>Buy</Button>
          </Block>
        ))
      }
      </Box>
    </div>
  );
};
  
export default Discover;