import React, { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import {getCurrentWalletConnected} from "../utils/interact.js";
import {
  FormGroup,
  Label, 
  Input,
  Button
} from '../elements';
const MarketplacetABI = require('../Marketplace.json');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_API_URL;
const web3 = createAlchemyWeb3(alchemyKey);
const marketplaceAdress= process.env.REACT_APP_MARKETPLACE_ADRESS;
const pinata_api_key = process.env.REACT_APP_PINATA_KEY;
const pinata_secret_api_key = process.env.REACT_APP_PINATA_SECRET;


const Mint = () => {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState("none");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const mintFunc = async(fileToHandle,name,description) => {
    if (name.length > 18 || name.length <=0 ) {
      return {
        success: false,
        status: "Name to long or null"
      }
    }
  
    if (description.length > 36 || description.length <=0) {
      return {
        success: false,
        status: "Description to long or null"
      }
    }

  if (file === "none") {
    return {
      success: false,
      status: "File not selected"
    }
  }

  const allowedExtensions = [".jpg", ".png", ".pdf", ".mp4", ".gif", ".mp3"];
  const maxSize = 2000 * 1024;
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return {
      success: false,
      status: fileExtension
    }
  }

  if (file.size > maxSize) {
    return {
      success: false,
      status: "File to big"
    }
  }

    setStatus("Minting. Contract adress: " + marketplaceAdress)

    const formData = new FormData()
    formData.append("file", fileToHandle)
    const url_file =  `https://api.pinata.cloud/pinning/pinFileToIPFS`
    const url_json =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const response_file = await axios.post(
      url_file,
      formData,
      {
          maxContentLength: "Infinity",
          headers: {
              "Content-Type": `multipart/form-data;boundary=${formData._boundary}`, 
              'pinata_api_key': pinata_api_key,
              'pinata_secret_api_key': pinata_secret_api_key
          }
      }
    )
    
    const url_image="https://ipfs.io/ipfs/" + response_file.data.IpfsHash;

    const data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": name+ ".json"
      },
      "pinataContent": {
        "name": name,
        "description": description,
        "image": url_image
      }
    });

    const response_json = await axios.post(
      url_json,
      data,
      {
          maxContentLength: "Infinity",
          headers: {
              "Content-Type": 'application/json', 
              'pinata_api_key': pinata_api_key,
              'pinata_secret_api_key': pinata_secret_api_key

          }
      }
  )

  const tokenURI = "https://ipfs.io/ipfs/" + response_json.data.IpfsHash; 

  const marketPlaceContract = new web3.eth.Contract(MarketplacetABI.abi, marketplaceAdress)
  

  try {
      const {address, status} = await getCurrentWalletConnected();
      const txHash = await marketPlaceContract.methods.mintNFT(tokenURI).send({from: address})

      return {
          success: true,
          status: "Minted"
      }
  } catch (error) {
      return {
          success: false,
          status: "Error: " + error.message
      }
  }
}

const onMintPressed = async () => {
  const { status } = await mintFunc(file, name, description);
  setStatus(status);
};

return (
  <div className="Mint">
    <h2>Create</h2>
    <FormGroup>
      <Label>Name</Label>
      <Input 
        type="text"
        onChange={(event) => setName(event.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label>Description</Label>
      <Input
        type="text"
        onChange={(event) => setDescription(event.target.value)}
      />
    </FormGroup>
    <Label>Your NFT file(jpg,png,pdf,mp4,gif,mp3)</Label>
    <input type="file" accept=".jpg, .png, .pdf, .mp4, .gif, .mp3" onChange={(event)=>setFile(event.target.files[0])}/>
    <Button type="submit" onClick={() => { onMintPressed() }}>Mint NFT</Button>
    <Label>{status}</Label>
  </div>
);
};
  
export default Mint;