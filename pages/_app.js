import '../styles/globals.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  //const [searchInput, updateFormInput] = useState({address: ''});
  return( 
    <div>
      <nav className="border-b p-6" >
        <p className = "text-4xl font-bold">Course Certification Platform</p>
        <div className="flex mt-4"></div>
        <Link href="/">
          <a className="mr-4 text-blue-500">Home</a>
        </Link>
        <Link href="/upload-item">
          <a className="mr-6 text-blue-500">Issue certificate</a>
        </Link>
        <Link href="/my-certificates">
          <a className="mr-4 text-blue-500">Showcase</a>
        </Link>
        {/* <input 
                    placeholder="Search here"
                    className="mt-8 border rounded p-3"
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}
        /> 
        <Link href="/search-item">
        <button class="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2"
        onClick={
          ()=>{router.push('/search-item')}
        }>
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
        </svg>
      </button>
      </Link> */}
      <div className="flex items-center justify-center ">
    <div className="flex border-2 border-gray-200 rounded">
        <input id="search" type="text" className="px-4 py-2 w-80" placeholder="Search address.."/>
        <button className="px-4 text-white bg-gray-600 border-l " onClick={()=>{
          var r_address = document.getElementById("search").value;
          router.push({pathname:"/search-item", query: {recepient :r_address} });
        }}>
            Search
        </button>
    </div>
</div>

    {/*
    searchbar2
    <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
      <input type="search" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>     
    </div> */}

        <Link href="/see-certificates">
          <button></button>
        </Link>
        
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
export default MyApp
