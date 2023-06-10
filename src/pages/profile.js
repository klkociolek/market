import React, { useEffect,useState } from "react";
import {getCurrentWalletConnected, handleImageError} from "../utils/interact.js";
import axios from 'axios';
import {
  Button,
  Description,
  Title,
  Image,
  Box,
  FormGroup,
  Label,
  Input,
  Block
} from '../elements';
const MarketplacetABI = require('../Marketplace.json');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_API_URL;
const web3 = createAlchemyWeb3(alchemyKey);
const marketplaceAdress= process.env.REACT_APP_MARKETPLACE_ADRESS;




const Profile = () => {

  const [ownedNfts, setOwnedNfts] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);
  const [walletAddress, setWallet] = useState("");
  const [pricestatus, setPriceStatus] = useState("");
  const [price, setPrice] = useState("");
  
  useEffect(() => {
    wallet_update();
    loadOwnedNFTs();
    loadListedNFTs();
  }, []);

  async function wallet_update() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
  }


  async function loadOwnedNFTs() {
    
    const {address} = await getCurrentWalletConnected();
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)
    const listings = await marketPlaceContract.methods.getMyNfts().call({from: address})
    
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
    setOwnedNfts(nfts.filter(nft => nft !== null))
  }

  async function loadListedNFTs() {
    
    const {address} = await getCurrentWalletConnected();
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)
    const listings = await marketPlaceContract.methods.getMyListedNfts().call({from: address})
    
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
    setListedNfts(nfts.filter(nft => nft !== null))
  }

  const onListPress = async (adress,tokenid,price) => {
    if (isNaN(price) || price < 0 ) {
      setPriceStatus("wrong input")
    }else{
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)
    marketPlaceContract.methods.listNFT(adress, tokenid, web3.utils.toWei(price, 'ether'))
        .send({ from: walletAddress, value: web3.utils.toWei('0', 'ether') }).on('receipt', function () {
            console.log('listed')
        });
    }
  }

  
  const onCancelPress = async (adress,tokenid) => {
    const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)

    marketPlaceContract.methods.cancelNft(adress, tokenid)
        .send({ from: walletAddress, value: '0' }).on('receipt', function () {
            console.log('canceled')
        });
  }

  return (
    <div className="App">
      <h1>Profile</h1>
      <h3>Adress: {walletAddress}</h3>
      <h1>Owned items</h1>
      <FormGroup>
      <Label>{pricestatus}</Label>
      <Label>Sell price in ETH</Label>
      <Input 
        type="text"
        onChange={(event) => setPrice(event.target.value)}
      />
      </FormGroup>
        <Box>
        {
        ownedNfts.map((nft, i) => (
          <Block key={i}>
            <a href = {nft.image}>
              <Image src={nft.image} onError={handleImageError} />
            </a>
            <Title>{nft.name}</Title>
            <Description>{nft.description}</Description>
            <Button type="submit" onClick={() => { onListPress(marketplaceAdress,nft.tokenId,price) }}>Sale for {price} eth </Button>
          </Block>
        ))
        }
        </Box>
      <h1>Listed items</h1>
      <Box>
        {
        listedNfts.map((nft, i) => (
          <Block key={i}>
            <a href = {nft.image}>
              <Image src={nft.image} onError={handleImageError} />
            </a>
            <Title>{nft.name}</Title>
            <Description>{nft.description}</Description>
            <Button type="submit" onClick={() => { onCancelPress(marketplaceAdress,nft.tokenId) }}>Cancel listing</Button>
          </Block>
        ))
        }
        </Box>
    </div>
  );
};
  
export default Profile;