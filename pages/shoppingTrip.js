import React, { useRef } from "react";
import styles from "../styles/Home.module.css";
//import HeaderGame from "../components/HeaderGame"
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection"
//import AnnouncementBar from "../components/AnnouncementBar";
//import Displaygameinfo from "../components/Displaygameinfo"
//import Form1 from "../components/Form1";
import Footer from "../components/Footer"
import useTranslation from "next-translate/useTranslation"
import Head from "next/head"
import { useRouter } from 'next/router'
import AddItem from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import MapWithMarker from "../components/MapWithMarker";
import ShoppingList from "../components/ShoppingList";
import ShoppingListUnlisted from "../components/ShoppingListUnlisted";
import ShoppingTripItemCard from "../components/ShoppingTripItemCard";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Router from "next/router";
import { withRouter } from 'next/router';
import Popup from 'reactjs-popup';
import "reactjs-popup/dist/index.css";
import { render } from "react-dom";
import CreatableSelect from 'react-select/creatable';


const CustomButton = React.forwardRef(({ open, size, toSetModalWidth1, toSetModalWidth2, ...props}, ref) => {
  /*
  console.log("size", size)
  if (size.width < 700){
  toSetModalWidth1()
  }
  else {
  toSetModalWidth2()
  }*/

  return(
  <button className={styles.loginButton2} ref={ref} {...props}>
    Learn more about <br />Delivery, Final Price, Deposit, Fee & Final Payment
    <div className="absolute top-[5px] right-[5px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 35 35">
        <circle cx="17.5" cy="17.5" r="17.5" fill="#F5F5F5"/>
        <path fill="#808080" d="M17.192 25.404c-.806 0-1.519.682-1.519 1.519v.558c0 .868.713 1.519 1.519 1.519.868 0 1.519-.651 1.519-1.519v-.558c0-.837-.651-1.519-1.519-1.519Zm6.541-11.594c0-3.596-2.945-6.51-6.541-6.51a6.5 6.5 0 0 0-5.611 3.224 1.511 1.511 0 0 0 .527 2.077 1.53 1.53 0 0 0 2.108-.558 3.426 3.426 0 0 1 2.976-1.705c1.953 0 3.534 1.519 3.534 3.472 0 1.922-1.581 3.472-3.534 3.472-.806 0-1.519.713-1.519 1.519 0 .031 0 .031.031.062 0 .031-.031.031-.031.062v3.224c0 .868.713 1.519 1.519 1.519.868 0 1.519-.651 1.519-1.519v-2.015c2.883-.682 5.022-3.255 5.022-6.324Z"/>
      </svg>
    </div>
  </button>
)});

