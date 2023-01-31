import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useEffect, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import ShoppingTripItemCardPublic from "../components/ShoppingTripItemCardPublic";
import Head from "next/head"
import React from 'react';
import Popup from 'reactjs-popup';
import { useRouter } from 'next/router'


export default function ShoppingTrips({isPartners}) {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();
  const router = useRouter()
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [itemBasicUnitsNo, setItemBasicUnitsNo] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filterModal, setFilterModal] = useState(false);
  const [cityFilterValue, setCityFilterValue] = useState('');
  const [zipCodeFilterValue, setZipCodeFilterValue] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [Filter_City_Text, setFilter_City_Text] = useState("By Sharer's Ctiy: (e.g. Santa Monica)");
  const [Filter_ZipCode_Text, setFilter_ZipCode_Text] = useState("By Sharer's Zip Code: (e.g. 90005)");




  const [allowCityFilterChecked, setAllowCityFilterChecked] = useState(false);
  const [allowZipCodeFilterChecked, setAllowZipCodeFilterChecked] = useState(false);


  const allowZipCodeFilterToggleChecked = () => setAllowZipCodeFilterChecked(value => !value);
  const allowCityFilterToggleChecked = () => setAllowCityFilterChecked(value => !value);




  //const userObj = Moralis.User.current();
  const [userObjId, setUserObjId] = useState();
  const [startQ, setStartQ] = useState(true);
  const [resultss, setResultss] = useState(undefined);

  var controlNum = 0

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')}

  const alertMessageData = (arg) => {
    setAlertMessage(arg)
    setOpen(true)

    };

  const keySubmit=(event)=> {
        if (event.keyCode === 13) {
            handleSearch()
        }
    }

  const basicQuery0 = () => {
    setStartQ(false)
    if (controlNum==0){
      controlNum++
    basicQuery()}

  }

  const handleFilterResults = async () => {
    let toSubmitCityFilterValue = ""
    if(cityFilterValue.length > 0 && allowCityFilterChecked){
      toSubmitCityFilterValue = cityFilterValue
    }
    console.log("toSubmitCityFilterValue:", toSubmitCityFilterValue)
    let toSubmitZipCodeFilterValue = ""
    if(zipCodeFilterValue.length > 0 && allowZipCodeFilterChecked){
      toSubmitZipCodeFilterValue = zipCodeFilterValue
    }
    console.log("toSubmitZipCodeFilterValue:", toSubmitZipCodeFilterValue)


    if(toSubmitCityFilterValue == "" && toSubmitZipCodeFilterValue == ""){
      if(searchValue){
      handleSearch()
      return
      } else {
      returnAllResults()
      return }
    }


    let theSearchValue = undefined
    if(searchValue){
      theSearchValue = searchValue
    }
    const params = {searchValue: theSearchValue, cityFilterValue: toSubmitCityFilterValue, zipCodeFilterValue: toSubmitZipCodeFilterValue}
    const results = await Moralis.Cloud.run("returnFilterItems", params)
    console.log("filter results", results)

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
        })
      }

      setResultss(resultsToSet)
    }else{
      setResultss(undefined)
    }
  }

  const handleSearch = async () => {
    if(searchValue.length == 0){
      return
    }
    const params = {searchValue: searchValue}
    const results = await Moralis.Cloud.run("returnSearchItemsByText", params)
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
          alertMessageData: alertMessageData,
        })
      }
      //console.log("resultsToSet", resultsToSet)
      setResultss(resultsToSet)
    }else{
      setResultss(undefined)
    }
  }

  const handleMoreOptions = async () => {
    console.log("more options")
  }



  const { fetch } = useMoralisQuery(
    "testItemData2",
    (query) => query.equalTo("ObjId", userObjId),
    [userObjId],
    { autoFetch: false }
  );



  async function returnAllUCLATrips() {
    const params = {}
    const results = await Moralis.Cloud.run("returnAllUCLATrips", params)
    console.log("results", results)


    var resultsToSet = []
    if (results){
    for (let i = 0; i < results.length; i++){
      resultsToSet.push({
      ...results[i], ...{alertMessageData: alertMessageData}
      })
    }

    console.log("resultsToSet_UCLA", resultsToSet)
        //return
    setResultss(resultsToSet)
    }
    }


  useEffect(() => {
    setTimeout(() => {
      returnAllUCLATrips();
    }, 500);


    //setState(state => (userObj.attributes));
    //console.log("userObj.attributes.displayName", userObj.attributes.displayName)
  }, []);


  return (
    <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>



        <Popup
          open={open}
          closeOnDocumentClick
          onClose={closeModal}
        >
        {close => (
          <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center w-[90vw] md:w-[500px]">



            <div className="text-[18px] px-[10px] w-[90vw] md:w-[500px] text-center">
              {alertMessage}
            </div>


            {alertMessage == "Your User Profile is not completed yet! Please complete first before contacting sharers." &&

            <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
              <button
                className={styles.loginButton}
                onClick={() => {
                  router.push({
                                  pathname: '/userProfile',
                              });
                }}
              >
                Go to User Profile
              </button>
            </div>

            }

            {alertMessage == "Please Login to join Trip!" &&

            <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
              <button
                className={styles.loginButton}
                onClick={() => {
                  router.push({
                                  pathname: '/signin',
                              });
                }}
              >
                Login Now
              </button>
            </div>

            }


            <div className="flex flex-col items-center w-full pt-[15px]">
              <button
                className="text-[17px] text-center"
                onClick={() => {
                  setOpen(false)
                  setAlertMessage('')
                }}
              >
                close
              </button>
            </div>

          </div>
        )}
        </Popup>









    <div className="flex flex-col items-center">

      <div>{true && (
        <div className="flex flex-col items-center pt-[10px] pb-[10px]">
          <div className="flex flex-row items-center w-80 md:w-[500px]">



              <Popup open={filterModal}
                     position="bottom center"
                     closeOnDocumentClick
                     onClose={() => {
                      setFilterModal(false)
                     }}
              >
                <div className="flex flex-col items-center w-[100vw] h-[100vh] bg-white translate-y-[100px] md:translate-y-[140px]">
                  <div className="rounded-xl border-2 border-[#F1592A] bg-white flex flex-col items-center w-80 md:w-[500px] h-auto z-50 md:translate-x-[200px]">
                      <div className="text-[20px] text-center pt-[5px] text-[#F1592A]">
                        Filters
                      </div>

                      <div className="pt-[15px]">
                        <div className="flex flex-row items-center">
                          <input
                            type={"text"}
                            onKeyDown={(e) => keySubmit(e) }
                            className="border-2 border-[#F1592A] rounded-l-xl text-gray-700 h-[35px] w-[250px] md:w-[350px] text-left pl-1 md:pl-2 text-sm"
                            placeholder= {Filter_City_Text}
                            value={cityFilterValue}
                            onChange={(e) => {
                              setCityFilterValue(e.target.value)
                              setAllowCityFilterChecked(true)
                              if(e.target.value.length < 1){
                                setAllowCityFilterChecked(false)
                              }
                            }}
                          />
                          <div className="bg-[#F1592A] rounded-r-xl h-[35px] w-[50px] md:w-[80px] flex flex-col items-center">
                            <div className="text-white h-[35px]">
                              <label htmlFor="toggleA" className="flex items-center cursor-pointer pt-[5px]">

                                <div className="relative">

                                  <input type="checkbox" id="toggleA" className="sr-only" checked={allowCityFilterChecked} onChange={allowCityFilterToggleChecked}/>

                                  <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>


                              </label>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="pt-[15px]">
                        <div className="flex flex-row items-center">
                          <input
                            type={"text"}
                            onKeyDown={(e) => keySubmit(e) }
                            className="border-2 border-[#F1592A] rounded-l-xl text-gray-700 h-[35px] w-[250px] md:w-[350px] text-left pl-1 md:pl-2 text-sm"
                            placeholder= {Filter_ZipCode_Text}
                            value={zipCodeFilterValue}
                            onChange={(e) => {
                              setZipCodeFilterValue(e.target.value)
                              setAllowZipCodeFilterChecked(true)
                              console.log("zipCodeFilterValue: ", zipCodeFilterValue)
                              if(e.target.value.length < 1){
                                setAllowZipCodeFilterChecked(false)
                              }
                            }}
                          />
                          <div className="bg-[#F1592A] rounded-r-xl h-[35px] w-[50px] md:w-[80px] flex flex-col items-center">
                            <div className="text-white h-[35px]">
                              <label htmlFor="toggleB" className="flex items-center cursor-pointer pt-[5px]">

                                <div className="relative">

                                  <input type="checkbox" id="toggleB" className="sr-only" checked={allowZipCodeFilterChecked} onChange={allowZipCodeFilterToggleChecked}/>

                                  <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>


                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[10px] right-[57px] md:right-[10px]">
                        <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={()=>{setFilterModal(false)}}
                        >
                          <span className="sr-only">Close menu</span>
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>


                      <div className="flex flex-row pt-[15px] pb-[8px]">
                        <div className="pr-[15px] px-[20px] text-[#F1592A] text-[12px]">
                          <button
                            className={styles.clearButton}
                            onClick={() => {
                              setZipCodeFilterValue("")
                              setCityFilterValue("")
                              setAllowCityFilterChecked(false)
                              setAllowZipCodeFilterChecked(false)
                            }}
                          >
                            Clear All
                          </button>
                        </div>

                        <div className="pr-[15px] px-[20px] text-[#F1592A] text-[12px]">
                          <button
                            className={styles.loginButton}
                            onClick={() => {
                              setFilterModal(false)
                              handleFilterResults()
                            }}
                          >
                            See Filter Results
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
              </Popup>




          </div>


        </div>
      )}

      {resultss && (
      <div>
          <div className="w-[100vw] justify-items-center grid grid-cols-1 gap-[0.5vw] gap-y-[20px] md:w-auto md:gap-[2vw] md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {resultss.map((card, index) => (
                  <ShoppingTripItemCardPublic key={index} {...card} isPartners={isPartners} />
              ))}
          </div>
      </div>

      )}

      </div>
    </div>
    </div>
  );
}
