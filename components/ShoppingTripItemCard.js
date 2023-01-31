import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";
import Head from "next/head"
import React, { useState, useCallback, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Popup from 'reactjs-popup';

function ShoppingTripItemCard({alertMessageData, shareeData, ifSharee, changeSelectData, tripId, itemId, itemName, itemBrand, indexNo, itemCostAfterTax, itemImage, whereBought, itemRetailPrice, itemCreator, itemShares, itemSharesAvailable, itemSharesTaking, takeUpAll, itemCode, itemSharees, itemBasicUnitsNo}) {
    const {isAuthenticated, Moralis} = useMoralis();
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const [thisUserId, setThisUserId] = useState('');
    const [checked, setChecked] = useState(false);
    const router = useRouter()

    const [inputValue, setInputValue] = useState('');
    const [selectedValues, setselectedValues] = useState({ selected: [] });
    const [selection, setSelection] = useState(undefined);
    const [editPanel, setEditPanel] = useState(false);
    const [takeUpAllLocal, setTakeUpAllLocal] = useState(true);
    const [deleteItem, setDeleteItem] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [joinToShareQuantity, setJoinToShareQuantity] = useState(undefined);
    const [checkProfileValue, setCheckProfileValue] = useState(false);
    const [localAlertMessageData, setLocalAlertMessageData] = useState('');



    const popupTrigger1b = "popupTrigger1"+itemId
    const popupTrigger2b = "popupTrigger2"+itemId
    const popupTrigger3b = "popupTrigger3"+itemId

    //for local popup module
    const [alertMessage, setAlertMessage] = useState('');
    //

    const takeUpAllChecked = () => setTakeUpAllLocal(value => !value);

    const deleteItemChecked = () => setDeleteItem(value => !value);

    const handleInputChange = (value) => {
      setInputValue(value);
      //console.log("handleInputChange value join", value)
    };


    const handleClosePopup1 = () => {
      //console.log("handleClosePopup")
      document.getElementById(popupTrigger1b).click();
    };

    const handleClosePopup2 = () => {
      //console.log("handleClosePopup")
      document.getElementById(popupTrigger2b).click();
    };

    const handleClosePopup3 = () => {
      //console.log("handleClosePopup")
      document.getElementById(popupTrigger3b).click();
    };

    const checkProfile = ()=>{
      if(!isAuthenticated){
        ()=>{onOpen}
        setLocalAlertMessageData("Please Login to join trip!")
        setCheckProfileValue(false)
        return false
      }
      const theUser = Moralis.User.current()
      console.log("theUser.attributes.phoneNumber.length:", theUser.attributes.phoneNumber.length)

      if (!theUser.attributes.phoneNumber || theUser.attributes.phoneNumber.length < 4){
        ()=>{onOpen}
        setLocalAlertMessageData("Your User Profile is not completed yet! Please complete first!")
        setCheckProfileValue(false)
        return false
      } else {
        setCheckProfileValue(true)
        return true
      }
    }

    const handleDelete = async () => {
      if (!deleteItem){
        return
      }

      const params = {
        tripId: tripId,
        itemId: itemId,
        joinToShareUser: thisUserId,
        delete: true,
      }

      const queryShoppingTripItemsData1 = new Moralis.Query("shoppingTripItemsData1");
      queryShoppingTripItemsData1.equalTo("objectId", params.itemId);
      queryShoppingTripItemsData1.equalTo("public", true);
      await queryShoppingTripItemsData1.find().then(
      (results) => {
        console.log("my local results", results)
        results[0].save({public: false}).then(
          async (savedResults) => {

          const returnedCheckDeleted = await Moralis.Cloud.run("checkDeletedShoppingTripItem", {itemId: itemId})
          console.log("returnedCheckDeleted", returnedCheckDeleted)

          },
          (error) => {

          }
        );

        //call async function includes: await Moralis.Cloud.run("checkDeletedShoppingTripItem", params)
        },
        (error) => {

        }
      );
      changeSelectData({notPublic: itemId})

    };

    const afterDeletedCloudCheck = async () => {

      //use a cloud function here to only restrict writing to the "sharee's Info"
      const params = {
        tripId: tripId,
        itemId: itemId,
        joinToShareUser: thisUserId,
        shareTaking: joinToShareQuantity,
        takeUpAll: takeUpAllLocal,
      }
      //console.log("params", params)
      //return
      const results = await Moralis.Cloud.run("joinToShareShoppingTripItem", params)
      changeSelectData(true)

    };

    const handleToTakeShare = async () => {

      //use a cloud function here to only restrict writing to the "sharee's Info"
      const params = {
        tripId: tripId,
        itemId: itemId,
        joinToShareUser: thisUserId,
        shareTaking: joinToShareQuantity,
        takeUpAll: takeUpAllLocal,
      }
      //console.log("params", params)
      //return
      const results = await Moralis.Cloud.run("joinToShareShoppingTripItem", params)
      changeSelectData(true)

    };

    const handleUpdate = async () => {

      //use a cloud function here to only restrict writing to the "sharee's Info"
      const params = {
        tripId: tripId,
        itemId: itemId,
        joinToShareUser: thisUserId,
        shareTaking: joinToShareQuantity,
        takeUpAll: takeUpAllLocal,
      }
      //console.log("params", params)
      //return
      console.log("params", params)
      const results = await Moralis.Cloud.run("updateJoinToShareShoppingTripItem", params)
      console.log("results", results)
      changeSelectData(true)
    };

    const handleUnjoin = async () => {

      //use a cloud function here to only restrict writing to the "sharee's Info"
      const params = {
        tripId: tripId,
        itemId: itemId,
        joinToShareUser: thisUserId,
        unjoin: true,
      }
      //console.log("params", params)
      //return

      const results = await Moralis.Cloud.run("unjoinShoppingTripItem", params)
      console.log("results", results)
      changeSelectData(true)
    };


    useCallback(
      (node) => {
        console.log(node);
      },
      [inputValue]
    );

    const handleOnChange = (e) => {

      const newOption = { label: inputValue, inputValue };

      inputValue !== '' && setSelection([...selection, newOption]);

      setInputValue('');

      setselectedValues(selection);


      console.log("setJoinToShareQuantity e.value: ", e.value)
      setJoinToShareQuantity(e.value)
      //changeSelectData({itemId:itemId, quantity: e.value})

    };

    /*
    useEffect(() => {
      changeChartData(itemId);
    }, [checked]);
    */

    const resetSelection = () => {
      let theSelection=[]

      if(!ifSharee && itemSharesAvailable>0){

        for(const i = 1; i < itemSharesAvailable+1; i++){
          theSelection.push({ value: i.toString(), label: i.toString() })

        }
      }

      if (ifSharee){
        console.log("shareeData.shareTaking", shareeData.shareTaking)
        const countCeiling = Number(itemSharesAvailable)+1+Number(shareeData.shareTaking)
        console.log("countCeiling", countCeiling)
        for(const i = 1; i < countCeiling; i++){
          if (shareeData.shareTaking != i){
          theSelection.push({ value: i.toString(), label: i.toString() })}
        }
      }
      setSelection(theSelection)
    }

    useEffect(() => {
      checkProfile()
      console.log("useEffect itemSharesAvailable", itemSharesAvailable)
      resetSelection()

      //const serverUrl = "https://amgy7tfiuiie.usemoralis.com:2053/server";
      //const appId = "d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO";
      //Moralis.start({ serverUrl, appId });
      if(!isAuthenticated){
        setThisUserId(null)
        return
      }
      const user = Moralis.User.current()
      //itemCreator
      console.log("itemCreator", itemCreator)
      console.log("this card user id", user.id)
      setThisUserId(user.id)
    }, [itemSharesAvailable]);

    const toggleChange = () => {
      setChecked(value => !value);
      changeChartData(itemId)
    }

    const cardColor = itemSharesAvailable>0 ? " bg-[#edeef2]" : " bg-[#808080]"
    const borderColor = itemSharesAvailable>0 ? " border-[#edeef2]" : " border-[#808080]"

    const cardStyle1DefaultData = "rounded-xl w-[300px] h-auto lg:w-[300px] lg:h-auto flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300"
    const cardStyle1 = cardStyle1DefaultData + cardColor

    const cardStyle2DefaultData = "flex flex-col items-center bg-white border-4 rounded-xl shadow-inner pl-[120px] lg:pl-[120px]"
    const cardStyle2 = cardStyle2DefaultData + borderColor

    return (
      <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

          <div className={`${cardStyle1}`}>


            <div className="w-[300px] h-auto lg:w-[300px] lg:h-auto rounded-xl flex flex-col item-center relative">
                <div className={`${cardStyle2}`}>
                  <img layout="responsive" src={itemImage} className="w-[30vw] h-[23vw] lg:w-[292px] lg:h-[160px] object-contain pt-[3px]"/>
                  {itemBrand &&
                  <p className="px-[2px] bg-white border-[1px] border-[#f2f2f2] rounded text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black font-bold absolute top-[19vw] lg:top-[138px] left-[5px] lg:left-[6px]">{itemBrand}</p>}
                </div>

                <div className="pl-[7px] flex flex-col items-left">
                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[12px] md:text-[12px] lg:text-[13px] xl:text-[15px]">{itemName && itemName}</p>

                  </div>



                    <div className="pt-[15px]">
                        <div className="text-gray-700 text-[11px] lg:text-[12px]">
                          Entire Item Expected Price:
                          <span className="text-black font-bold text-[9px] lg:text-[13px]">{itemRetailPrice && " $" + itemRetailPrice} </span>
                        </div>
                    </div>


                  <div>
                      <div className="text-gray-700 text-[11px] lg:text-[12px]">
                        Splitting into:
                        <span className="text-[#009dcf] font-bold text-[9px] lg:text-[13px] text-[red]">{ " " + itemShares} {itemShares>1 ? " shares": "share"}</span>
                      </div>
                  </div>

                  <div className="flex flex-col items-start">
                  <div>
                      <div className="text-gray-700 text-[11px] lg:text-[12px]">
                        Price Per Share:
                        <span className="text-black font-bold text-[12px] lg:text-[16px] text-[red]"> ${(itemRetailPrice/itemShares).toFixed(2)} </span>
                      </div>
                  </div>


                  <div>
                      <div className="text-gray-700 text-[11px] lg:text-[12px]">
                        Available share(s):
                        <span className="font-bold text-[12px] lg:text-[16px] text-[#009dcf]"> {itemSharesAvailable ? itemSharesAvailable : "N/A"}</span>
                      </div>
                  </div>
                  <div className="h-[60px]">
                  {thisUserId == itemCreator ?
                  <div className='flex flex-col items-center pt-[10px]'>
                    <div className="font-bold block text-gray-700 text-[11px] lg:text-[11px] font-regular lg:pr-[5px]">
                    You are the Creator of this Item.
                    {itemSharesAvailable==0 && !ifSharee &&
                      <div className="font-bold block text-gray-700 text-[11px] lg:text-[11px] font-regular lg:pr-[5px]">
                        This item has already been fully taken.
                      </div>
                    }
                    </div>
                    <div className="absolute right-[5px] bottom-[10px]">
                    <Popup
                      trigger={open => (<button className={styles.ButtonSharingShopping3} id={popupTrigger3b}> {!open ? 'Edit' : 'Cancel'} </button>)}
                      position="bottom right"
                      contentStyle = {{
                        margin: 'auto',
                        background: 'rgb(255, 255, 255)',
                        width: '286px',
                        padding: '5px'
                      }}
                    >
                      {close => (
                      <div className="flex flex-col items-center py-[10px]">


                        <div className="flex items-center justify-center w-full py-[20px]">

                          <label htmlFor="toggleF" className="flex items-center cursor-pointer">

                            <div className="relative">

                              <input type="checkbox" id="toggleF" className="sr-only" checked={deleteItem} onChange={deleteItemChecked}/>

                              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                            </div>

                            <div className="ml-3 text-gray-700 font-medium text-[12px]">
                              Delete this Item
                            </div>
                          </label>

                        </div>

                        <div className="flex flex-row items-center">
                        {deleteItem &&
                        <div className="w-[138px] py-[5px] px-[5px]">
                          <button type="button" className={styles.ButtonSharingShopping}
                          onClick={() => {
                            handleClosePopup3()
                            handleDelete()
                          }}
                          >
                            Confirm
                          </button>
                        </div>
                        }

                        </div>
                      </div>
                      )}
                    </Popup>
                    </div>


                  </div>

                  : (itemSharesAvailable>0 && !ifSharee) ?
                  <div className="flex flex-row items-center w-full">

                    {true &&
                      <div className='flex flex-col items-center pt-[10px]'>
                          <Popup
                            trigger={open => (<button className={styles.ButtonSharingShopping2} id={popupTrigger2b}> {!open ? 'Join to Split this Item' : 'Cancel'} </button>)}
                            position="bottom center"
                            contentStyle = {{
                              margin: 'auto',
                              background: 'rgb(255, 255, 255)',
                              width: '286px',
                              padding: '5px'
                            }}
                          >


                            {close => (

                            <div className="flex flex-col items-center py-[10px]">
                              {checkProfileValue ?
                                <div>
                                  <div className="rounded-lg flex flex-col items-center py-[5px]">
                                    <div className="pl-[5px] font-bold block text-gray-700 text-[12px] lg:text-xs font-regular lg:pr-[5px] pb-[5px]">
                                      Choose No. of Shares to Take Up:
                                    </div>

                                    <CreatableSelect
                                      className="pl-[5px] text-[9px] lg:text-[12px]"
                                      options={selection}
                                      onChange={handleOnChange}
                                      isSearchable={false}
                                      onInputChange={handleInputChange}
                                      inputValue={inputValue}
                                      value={selectedValues.selected}
                                      controlShouldRenderValue={true}
                                    />
                                  </div>

                                  <div className="flex items-center justify-center w-full py-[20px]">

                                    <label htmlFor="toggleG" className="flex items-center cursor-pointer">

                                      <div className="relative">

                                        <input type="checkbox" id="toggleG" className="sr-only" checked={takeUpAllLocal} onChange={takeUpAllChecked}/>

                                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                      </div>

                                      <div className="ml-3 text-gray-700 font-medium text-[12px]">
                                        *Willing to take up <span className="font-bold">all share(s)</span> <br />if Item Creator decided not to share.
                                      </div>
                                    </label>

                                  </div>

                                  <div className="w-[286px] py-[5px] px-[5px]">
                                    <button type="button" className={styles.loginButton}
                                    onClick={() => {
                                      handleClosePopup2()
                                      handleToTakeShare()
                                    }}
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                                :
                                <div className='items-center flex flex-col'>
                                  <div className='text-center'>
                                  {localAlertMessageData}
                                  </div>
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
                                </div>
                            }
                            </div>
                          )}

                          </Popup>
                      </div>



                    }
                  </div>
                  : (itemSharesAvailable >= 0 && ifSharee) ?

                    <div className='flex flex-col items-center pt-[10px]'>
                      <div className="font-bold block text-gray-700 text-[11px] lg:text-[11px] font-regular lg:pr-[5px]">
                        {itemSharesAvailable == 0 &&
                        <div>
                          This item has already been fully taken.
                        </div>
                        }
                        You are one of the sharees!
                      </div>
                      <div className="absolute right-[5px]">
                      <Popup
                        trigger={open => (<button className={styles.ButtonSharingShopping3} id={popupTrigger1b}> {!open ? 'Edit' : 'Cancel'} </button>)}
                        position="bottom right"
                        contentStyle = {{
                          margin: 'auto',
                          background: 'rgb(255, 255, 255)',
                          width: '286px',
                          padding: '5px'
                        }}
                      >
                        {close => (
                        <div className="flex flex-col items-center py-[10px]">
                          <div className="rounded-lg flex flex-col items-center py-[5px]">
                            <div className="pl-[5px] font-bold block text-gray-700 text-[12px] lg:text-xs font-regular lg:pr-[5px] pb-[15px]">
                              No. of Shares Taking Currently: <span className='text-[13px]'>{shareeData.shareTaking}</span>
                            </div>
                            <div className="pl-[5px] font-bold block text-gray-700 text-[12px] lg:text-xs font-regular lg:pr-[5px] pb-[5px]">
                              Edit No. of Shares to Take Up:
                            </div>

                            <CreatableSelect
                              className="pl-[5px] text-[9px] lg:text-[12px]"
                              options={selection}
                              onChange={handleOnChange}
                              isSearchable={false}
                              onInputChange={handleInputChange}
                              inputValue={inputValue}
                              value={selectedValues.selected}
                              controlShouldRenderValue={true}
                            />
                          </div>

                          <div className="flex items-center justify-center w-full py-[20px]">

                            <label htmlFor="toggleE" className="flex items-center cursor-pointer">

                              <div className="relative">

                                <input type="checkbox" id="toggleE" className="sr-only" checked={takeUpAllLocal} onChange={takeUpAllChecked}/>

                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                              </div>

                              <div className="ml-3 text-gray-700 font-medium text-[12px]">
                                *Willing to take up <span className="font-bold">all share(s)</span> <br />if Item Creator decided not to share. <br /> i.e. Taking a new Entire Item
                              </div>
                            </label>

                          </div>

                          <div className="flex flex-row items-center">
                          <div className="w-[138px] py-[5px] px-[5px]">
                            <button type="button" className={styles.ButtonSharingShopping}
                            onClick={() => {
                              handleClosePopup1()
                              handleUpdate()
                            }}
                            >
                              Update
                            </button>
                          </div>
                          <div className="w-[138px] py-[5px] px-[5px]">
                            <button type="button" className={styles.loginButton}
                            onClick={() => {
                              handleClosePopup1()
                              handleUnjoin()
                            }}
                            >
                              Un-Join
                            </button>
                          </div>
                          </div>
                        </div>
                        )}
                      </Popup>
                      </div>
                    </div>

                  : (itemSharesAvailable == 0 && !ifSharee) &&
                  <div className="font-bold block text-gray-700 text-[11px] lg:text-[11px] font-regular lg:pr-[5px] pt-[20px]">
                    This item has already been fully taken.
                  </div>
                  }
                  </div>
                  </div>




                </div>



            </div>
          </div>




    </>
    )
}

export default ShoppingTripItemCard