function ShoppingTrip({router}) {
  const {isAuthenticated, Moralis} = useMoralis();
  const [toRefreshListed, setToRefreshListed] = useState(false);
  const [toRefreshUnlisted, setToRefreshUnlisted] = useState(false);
  const [shoppingListPublish, setShoppingListPublish] = useState(false);
  const [itemResults, setItemResults] = useState(false);
  const [selectData, setSelectData] = useState(false);
  const [myLockScroll, setMyLockScroll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [screenCSS, setScreenCSS] = useState("flex flex-col");
  const [ifFilters, setIffilters] = useState(false);
  const [myItemsFilter, setMyItemsFilter] = useState(false);
  const [othersItemsFilter, setOthersItemsFilter] = useState(false);
  const [partiallyTakenFilter, setPartiallyTakenFilter] = useState(false);
  const [fullyTakenFilter, setFullyTakenFilter] = useState(false);
  const [tripData, setTripData] = useState(undefined);
  const [totalNoItems, setTotalNoItems] = useState(undefined);
  const [isUCLA, setIsUCLA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalWidth, setModalWidth] = useState(undefined);
  const [profileChecked, setProfileChecked] = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [localIfSharee, setLocalIfSharee] = useState(false);
  const [myExpectedTotal, setMyExpectedTotal] = useState(undefined);
  const [myItemNo, setMyItemNo] = useState(undefined);
  const [isUCLAorPartners, setIsUCLAorPartners] = useState(false);


  const text2 = "If you can't make it in time for pick up, please communicate with the shopper asap and he/she will try to accomodate you if possible."

  const alertMessageData = (arg) => {
    handleAlertMessage(arg)
    };


  const OthersItem = "Others' Items"

  const text1 = "'s Shopping Trip to"


  const filterPopup = "filterPopup"+router.query.tripId


  const myItemsFilterToggleChecked = () => setMyItemsFilter(value => !value);
  const othersItemsFilterToggleChecked = () => setOthersItemsFilter(value => !value);
  const partiallyTakenFilterToggleChecked = () => setPartiallyTakenFilter(value => !value);
  const fullyTakenFilterToggleChecked = () => setFullyTakenFilter(value => !value);

  const size = useWindowSize();
  function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}


  const handleCloseFilterPopup = () => {
    ////console.log("handleClosePopup")
    document.getElementById(filterPopup).click();
  };

  const handleFilterShowResults = async () => {
    const newListForFilter = await MoralisCloudFunction()
    const user = Moralis.User.current()
    var finalList = []
    if (true){
      for(const indiItem of newListForFilter){
        if (indiItem.ObjId == user.id){
          finalList.push(indiItem)
        } else if (indiItem.ObjId != user.id && indiItem.itemSharees && indiItem.itemSharees.length > 0){
          for (const indiSharee of indiItem.itemSharees){
            if(indiSharee.joinToShareUser == user.id){
              finalList.push(indiItem)
            }
          }
        }
      }
    }


    if(!myItemsFilter && othersItemsFilter){
      var arr1 = newListForFilter
      var res = arr1.filter(item => !finalList.includes(item));
      finalList = res
    }
    else if (myItemsFilter && othersItemsFilter){
      finalList = newListForFilter
    } else if (!myItemsFilter && !othersItemsFilter){
        finalList = newListForFilter
    }

    var finalList2 = []
    if(true){
      for(const indiItem2 of finalList){
        if (indiItem2.itemSharesAvailable == 0){
          finalList2.push(indiItem2)
        }
      }
    }
    //console.log("finalList2 A", finalList2)

    if(!fullyTakenFilter && partiallyTakenFilter){
      var res2 = finalList.filter(item => !finalList2.includes(item));
      finalList2 = res2
      //console.log("finalList2 B", finalList2)
    } else if (fullyTakenFilter && partiallyTakenFilter){
      finalList2 = finalList
    } else if (!fullyTakenFilter && !partiallyTakenFilter){
      finalList2 = finalList
    }

    if (true){
      setItemResults(finalList2)
      setIffilters(true)
      if(!myItemsFilter && !othersItemsFilter && !fullyTakenFilter && !partiallyTakenFilter){
        setIffilters(false)
      } else if(myItemsFilter && othersItemsFilter && fullyTakenFilter && partiallyTakenFilter){
        setIffilters(false)
      }

    }
  };

  const changeSelectData = (arg) => {
      //console.log("arg:", arg)
      if(arg && !arg.notPublic){
        //console.log("not run")
        MoralisCloudFunction();
      } else if (arg.notPublic){
        toDeleteItem(arg.notPublic)
        setTimeout(() => {
        MoralisCloudFunction();
      }, 1000);
      }
    };

  const refreshUnlisted = (arg) => {
    setToRefreshUnlisted(value=>!value)
    };

  const refreshListed = (arg) => {
    setToRefreshListed(value=>!value)
    };

  useEffect(() => {
      console.log("isPartners in shopping trip:", router.query.isPartners)

      setTimeout(() => {

      const ifUCLA = checkIsUCLA();
      if (ifUCLA || router.query.isPartners){
        setIsUCLAorPartners(true)
      }
      if (!ifUCLA && !router.query.isPartners){
        return
      } else{
        console.log("returning one trip")
      returnOneUCLATrip(router.query.tripId)
      MoralisCloudFunction();}



      }, 500);
  }, []);


  useEffect(() => {
    if (size.width < 700){
    toSetModalWidth1()
    }
    else {
    toSetModalWidth2()
    }

  }, [size]);

  async function toDeleteItem(deletedItemId) {

    var newItemResults=[]

    var allItems
    setTimeout(async () => {
      allItems = await MoralisCloudFunction()
      if (allItems && allItems.length > 0){
        for(const indiItem of allItems){
          if (indiItem.itemId != deletedItemId){
            newItemResults.push(indiItem)
          }
        }
      }
      setItemResults(newItemResults)
    }, 1000);

    /*const allItems = await MoralisCloudFunction()
    for(const indiItem of allItems){
      if (indiItem.itemId != deletedItemId){
        newItemResults.push(indiItem)
      }
    }
    setItemResults(newItemResults)*/

  }

  const toSetModalWidth1 = () => {setModalWidth('90vw')}
  const toSetModalWidth2 = () => {setModalWidth('680px')}



  async function checkIsUCLA() {
      const user = Moralis.User.current()
      if (user){
        const params = {userId: user.id}
        const results = await Moralis.Cloud.run("checkIsUCLA", params)
        if (results || router.query.isPartners == true){
          setIsUCLA(true)
          setLoading(false)
          return true
        } else {
        setLoading(false)
        return false}
      }
      setLoading(false)
      return false
  }


  async function returnOneUCLATrip(tripId) {
    const params = {tripId: router.query.tripId}
    const results = await Moralis.Cloud.run("returnOneUCLATrip", params)
    console.log("returnOneUCLATrip", results)
    setTripData(results)
    }

  const handleAlertMessage = async (msg) => {
    setAlertMessage(msg)
    setOpenAlertMessage(true)
  }

  const checkProfile = ()=>{
    if(!isAuthenticated){
      ()=>{onOpen}
      handleAlertMessage("Please Login to join trip!")
      return
    }
    const theUser = Moralis.User.current()
    console.log("theUser.attributes.phoneNumber.length:", theUser.attributes.phoneNumber.length)

    if (!theUser.attributes.phoneNumber || theUser.attributes.phoneNumber.length < 4){
      ()=>{onOpen}
      handleAlertMessage("Your User Profile is not completed yet! Please complete first!")

      setProfileChecked(false)
      return false
    } else {
      setProfileChecked(true)
      return true
    }
  }

  async function MoralisCloudFunction() {
      const user = Moralis.User.current()
      if (!user){
        return
      }
      const params = {tripId: router.query.tripId}
      const results = await Moralis.Cloud.run("returnShoppingTripItems", params)
      var ifSharee = false
      var shareeData
      var myExpectedTotal = 0
      var myItems = 0
      //console.log(results)
      if (results.length == 0) {
        setTotalNoItems(0)
        return
      }
      var resultsToSet = []
      //var fullItemIdList_0 = []
      //var fullItemIdListTF_0 = []
      for (let i = 0; i < results.length; i++){
        var whereBoughtData = null
        if (results[i].attributes.whereBought){
          whereBoughtData = results[i].attributes.whereBought
        }
        if (results[i].attributes.ObjId == user.id){
          setLocalIfSharee(true)
          myExpectedTotal += results[i].attributes.itemRetailPrice/results[i].attributes.itemShares*results[i].attributes.itemSharesTaking
          myItems ++
        }
        var finalItemSharesAvailable = null
        if (results[i].attributes.itemSharees == undefined){
          finalItemSharesAvailable = results[i].attributes.itemShares - results[i].attributes.itemSharesTaking
        } else {

          var itemSharesShareesTaking = 0
          for(const eachSharee of results[i].attributes.itemSharees){
            itemSharesShareesTaking += Number(eachSharee.shareTaking)
            if (eachSharee.joinToShareUser == user.id){

              ifSharee = true
              setLocalIfSharee(true)
              myExpectedTotal += eachSharee.shareTaking*results[i].attributes.itemRetailPrice/results[i].attributes.itemShares
              myItems ++
              shareeData = eachSharee

            }
          }
          //console.log("itemSharesShareesTaking", itemSharesShareesTaking)
          finalItemSharesAvailable = results[i].attributes.itemShares - results[i].attributes.itemSharesTaking - itemSharesShareesTaking
          if (finalItemSharesAvailable < 0){
            return "finalItemSharesAvailable < 0 Error!"
          }
        }
        //console.log("finalItemSharesAvailable", finalItemSharesAvailable)
        resultsToSet.push({
          indexNo: i+1,
          itemName: results[i].attributes.itemName,
          itemBrand: results[i].attributes.itemBrand,
          itemRetailPrice: results[i].attributes.itemRetailPrice,
          itemCostAfterTax: results[i].attributes.itemCostAfterTax,
          itemImage: results[i].attributes.itemImage,
          whereBought: whereBoughtData,
          itemCreator: results[i].attributes.ObjId,
          itemId: results[i].id,
          itemShares: results[i].attributes.itemShares,
          itemSharesAvailable: finalItemSharesAvailable,
          itemBasicUnitsNo: results[i].attributes.itemBasicUnitsNo,
          itemSharesTaking: results[i].attributes.itemSharesTaking,
          ObjId: results[i].attributes.ObjId,
          takeUpAll: results[i].attributes.takeUpAll,
          itemCode: results[i].attributes.itemCode,
          itemSharees: results[i].attributes.itemSharees,
          changeSelectData: changeSelectData,
          tripId: router.query.tripId,
          ifSharee: ifSharee,
          shareeData: shareeData,
        })
        //fullItemIdList_0.push({itemId: results[i].id, quantity: "", itemShares: results[i].attributes.itemShares, itemRetailPrice: results[i].attributes.itemRetailPrice})
      }
      ////console.log("resultsToSet", resultsToSet)
      //setFullItemIdList(fullItemIdList_0)
      //setFullItemIdListTF(fullItemIdListTF_0)
      setMyItemNo(myItems)
      setItemResults(resultsToSet)
      setTotalNoItems(resultsToSet.length)
      setMyExpectedTotal(myExpectedTotal)
      return resultsToSet
    }


  return (
    <div className={`${screenCSS}`}>
      <Head>
        <title>Shopping Trip | Split Sharing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>

      <div className="w-full">
      <Popup
        open={openAlertMessage}
        closeOnDocumentClick = {false}
        contentStyle = {{
          background: "rgba(0, 0, 0, 0.3)",
          width: "100%",
          height: "100%",
        }}
      >
      {close => (
        <div className="flex flex-col items-center">
          <div className="rounded-xl bg-white flex flex-col items-center w-full md:w-[500px] translate-y-[50vh] md:translate-y-[50vh]">



            <div className="text-[18px] px-[10px] w-[90vw] md:w-[500px] text-center">
              {alertMessage}
            </div>


            {alertMessage == "Your User Profile is not completed yet! Please complete first!" &&

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

            {alertMessage == "Please Login to join trip!" &&

            <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
              <button
                className={styles.loginButton}
                onClick={() => {
                  router.push({
                                  pathname: '/',
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
                  setOpenAlertMessage(false)
                  setAlertMessage('')
                  close()
                }}
              >
                close
              </button>
            </div>

          </div>
        </div>
      )}
      </Popup>
      </div>


      {(isAuthenticated && loading) ?

        <div>
          Loading
        </div>


      : (isAuthenticated && isUCLAorPartners && !loading) ?


      <div className="flex flex-col items-center pt-[40px]">
        <div className="py-[20px] md:py-[40pt] flex flex-col items-center absolute left-[6px] md:hidden">
          <button
          onClick={()=>{
            if(true){
            router.push({
              pathname: '/shoppingTrips',
            })
          }
          }}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 36 36">
            <path fill="#C8C8C8" d="M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18Z"/>
            <path fill="#fff" d="M28 19.5a1.5 1.5 0 0 0 0-3v3ZM6.94 16.94a1.5 1.5 0 0 0 0 2.12l9.545 9.547a1.5 1.5 0 1 0 2.122-2.122L10.12 18l8.486-8.485a1.5 1.5 0 1 0-2.122-2.122L6.94 16.94ZM28 16.5H8v3h20v-3Z"/>
          </svg>
          </button>
        </div>


        <div className="pt-[60px] md:pt-[80pt] flex flex-col items-center w-[300px]">

          {tripData &&
          <div className="flex flex-col items-center">
              <div className="flex flex-col h-[6.7vw] lg:h-[2.7vw]">
                  <p className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[17px] text-black font-bold">{tripData.displayName && tripData.displayName}
                  <span className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-gray-500">{text1}</span>
                  <span className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[17px] font-normal text-[black]"> {tripData.tripStore}</span>
                  </p>


              </div>

              {false &&
                <div>
                  <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black">
                  Do you want things from Costco?
                  </p>
                  <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black">
                  You can Add item(s) to this Shopping Trip or
                  </p>
                  <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black">
                  Join others who have added item(s) below.
                  </p>
                </div>
              }


              <div className="flex flex-col items-left w-full pt-[10px] lg:pt-[20px]">
                  <div className="text-gray-700 text-[13px] lg:text-[15px]">
                    Drop off Day, Date & Time: <br/>
                    <span className="text-black font-bold text-[13px] lg:text-[14px] text-[red]"> {tripData.dropOffDay} {tripData.dropOffDate}, {tripData.dropOffTime} </span>
                  </div>
              </div>

              <div className="flex flex-col items-left w-full pt-[5px] lg:pt-[5px]">
                  <div className="text-gray-700 text-[13px] lg:text-[15px]">
                    Deadline for Item Add & Deposit: <br/>
                    <span className="text-black font-bold text-[13px] lg:text-[14px] text-[red]"> {tripData.deadlineDate}, {tripData.deadlineTime} </span>
                  </div>
              </div>


              <div className="pt-[10px] lg:pt-[20px]">
                  <div className="text-gray-700 text-[13px] lg:text-[15px]">
                    Drop off Location:
                    <span className="text-black font-bold text-[15px] lg:text-[14px]"> {tripData.dropOffLocation} </span>
                  </div>
                  <MapWithMarker {...{lat:tripData.lat, lng:tripData.lng}} justDisplay={true}/>
              </div>




          </div>
          }



        </div>


        <div className="w-[300px] justify-between pt-[20px]">



            <Popup
              trigger={open => <CustomButton open={open} {...{size: size, toSetModalWidth1: toSetModalWidth1, toSetModalWidth2: toSetModalWidth2}} />}
              position="bottom center"
              closeOnDocumentClick = {false}
              contentStyle = {{
                background: 'rgb(255, 255, 255)',
                width: modalWidth,
              }}
            >
              {close => (

              <div className="flex flex-col items-center py-[5px]">

              <div className="absolute top-[5px] right-[5px]">
                <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={()=>{
                  close()

                }}
                >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
              </div>

              <div className="py-[10px] md:py-[20pt] flex flex-col items-center">
                <div className="flex flex-col items-center px-[5px] md:px-[10px]">
                  <div>
                    <div className='font-bold'>
                    Delivery:
                    </div>
                    <div className='pt-[5px]'>
                    Only the street side Pick Up option is available for current Shopping Trips. There will be a 30 minutes window for Pick Up at the Drop Off location.
                    {text2}
                    </div>
                  </div>

                  <div className='pt-[20px]'>
                    <div className='font-bold'>
                    Final Price:
                    </div>
                    <div className='pt-[5px]'>
                    At Split Sharing, we want to provide pricing transparency to our community so the final price will be determined by the actual receipt price from the shopper.
                    After shopping, the shopper will upload and send the purchase receipt to all users who joined the shopping trip.
                    For a Costco shopping trip, the Expected price listed on items are usually 15-20% higher than the actual price because Costco online is more expensive than actual Costco retail.
                    The difference in pricing is also where Split Sharing is bringing part of the value to users.
                    </div>
                  </div>

                  <div className='pt-[20px]'>
                    <div className='font-bold'>
                    Deposit:
                    </div>
                    <div className='pt-[5px]'>
                    For now by the Deposit deadline, users who joined or matched items for the shopping trip will need to deposit 20% of the total expected price for items that they are joining to purchase. The exact deposit amount will be shown on this page.
                    <br />A Venmo QR code from the shopper and also the deposit amount will be sent to each user through in app messaging for the deposit payment.
                    <br />After users received the final shopping receipt, the remaining balance plus fee shall be paid to the shopper upon pick up.
                    </div>
                  </div>

                  <div className='pt-[20px] pb-[10px]'>
                    <div className='font-bold'>
                    Fee & Final Payment:
                    </div>
                    <div className='pt-[5px]'>
                    Split Sharing is at a very early stage so we are not charging for any service fee as a marketplace at this moment.
                    <br />However, the shopper, who did the physical work shall be rewarded with a small fee.
                    <br />For now the Shopper Fee is at <span className='font-bold'>5%</span> of the actual price from the final receipt.
                    <br />This Fee, in addition to the remaining balance to be paid to the shopper will be the Final Payment.
                    <br />The Final Payment amount will be sent to each user who joined the trip through in app messaging and Final Payment shall be settled upon Pick Up.
                    </div>
                  </div>


                </div>
              </div>
              <div className="absolute bottom-[5px] right-[5px]">

                <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={()=>{
                  close()

                }}



                >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>

              </div>
              </div>
              )}
            </Popup>



        </div>



        <div className="flex flex-row items-center w-[300px] justify-between pt-[20px]">
          <div className="flex flex-col items-center w-[250px]">

              <button className={styles.ShoppingTripButton1}
              onClick={()=>{
                if (!checkProfile()){
                  return}
                if(true){


                router.push({
                  pathname: '/addItemToShoppingTrip',
                  query: { tripId: router.query.tripId,
                          }
                })
              }

              }}
              >
                Add New Item To Shopping Trip
              </button>

          </div>

          <div className='flex flex-col items-center pl-[20px] md:pl-[20px]'>
              <Popup
                trigger={open => (<button className={styles.ShoppingTripButton2} id={filterPopup}> {!open ? 'Filters' : 'Back'} </button>)}
                position="bottom right"
                contentStyle = {{
                  background: 'rgb(255, 255, 255)',
                  width: '320px',
                  translate: '10px',
                }}
              >
                {close => (
                <div className="flex flex-col items-center py-[5px]">
                <div className="py-[10px] md:py-[20pt] flex flex-col items-center">
                  <div className="flex flex-col items-center w-[300px]">
                    <div>
                    Filters:
                    </div>
                  </div>
                  <div className="flex flex-row items-center w-[300px] justify-between border-2 rounded-lg px-[10px] my-[2px]">
                    <div className='pr-[10px]'>
                    My Items
                    </div>
                    <div className="text-white h-[35px]">
                      <label htmlFor="toggleA" className="flex items-center cursor-pointer pt-[5px]">

                        <div className="relative">

                          <input type="checkbox" id="toggleA" className="sr-only" checked={myItemsFilter} onChange={myItemsFilterToggleChecked}/>

                          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>

                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row items-center w-[300px] justify-between border-2 rounded-lg px-[10px] my-[2px]">
                    <div className='pr-[10px]'>
                    {OthersItem}
                    </div>
                    <div className="text-white h-[35px]">
                      <label htmlFor="toggleB" className="flex items-center cursor-pointer pt-[5px]">

                        <div className="relative">

                          <input type="checkbox" id="toggleB" className="sr-only" checked={othersItemsFilter} onChange={othersItemsFilterToggleChecked}/>

                          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>

                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row items-center w-[300px] justify-between border-2 rounded-lg px-[10px] my-[2px]">
                    <div className='pr-[10px]'>
                    Partially Taken
                    </div>
                    <div className="text-white h-[35px]">
                      <label htmlFor="toggleC" className="flex items-center cursor-pointer pt-[5px]">

                        <div className="relative">

                          <input type="checkbox" id="toggleC" className="sr-only" checked={partiallyTakenFilter} onChange={partiallyTakenFilterToggleChecked}/>

                          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>

                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row items-center w-[300px] justify-between border-2 rounded-lg px-[10px] my-[2px]">
                    <div className='pr-[10px]'>
                    Fully Taken
                    </div>
                    <div className="text-white h-[35px]">
                      <label htmlFor="toggleD" className="flex items-center cursor-pointer pt-[5px]">

                        <div className="relative">

                          <input type="checkbox" id="toggleD" className="sr-only" checked={fullyTakenFilter} onChange={fullyTakenFilterToggleChecked}/>

                          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>

                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>

                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-[286px] py-[5px] px-[5px]">
                  <button type="button" className={styles.ButtonSharingShopping}
                  onClick={() => {
                    handleCloseFilterPopup()
                    handleFilterShowResults()
                  }}
                  >
                    Show Results
                  </button>
                </div>


                </div>
                )}
              </Popup>
          </div>
        </div>

        {localIfSharee &&

          <div className="pt-[20px] md:pt-[20pt] pb-[10px]">
              <div className="text-gray-700 text-[13px] lg:text-[15px] font-bold">
                Total Expected Value for Shares that You are taking:
                <span className="text-black font-bold text-[14px] lg:text-[15px] text-[red]"> ${Math.round(myExpectedTotal * 100) / 100} </span>
              </div>

              <div className="text-gray-700 text-[13px] lg:text-[15px] font-bold">
                Total No. of Items You have joined/ created to share:
                <span className="text-black font-bold text-[14px] lg:text-[15px] text-[red]"> {myItemNo} </span>
              </div>
          </div>

        }

        <div className="pt-[30px] md:pt-[50pt] pb-[10px]">
            <div className="text-gray-700 text-[13px] lg:text-[15px]">
              Current Total No. of Items on trip:
              <span className="text-black font-bold text-[13px] lg:text-[14px] text-[red]"> {totalNoItems} </span>
            </div>
        </div>




        {!ifFilters ?
        <div className="pt-[10px] md:pt-[20pt] pb-[10px] md:pb-[20pt] flex flex-col items-center text-gray-700 text-[13px] lg:text-[15px]">
          All Items in this Trip:
        </div>
        :
        <div className="pt-[10px] md:pt-[20pt] pb-[10px] md:pb-[20pt] flex flex-rol items-center text-gray-700 text-[13px] lg:text-[15px]">
        Filter Results:
        <span className="text-black font-bold text-[13px] lg:text-[14px] text-[red]"> &nbsp;{itemResults.length}</span>
        </div>
        }

        {itemResults && (
        <div>
            <div className="grid grid-cols-1 gap-[3vw] lg:gap-[3vw] lg:grid-cols-2 xl:grid-cols-4 md:px-[40px]">
                {itemResults.map((card, index) => (
                    <ShoppingTripItemCard key={index} {...card} alertMessageData={alertMessageData} />
                ))}
            </div>
        </div>
        )}




        <div className="flex flex-col items-center pt-[150px] pb-8" >
          <div className="flex flex-col items-center w-80 px-6">

              <button className={styles.loginButton}
              onClick={() => {

                  Router.push({
                    pathname: '/shoppingTrip',
                    query: { tripId: router.query.tripId,
                            }
                  })

              }}
              >
                Back to Top
              </button>

          </div>

          <div className="flex flex-col items-center w-80 px-6 pt-[20px]">

              <button className={styles.loginButton}
              onClick={() => {

                  Router.push({
                    pathname: '/shoppingTrips',

                  })

              }}
              >
                Back to See <br/>All Shopping Trips
              </button>

          </div>
        </div>
      </div>
      : (isAuthenticated && !isUCLA && !loading && !router.query.isPartners) ?
      <div className="flex flex-col items-center pt-[80px] pb-8 px-[12px]" >
        This feature is currently only available to UCLA students.
        <br />
        If you are a UCLA student, please Sign Up with your
        <br />@ucla.edu or @g.ucla.edu email.
      </div>
      : (!isAuthenticated) &&
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
          <Link href="/">
            <button className={styles.loginButton}>
              Please Login to join shopping trip!
            </button>
          </Link>
        </div>
      </div>
     }
     <div className="h-[150px]">
     </div>
    </div>
  )
}

export default withRouter(ShoppingTrip)
//render(<ShoppingTrip />, document.getElementById("root"));
