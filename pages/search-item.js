import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import { tokenPlatformAddress, tokenAddress} from '../config'
import Tokenabi from '../utils/Token.json';
import Platformabi from '../utils/TokenPlatform.json';
import { withRouter ,useRouter} from 'next/router'

function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter();
  const recepient = router.query.recepient;
  console.log(recepient);

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // const web3Modal = new Web3Modal({
    //   network: "mainnet",
    //   cacheProvider: true,
    // })
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const platformContract = new ethers.Contract(tokenPlatformAddress, Platformabi.abi, signer)
    const tokenContract = new ethers.Contract(tokenAddress, Tokenabi.abi, provider)
    const data = await platformContract.searchCertificates(recepient);
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        board: i.board,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No certificates to show</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image
                            src={nft.image}
                            alt="Certificate"
                            className="rounded"
                            width={350}
                            height={500} 
                            // blurDataURL="data:..." automatically provided
                            // placeholder="blur" // Optional blur-up while loading
                          />
                <div className="p-4 bg-blue">
                  <p className="text-2xl font-bold">Degree - {nft.description} </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default withRouter(MyAssets)