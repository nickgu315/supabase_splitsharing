import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/search.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useCallback, useRef, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import Router from "next/router";
import Popup from 'reactjs-popup';
//import { useRouter } from 'next/router'



export default function AddItem() {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();

  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemRetailPrice, setItemRetailPrice] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [whereBought, setWhereBought] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [itemShares, setItemShares] = useState(1);
  const [itemSharesAvailable, setItemSharesAvailable] = useState(1);
  const [itemBasicUnitsNo, setItemBasicUnitsNo] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [toBack, setToBack] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');

  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])
  const [selectedFrSearchToAdd, setSelectedFrSearchToAdd] = useState(false)
  const [itemRefImage, setItemRefImage] = useState(undefined);
  const [itemRefPrice, setItemRefPrice] = useState(undefined);
  const [itemRefUrl, setItemRefUrl] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  //const router = useRouter()

  const searchEndpoint = (query) => `/api/search?q=${query}`

  const onChange_searchToAdd = useCallback((event) => {
    const query = event.target.value;
    setQuery(event.target.value)
    console.log("query.length at callback", query.length)
    if (query.length > 0){
        handleSearchToAdd(event.target.value)
    } else if(event.target.value.length == 0){
      setTimeout(() => {
        setResults([])
      }, 1000);
    }
  }, [])

  const handleSearchToAdd = async (queryToSearch) => {
  if (queryToSearch.length > 0) {
    const params = {searchValue: queryToSearch}
    const results = await Moralis.Cloud.run("returnSearchItemsToAdd", params)
    if (results.length > 0){
      var resultsToSet = []
      for (let i = 0; i < results.length; i++){
        resultsToSet.push({
          indexNo: i+1,
          itemName: results[i].attributes.itemName,
          itemRefPrice: results[i].attributes.itemRefPrice,
          itemRefImage: results[i].attributes.itemRefImage,
          itemUrl: results[i].attributes.itemUrl,
          itemCode: results[i].attributes.itemCode
          //alertMessageData: alertMessageData,
        })
      }
      console.log("results returned to add", resultsToSet)
      setResults(resultsToSet)
    }
    else {
    setResults([])
    }
  } else if(queryToSearch.length == 0){
    setResults([])
  }

  }

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])


  const itemBasicUnitText = "* Total Number of Basic Units for this item:"

  const displayAlert = (message) => {
    setAlertMessage(message)
    setOpen(true)
  }

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')}

  const keySubmit=(event)=> {
        if (event.keyCode === 13) {
          handleSearch()
        }
    }

  const handleSearch = async () => {
    if(searchValue.length == 0){
      return
    }
    const params = {searchValue: searchValue}
    const results = await Moralis.Cloud.run("returnSearchItemsToAdd", params)
    console.log("searchResults: ", results)
    if(results.length > 0){
      var resultsToSet = []
      for (let i = 0; i < results.length; i++){
        var whereBoughtData = null
        if (results[i].attributes.whereBought){
          whereBoughtData = results[i].attributes.whereBought
          //console.log("if wherebought", whereBoughtData)
        }
        resultsToSet.push({
          indexNo: i+1,
          itemName: results[i].attributes.itemName,
          itemBrand: results[i].attributes.itemBrand,
          itemRetailPrice: results[i].attributes.itemRetailPrice,
          itemCostAfterTax: results[i].attributes.itemCostAfterTax,
          itemBasicUnitsNo: results[i].attributes.itemBasicUnitsNo,
          itemImage: results[i].attributes.itemImage,
          whereBought: whereBoughtData,
          itemCreator: results[i].attributes.ObjId,
          itemId: results[i].id,
          itemShares: results[i].attributes.itemShares,
          itemSharesAvailable: results[i].attributes.itemSharesAvailable,
          //alertMessageData: alertMessageData,
        })
      }
      //console.log("resultsToSet", resultsToSet)
      //setResultss(resultsToSet)
    }
  }

  const handleItemFormSubmit = async () => {
    if(!itemName){
      displayAlert("Please Input Item Name")
      return
    }
    if(!itemRetailPrice){
      displayAlert("Please Input Item Price")
      return
    }
    const userObj = Moralis.User.current()
    if (!userObj.attributes.phoneNumber){
      displayAlert("Your User Profile is not completed yet! Please complete first before listing items.")
      //Router.push("/userProfile")
      Router.push({
                      pathname: '/userProfile',
                  });
      return
    }

    setSubmitted(true)
    console.log("itemImage", itemImage)
    var uploadItemImageResults
    var uploadItemReceiptResults
    var finalUploadItemImageResults

    if (itemImage){
    const uploadItemImage = new Moralis.File(itemImage.name, itemImage);
    uploadItemImageResults = await uploadItemImage.saveIPFS();
    console.log("uploadItemImageResults", uploadItemImageResults)
    setImageUrl1(uploadItemImageResults._url)
    finalUploadItemImageResults = uploadItemImageResults._url
    }
    else if (!itemRefImage){
      setSubmitted(false)
      displayAlert("Item Image not chosen.")
      return
    }
    else if (!itemImage && itemRefImage){
      finalUploadItemImageResults = itemRefImage
    }

    if (itemReceipt){
    const uploadItemReceipt = new Moralis.File(itemReceipt.name, itemReceipt);
    uploadItemReceiptResults = await uploadItemReceipt.saveIPFS();
    console.log("uploadItemReceiptResults", uploadItemReceiptResults)
    setImageUrl2(uploadItemReceiptResults._url)}

    //const userObj = Moralis.User.current();

    const TestItemData = Moralis.Object.extend("shoppingListData1");

    const TestItemDataACL = new Moralis.ACL();
    TestItemDataACL.setWriteAccess(userObj.id, true);
    TestItemDataACL.setReadAccess(userObj.id, true); // after review only public can read
    const testItemData = new TestItemData();
    testItemData.setACL(TestItemDataACL);

    const params = {
      ObjId: userObj.id,
      itemName: itemName,
      itemBrand: itemBrand,
      itemRetailPrice: itemRetailPrice,
      itemCostAfterTax: itemCostAfterTax,
      itemBasicUnitsNo: itemBasicUnitsNo,
      itemShares: itemShares,
      itemSharesAvailable: itemSharesAvailable,
      whereBought: whereBought,
      itemImage: finalUploadItemImageResults,
      itemReceipt: itemReceipt ? uploadItemReceiptResults._url : null,
      public: true,
      archived: false,
      teamChecked: false,
      matched: false,
    }
    console.log("params", params)

    testItemData
      .save(params)
      .then(
        (results) => {
          console.log("Submitted Results", results)
          displayAlert("Submitted Successfully!")
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )

      var es = document.forms[0].elements;

      //es[1].onclick = function(){
        //clearInputFile(es[0]);
      //};

      function clearInputFile(f){
          if(f.value){
              try{
                  f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
              }catch(err){
              }
              if(f.value){ //for IE5 ~ IE10
                  var form = document.createElement('form'), ref = f.nextSibling;
                  form.appendChild(f);
                  form.reset();
                  ref.parentNode.insertBefore(f,ref);
              }
          }
      }

      for (const ele of es){
        clearInputFile(ele)
      }



    setItemName('')
    setItemBrand('')
    setItemRetailPrice('')
    setItemCostBeforeTax('')
    setItemCostAfterTax('')
    setWhereBought('')
    setItemBasicUnitsNo('')
    setItemShares(2)
    setItemSharesAvailable(1)
    setItemImage(undefined)
    setItemReceipt(undefined)
    setSubmitted(false)

  }


  const onSelectItemImage = e => {
    //console.log("e.target.files.length", e.target.files.length)
        if (!e.target.files || e.target.files.length === 0) {
            setItemImage(undefined)
            return
        }
        //console.log("e.target.files[0]", e.target.files[0].name)
        //using the first image instead of multiple
        setItemImage(e.target.files[0])
    }

    const onSelectItemReceipt = e => {
          if (!e.target.files || e.target.files.length === 0) {
              setItemReceipt(undefined)
              return
          }

          //using the first image instead of multiple
          setItemReceipt(e.target.files[0])
      }

  return (
    <div className="flex flex-col items-center bg-white pt-6 pb-6 flex flex-col items-center rounded-lg border-2 border-[#F1592A] md:w-auto">
          <Popup
            open={open}
            closeOnDocumentClick
            onClose={closeModal}
          >
          {close => (
            <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center">



              <div className="text-[20px] px-[10px] w-[90vw] md:w-[500px] text-center">
                {alertMessage}
              </div>


              <div className="flex flex-col items-center w-full pt-[15px]">
                <button
                  className="text-[17px] text-center"
                  onClick={() => {
                    setOpen(false)
                    if(alertMessage == "Submitted Successfully!"){
                      Router.push({
                                      pathname: '/shoppingList',
                                  })
                    }
                    setAlertMessage('')
                  }}
                >
                  close
                </button>
              </div>

            </div>
          )}
          </Popup>



        {isAuthenticated && (
          <div>

          <div
            className="px-6 w-80 relative md:w-[400px] pt-[30px] pb-[10px]"
            ref={searchRef}
          >
            <input
              className="border-2 border-[#F1592A] rounded-xl text-gray-700 h-[35px] w-full text-left pl-1 md:pl-2 text-sm font-Quicksand font-bold"
              onChange={onChange_searchToAdd}
              onFocus={onFocus}
              placeholder='Search to Add'
              type='text'
              value={query}
            />
            { active && results.length > 0 && (
              <div className="translate-y-[5px] z-100 h-[600px] z-50 absolute overflow-y-scroll bg-[#f5f5f5] w-[300px] md:w-[380px] px-6 left-[10px] md:left-[10px] rounded-xl">
              <div className="text-[12px] pt-[8px]">No. of Results: {results.length}</div>
              <ul>
                {results.map(({ indexNo, itemName, itemRefImage, itemRefPrice, itemUrl}) => (
                  <button className="rounded bg-[#0070f3] py-[8px] px-[8px] mt-[9px] z-101 text-[12px] text-[#eee] w-full text-left" key={indexNo}
                      onClick={()=>{
                      setActive(false)
                      setSelectedFrSearchToAdd(true)
                      setItemRefImage(itemRefImage)
                      setItemRefPrice(itemRefPrice)
                      setItemRetailPrice(itemRefPrice)
                      setItemRefUrl(itemUrl)
                      setWhereBought("Costco")
                      setItemName(itemName)}}>
                      <a>{itemName}</a>
                  </button>
                ))}
              </ul>
              </div>
            ) }
          </div>


          <form className="px-6 w-80 relative md:w-auto">
            <div className="absolute top-[-94px] right-[5px]">
              <Link href="/shoppingList">
              <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
              </Link>
            </div>



            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
                * Item Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="itemName" type="text" placeholder="Paper Towels" value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemBrand">
                Item Brand (optional)
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="itemBrand" type="text" placeholder="Bounty" value={itemBrand}
              onChange={(e) => {
                setItemBrand(e.target.value);
              }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whereBought">
                * Where to buy this item?
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="whereBought" type="text" placeholder="Costco" value={whereBought}
              onChange={(e) => {
                setWhereBought(e.target.value);
              }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemRetailPrice">
                * Expected Entire Item Price (Tax Excluded) <br /><span className="text-xs">(This price is the expected price reference.) <br /> </span>
              </label>
              { selectedFrSearchToAdd &&
                <div>
                  <div className="w-[250px] md:w-[320px] text-[#0070f3]">
                    Below is a expected price reference only. Please adjust accordingly.
                    Actual Retail price at Bulk Club Retail stores might be Lower.)
                  </div>
                </div>
              }
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="itemRetailPrice" type="number" placeholder="18.99" value={itemRetailPrice}
              onChange={(e) => {
                setItemRetailPrice(e.target.value);
              }}
              />
            </div>


            { selectedFrSearchToAdd &&
              <div className="pb-[10px]">
                <div className="w-[250px] md:w-[320px] text-[#0070f3]">
                  Below is a reference image. If no image is uploaded, it will be set as your listing image when submitted.
                </div>
                <div>
                  <img src={itemRefImage} className="w-full"/>
                </div>
                <a className="w-[250px] md:w-[320px] text-[#0070f3]" href={itemRefUrl} target="_blank" rel="noreferrer">
                  Product reference Link (Click to Check)
                </a>
              </div>
            }
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemImage">
                * Item Image
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="itemImage" type='file' onChange={onSelectItemImage} name="Item_Image" />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {!submitted ?
              <button className={styles.loginButton} type="button"
              onClick={handleItemFormSubmit}
              >
                Submit
              </button> :
              <p>Uploading Item</p>}
            </div>


          </form>
          </div>

      )}

    </div>
  );
}
