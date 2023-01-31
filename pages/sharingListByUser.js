import React, { useRef } from "react";
import Popup from 'reactjs-popup';
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
import ItemCardByUser from "../components/ItemCardByUser";
import ItemCardPublicNew from "../components/ItemCardPublicNew";
import SharingList from "../components/SharingList";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import { withRouter } from 'next/router';
import Router from "next/router";
import Header from "../components/Header";

function SharingListByUser({router}){
  const {isAuthenticated, Moralis} = useMoralis();
  const [sharerName, setSharerName] = useState('');
  const [itemResults, setItemResults] = useState('');
  const [chartData, setChartData] = useState([]);
  const [fullItemIdList, setFullItemIdList] = useState([]);
  const [fullItemIdListTF, setFullItemIdListTF] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const router2 = useRouter()

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')}

  let itemList = []
  const changeChartData = (arg) => {
    setChartData(chartData => [...chartData, arg])
    };

  const backToTop = () => {
    document.getElementById('sharer').scrollIntoView();
    }

  const handleAlert = (arg) => {
      setAlertMessage(arg)
      setOpen(true)
    };


  useEffect(() => {
    if(!true){
      return
    }
    setTimeout(() => {
    getUsername();
    MoralisCloudFunction();
    }, 1000);
  }, []);

  const getUsername = async () => {
    //console.log("theOtherId", theOtherId)
    const params={id: router.query.sharerId}
    const results = await Moralis.Cloud.run("returnUserDisplayName", params)
    //console.log("user displayname", results)
    setSharerName(results)
  };

  async function MoralisCloudFunction() {
    const params = {id: router.query.sharerId}
    const results = await Moralis.Cloud.run("returnItemsByUserId", params)
    var resultsToSet = []
    var fullItemIdList_0 = []
    //var fullItemIdListTF_0 = []
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
        itemImage: results[i].attributes.itemImage,
        whereBought: whereBoughtData,
        itemCreator: results[i].attributes.ObjId,
        itemId: results[i].id,
        itemShares: results[i].attributes.itemShares,
        itemSharesAvailable: results[i].attributes.itemSharesAvailable,
        itemBasicUnitsNo: results[i].attributes.itemBasicUnitsNo,
        changeChartData: changeChartData,
      })
      fullItemIdList_0.push({itemId: results[i].id, quantity: "", itemShares: results[i].attributes.itemShares, itemRetailPrice: results[i].attributes.itemRetailPrice})
    }
    //console.log("resultsToSet", resultsToSet)
    setFullItemIdList(fullItemIdList_0)
    //setFullItemIdListTF(fullItemIdListTF_0)
    setItemResults(resultsToSet)

    }

  const checkTotalSelectedItems = (copiedFullItemIdList) => {
    var count = 0
    for (const indiItem of copiedFullItemIdList){
      if (indiItem.checked){
        count++
      }
    }
    return count
  }

  const checkTotalSelectedItems2 = (copiedFullItemIdList) => {
    var count = 0
    for (const indiItem of copiedFullItemIdList){
      if (indiItem.quantity > 0){
        count++
      }
    }
    return count
  }

  const combineItemText = (copiedFullItemIdList, totalCount) => {
    //itemResults
    let allText
    if(totalCount>0 && totalCount >1){
      allText = "Hi! I am interested in sharing these items that you have listed: \xa0"
    } else if(totalCount == 1){
      allText = "Hi! I am interested in sharing this item that you have listed: \xa0"
    }

    let count = 1
    for (let i = 0; i< copiedFullItemIdList.length; i++){
      if (copiedFullItemIdList[i].checked){
        allText = allText + "(" +count.toString() + ".)\xa0" + itemResults[i].itemBrand + "\xa0" + itemResults[i].itemName + ",\xa0"
        count++
      }
    }

    if(totalCount>0 && totalCount >1){
      allText = allText + "Total of" + "\xa0" + totalCount.toString() + "\xa0" + "items."
    } else if(totalCount == 1){
      allText = allText + "Total of" + "\xa0" + totalCount.toString() + "\xa0" + "item."
    }
    //console.log("allText:" , allText)

    return allText
  }

  const combineItemText2 = (copiedFullItemIdList, totalCount) => {
    //itemResults
    let allText
    if(totalCount>0 && totalCount >1){
      allText = "Hi! I am interested in sharing these items that you have listed: \xa0"
    } else if(totalCount == 1){
      allText = "Hi! I am interested in sharing this item that you have listed: \xa0"
    }

    let count = 1
    let shareCount = 0
    let finalValue = 0
    for (let i = 0; i< copiedFullItemIdList.length; i++){
      if (copiedFullItemIdList[i].quantity > 0 && copiedFullItemIdList[i].quantity == 1){
        allText = allText + "(" +count.toString() + ".)\xa0" + itemResults[i].itemBrand + "\xa0" + itemResults[i].itemName + ":\xa0" + copiedFullItemIdList[i].quantity + "\xa0share.\xa0"
        count++
        shareCount += Math.floor(copiedFullItemIdList[i].quantity)
        finalValue += Math.floor(copiedFullItemIdList[i].quantity)*(copiedFullItemIdList[i].itemRetailPrice/copiedFullItemIdList[i].itemShares).toFixed(2)
      } else if (copiedFullItemIdList[i].quantity > 1){
        allText = allText + "(" +count.toString() + ".)\xa0" + itemResults[i].itemBrand + "\xa0" + itemResults[i].itemName + ":\xa0" + copiedFullItemIdList[i].quantity + "\xa0shares.\xa0"
        count++
        shareCount += Math.floor(copiedFullItemIdList[i].quantity)
        finalValue += Math.floor(copiedFullItemIdList[i].quantity)*(copiedFullItemIdList[i].itemRetailPrice/copiedFullItemIdList[i].itemShares).toFixed(2)
      }
    }

    if(totalCount>0 && totalCount >1){
      allText = allText + "Total of" + "\xa0" + totalCount.toString() + "\xa0" + "different items and\xa0"
    } else if(totalCount == 1){
      allText = allText + "Total of" + "\xa0" + totalCount.toString() + "\xa0" + "item and\xa0"
    }

    if(shareCount>0 && shareCount >1){
      allText = allText + shareCount.toString() + "\xa0" + "shares.\xa0"
    } else if(shareCount == 1){
      allText = allText + shareCount.toString() + "\xa0" + "share.\xa0"
    }

    allText = allText + "Total value of $" + finalValue.toString() + "."


    //console.log("allText:" , allText)

    return allText
  }


  const contactSharer = () => {
    if(!isAuthenticated){
      handleAlert ("Please Login to Contact Sharer!")
      return
    }
    let copiedFullItemIdList = Object.assign([], fullItemIdList);
    console.log("fullItemIdList", copiedFullItemIdList)
    //let copiedFullItemIdList = JSON.parse(JSON.stringify(fullItemIdList));
    for (const itemInFullItemIdList of copiedFullItemIdList){
      for (const indiCopiedChartData of chartData){
        if (itemInFullItemIdList.itemId == indiCopiedChartData){
          console.log("itemInFullItemIdList.itemId", itemInFullItemIdList.itemId)

          itemInFullItemIdList.checked = !itemInFullItemIdList.checked
        }
      }
    }
    console.log("copiedFullItemIdList (finished algo)", copiedFullItemIdList)
    setFullItemIdList(copiedFullItemIdList)
    setChartData([])

    let totalSelectedItem = checkTotalSelectedItems(copiedFullItemIdList)
    console.log("totalSelectedItem", totalSelectedItem)
    if(totalSelectedItem > 0){

    const combinedText = combineItemText(copiedFullItemIdList, totalSelectedItem)

    console.log("combinedText:" , combinedText)

    router2.push({
        pathname: '/chatBox',
        query: { sharerId: router.query.sharerId,
                 multiItems: true,
                 combinedText: combinedText,
                }
    })


  } else {
    handleAlert ("You Must Select At Least One Item!")
  }
  };

  const contactSharer2 = () => {
    if(!isAuthenticated){
      handleAlert ("Please Login to Contact Sharer!")
      return
    }
    let copiedFullItemIdList = Object.assign([], fullItemIdList);
    console.log("fullItemIdList", copiedFullItemIdList)
    //let copiedFullItemIdList = JSON.parse(JSON.stringify(fullItemIdList));
    for (const itemInFullItemIdList of copiedFullItemIdList){
      for (const indiCopiedChartData of chartData){
        if (itemInFullItemIdList.itemId == indiCopiedChartData.itemId){
          console.log("itemInFullItemIdList.itemId", itemInFullItemIdList.itemId)

          itemInFullItemIdList.quantity = indiCopiedChartData.quantity // need set quantity here?
        }
      }
    }
    console.log("copiedFullItemIdList (finished algo)", copiedFullItemIdList)

    setFullItemIdList(copiedFullItemIdList)
    setChartData([])

    let totalSelectedItem = checkTotalSelectedItems2(copiedFullItemIdList)
    console.log("totalSelectedItem", totalSelectedItem)
    if(totalSelectedItem > 0){

    const combinedText = combineItemText2(copiedFullItemIdList, totalSelectedItem)

    console.log("combinedText:" , combinedText)

    router2.push({
        pathname: '/chatBox',
        query: { sharerId: router.query.sharerId,
                 multiItems: true,
                 combinedText: combinedText,
                }
    })


  } else {
    handleAlert ("You Must Select At Least One Item!")
  }
  };

  return (
      <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>
      <div className="flex flex-col items-center">

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

          {alertMessage == "Please Login to contact Sharers!" ||
           alertMessage == "Please Login to Contact Sharer!"

          &&

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



      {true && (
      <div>


        <div className="text-black pt-[70px] text-center" id="sharer">
          Sharer: {sharerName}
        </div>

        <div className="flex flex-col items-center pb-8" >
          <div className="w-80 text-black pt-3 pb-3 text-center text-xs md:text-sm md:w-auto">
            Check items you are interested in and contact sharer.
          </div>
          <div className="flex flex-col items-center w-80 px-6">
              <button className={styles.loginButton} onClick={contactSharer2} >
                Contact Sharer
              </button>
          </div>
        </div>

        {itemResults && (
        <div>
            <div className="grid grid-cols-2 gap-[3vw] lg:gap-[3vw] lg:grid-cols-2 xl:grid-cols-4 md:px-[40px]">
                {itemResults.map((card, index) => (
                    <ItemCardByUser key={index} {...card} />
                ))}
            </div>
        </div>
        )}





      <div className="flex flex-col items-center pt-8 pb-8" >
        <div className="flex flex-col items-center w-80 px-6">

            <button className={styles.loginButton} onClick={()=>{backToTop()}}>
              Back to Top
            </button>

        </div>
      </div>

      </div>
      )}
    </div>


    {!true &&
    <div className="flex flex-col items-center pt-[80px] pb-8" >
      <div className="flex flex-col items-center w-80 px-6">
        <Link href="/">
          <button className={styles.loginButton}>
            Please Login to see other sharers' Items!
          </button>
        </Link>
      </div>
    </div>}
    <Footer/>
    </>
  )
}

export default withRouter(SharingListByUser)
