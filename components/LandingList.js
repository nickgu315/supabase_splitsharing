import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useEffect, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import ItemCardPublic from "../components/ItemCardPublic";
import ItemCardPublicNew from "../components/ItemCardPublicNew";
import Head from "next/head"
import React from 'react';
import Popup from 'reactjs-popup';
import { useRouter } from 'next/router'



export default function LandingList() {
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



  const { fetch } = useMoralisQuery(
    "testItemData2",
    (query) => query.equalTo("ObjId", userObjId),
    [userObjId],
    { autoFetch: false }
  );



  async function return4Results() {
    const params = {}
    const results = await Moralis.Cloud.run("returnAllListedItems", params)
    var resultsToSet = []
    for (let i = 0; i < 4; i++){
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
    }


  useEffect(() => {
    setTimeout(() => {
      return4Results();
    }, 1000);
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
          <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center">


            <div className="text-[15px] text-center"> Alert </div>

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

            {alertMessage == "Please Login to contact Sharers!" &&

            <div>
              <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
                <button
                  className={styles.loginButton}
                  onClick={() => {
                    router.push({
                                    pathname: '/',
                                });
                    setOpen(false)
                    setAlertMessage('')
                  }}
                >
                  Login Now
                </button>
              </div>

              <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
                <button
                  className={styles.loginButton}
                  onClick={() => {
                    router.push({
                                    pathname: '/sharingListPublic',
                                });
                    setOpen(false)
                    setAlertMessage('')
                  }}
                >
                  See More Items
                </button>
              </div>
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









    <div>

      <div>

      {resultss && (

      <div>
          <div className="grid grid-cols-2 gap-[3vw] lg:gap-[3vw] lg:grid-cols-2 xl:grid-cols-4 md:px-[40px]">
              {resultss.map((card, index) => (
                  <ItemCardPublicNew key={index} {...card} />
              ))}
          </div>
      </div>

      )}

      </div>
    </div>
    </div>
  );
}
