import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal"
import { tokenAddress, tokenPlatformAddress } from '../config';
import Tokenabi from '../utils/Token.json';
import Platformabi from '../utils/TokenPlatform.json';
import Image from 'next/image';

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(()=>{
    loadNFTs();

  }, []);

  async function loadNFTs(){
    // const provider = new ethers.providers.JsonRpcProvider();
    const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
    const tokenContract = new ethers.Contract(tokenAddress, Tokenabi.abi, provider);
    const Platform = new ethers.Contract(tokenPlatformAddress,Platformabi.abi, provider);

    //return an array of unsold market items
    const data = await Platform.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
       const tokenUri = await tokenContract.tokenURI(i.tokenId);
       const meta = await axios.get(tokenUri);
       let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
       let item = {
         price,
         tokenId: i.tokenId.toNumber(),
         board: i.board,
         owner: i.owner,
         image: meta.data.image,
         name: meta.data.name,
         description: meta.data.description,
         receiver: meta.data.receiver
       }
       return item;
    }));

    setTokens(items);
    setLoadingState('loaded');
  }

  async function claimNFT(token){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenPlatformAddress, Platformabi.abi, signer);

    //set the price
    const price = ethers.utils.parseUnits(token.price.toString(), 'ether');

    //make the sale
    const transaction = await contract.createMarketSale(tokenAddress, token.tokenId, {
      value: price,gasLimit: 3e7
    });
    await transaction.wait();
    console.log("Claimed successfully");
    loadNFTs()
  }

  if(loadingState === 'loaded' && !tokens.length) return (
    // <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
    // <input type="search" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>     
    <h1 className="px-20 py-10 text-3xl">No Certificates</h1>
// </div>

  )

  return (
   <div className="flex justify-center">
      {/* <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
      <input type="search" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>     
</div> */}
     <div className="px-4" style={{ maxWidth: '1600px'}}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {
          tokens.map((nft, i) =>(
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <Image
                  src={nft.image}
                  alt="Certificate"
                  width={500}
                  height={500}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                />
              <div className="p-2">
                <p style={{ height: '64px'}} className="text-2xl font-semibold">
                  {nft.name}
                </p>
                <div style={{ height: '60px', overflow: 'hidden'}}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
                {/* <div style={{ height: '40px', overflow: 'hidden'}}>
                  <p className="text-gray-400">{nft.receiver}</p>
                </div> */}
              </div>
              <div className="p-4 bg-black">
                <button className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                onClick={() => claimNFT(nft)}>Claim</button>
            </div>
            </div>
          ))
        }
      </div>
     </div>
   </div>
  )
}