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
import ShoppingListDetailsItemCard from "../components/ShoppingListDetailsItemCard";
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


const styles2 = {
  fontFamily: "sans-serif",
  textAlign: "center",
  height: "5000px"
};

function ShoppingListDetails({router}) {
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






  useEffect(() => {
      setTimeout(() => {
      MoralisCloudFunction();
      }, 500);
  }, []);


  async function MoralisCloudFunction() {
      const params = {shoppingListId: router.query.shoppingListId}
      const results = await Moralis.Cloud.run("returnShoppingListItemsDetails", params)
      var ifSharee = false
      var shareeData
      console.log(results)

      if (results.length == 0) {
        return
      }
      var resultsToSet = []
      //var fullItemIdList_0 = []
      //var fullItemIdListTF_0 = []
      for (let i = 0; i < results.itemsInlist.length; i++){
        var whereBoughtData = null
        if (results.itemsInlist[i].attributes.whereBought){
          whereBoughtData = results.itemsInlist[i].attributes.whereBought
        }

        resultsToSet.push({
          indexNo: i+1,
          itemName: results.itemsInlist[i].attributes.itemName,
          itemBrand: results.itemsInlist[i].attributes.itemBrand,
          itemRetailPrice: results.itemsInlist[i].attributes.itemRetailPrice,
          itemCostAfterTax: results.itemsInlist[i].attributes.itemCostAfterTax,
          itemImage: results.itemsInlist[i].attributes.itemImage,
          whereBought: whereBoughtData,
          itemCreator: results.itemsInlist[i].attributes.ObjId,
          itemId: results.itemsInlist[i].id,
          itemBasicUnitsNo: results.itemsInlist[i].attributes.itemBasicUnitsNo,
          ObjId: results.itemsInlist[i].attributes.ObjId,
        })

      }
      //console.log("resultsToSet", resultsToSet)
      //setFullItemIdList(fullItemIdList_0)
      //setFullItemIdListTF(fullItemIdListTF_0)
      setItemResults(resultsToSet)
      setTotalNoItems(resultsToSet.length)
      return resultsToSet
    }


  return (
    <div className={`${screenCSS}`}>
      <Head>
        <title>Shopping Trip | Split Sharing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>





        {true ?
        <div className="flex flex-col items-center">


          <div className="pt-2">
            <button className={styles.connectButton} type="button"
            onClick={()=>{
              if (!checkProfile()){
                console.log("no phone no.")
                return}
              console.log("thisUserId on click", thisUserId)
              console.log("shoppingListCreator on click", shoppingListCreator)
              var thisShoppingListCreator = shoppingListCreator
              if(thisUserId != shoppingListCreator){

              router.push({
                  pathname: '/chatBox',
                  query: { sharerId: thisShoppingListCreator,
                          }
              })
            }else if(thisUserId == shoppingListCreator){
              handleAlertMessage("You are the creator of this shopping list!")
              //alert("You are the creator of this item!")
            }


            }}
            >
              Contact Shopping List Creator
            </button>
          </div>

          <div className="pt-[30px] md:pt-[50pt] pb-[10px] md:pb-[20pt] flex flex-col items-center">
            All Items in this List:
          </div>

          {itemResults && (
          <div>
              <div className="grid grid-cols-1 gap-[3vw] lg:gap-[3vw] lg:grid-cols-2 xl:grid-cols-4 md:px-[40px]">
                  {itemResults.map((card, index) => (
                      <ShoppingListDetailsItemCard key={index} {...card} />
                  ))}
              </div>
          </div>
          )}


          <div className="flex flex-col items-center pt-[150px] pb-8" >
            <div className="flex flex-col items-center w-80 px-6">

                <button className={styles.loginButton}
                onClick={() => {

                    Router.push({
                      pathname: '/shoppingListDetails',
                      query: { shoppingListId: router.query.shoppingListId,
                              }
                    })

                }}
                >
                  Back to Top
                </button>

            </div>

            <div className="flex flex-col items-center w-80 px-6 pt-[30px]">

                <button className={styles.loginButton}
                onClick={() => {

                    Router.push({
                      pathname: '/openShoppingList',

                    })

                }}
                >
                  Back to Open Shopping Lists
                </button>

            </div>
          </div>
      </div>
      :
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
          <Link href="/">
            <button className={styles.loginButton}>
              Please Login to Start Listing and Sharing!
            </button>
          </Link>
        </div>
      </div>
     }

    </div>
  )
}

export default withRouter(ShoppingListDetails)
//render(<ShoppingTrip />, document.getElementById("root"));
