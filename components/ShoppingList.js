import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useEffect, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import ShoppingListItemCard from "../components/ShoppingListItemCard";
import EditItemInShoppingList from "../components/EditItemInShoppingList";



export default function ShoppingList({refreshUnlisted, toRefreshListed}) {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();

  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  //const userObj = Moralis.User.current();
  const [userObjId, setUserObjId] = useState();
  const [startQ, setStartQ] = useState(true);
  const [resultss, setResultss] = useState(undefined);
  const [editModalData, setEditModalData] = useState('');
  const [entireListExpectedCost, setEntireListExpectedCost] = useState(undefined);
  const [allowBroadcastChecked, setAllowBroadcastChecked] = useState(false);


  const allowBroadCastToggleChecked = async () => {
    console.log("current allowBroadcastChecked", allowBroadcastChecked)
    const toSetAllowBroadcastChecked = !allowBroadcastChecked
    setAllowBroadcastChecked(value => !value)
    const userObj = Moralis.User.current();

    const params = {
      shoppingListBroadCasted: toSetAllowBroadcastChecked
    }

    userObj
      .save(params)
  };

  const changeEditModal = (arg) => {
    setEditModalData(arg)
    };

  const handleEditModal = (arg) => {
      setEditModalData('')
      basicQuery()
      refreshUnlisted()
  };

  const ifHaveItemInShoppingList = async () =>{
    const user = Moralis.User.current();
        if (!user){return}
        const params = {userId: user.id}
        const results = await Moralis.Cloud.run("ifHaveItemInShoppingList", params)
        if (results) {
          setShoppingListPublish(true)
    }
  }


  const handleEditModalClose = () => {
    console.log("handleEditModalClose")
    setEditModalData('')
    basicQuery()
  }



  const { fetch } = useMoralisQuery(
    "testItemData2",
    (query) => query.equalTo("ObjId", userObjId),
    [userObjId],
    { autoFetch: false }
  );

  useEffect(() => {
    setTimeout(() => {
      basicQuery();
    }, 500);
  }, []);

  const basicQuery = async () => {
    const user = Moralis.User.current();
    const ShoppingListData1 = Moralis.Object.extend("shoppingListData1");
    const query = new Moralis.Query(ShoppingListData1);
    if (user){
      if (user.attributes.shoppingListBroadCasted){
        console.log("user.shoppingListBroadCasted", user.attributes.shoppingListBroadCasted)
        setAllowBroadcastChecked(user.attributes.shoppingListBroadCasted)
      } else {
        console.log("no data for shoppingListBroadCasted")
        setAllowBroadcastChecked(false)
      }
      query.equalTo("ObjId", user.id);
      query.equalTo("archived", false);
      query.equalTo("public", true);
      var results
      results = await query.find()
      console.log("results", results)
      var resultsToSet = []
      var entireListExpectedCost0 =0
      for (let i = 0; i < results.length; i++){
        var whereBoughtData = null
        if (results[i].attributes.whereBought){
          whereBoughtData = results[i].attributes.whereBought
          console.log("if wherebought", whereBoughtData)
        }
        resultsToSet.push({
          indexNo: i+1,
          itemName: results[i].attributes.itemName,
          itemBrand: results[i].attributes.itemBrand,
          itemRetailPrice: results[i].attributes.itemRetailPrice,
          itemCostAfterTax: results[i].attributes.itemCostAfterTax,
          itemImage: results[i].attributes.itemImage,
          whereBought: whereBoughtData,
          itemShares: results[i].attributes.itemShares,
          itemSharesAvailable: results[i].attributes.itemSharesAvailable,
          itemObjId: results[i].id,
          changeEditModal: changeEditModal,
          itemBasicUnitsNo: results[i].attributes.itemBasicUnitsNo,
        })
        entireListExpectedCost0 += Number(results[i].attributes.itemRetailPrice)
      }
      //console.log("resultsToSet", resultsToSet)
      setResultss(resultsToSet)
      setEntireListExpectedCost(entireListExpectedCost0)
      //setImageUrl1(results[0].itemImage)
      //console.log("results[0]", results[0] && results[0].attributes.itemImage)
      setImageUrl1(results[0] && results[0].attributes.itemImage)
      if (results[1]){
      setImageUrl2(results[1].attributes.itemImage)}
    }
    //alert("Successfully retrieved " + results.length + " testItemData2.");

    /*
    const user = Moralis.User.current();
    console.log("user.id", user.id)
    setUserObjId(user.id)
    setTimeout(async () => {
      console.log("start fetch")
      const results = await fetch();
      alert("Successfully retrieved " + results.length + " testItemData2.");
    }, 3000);
    */
  };


  return (
    <div className="flex flex-col items-center">

      {editModalData.length > 0 && (
        <div className="fixed pin z-50 overflow-auto bg-smoke-light top-0 w-full h-full pt-[40px]">
          <div className="rounded relative p-8 bg-white max-w-sm md:max-w-md m-auto top-4 md:top-8 flex-col flex">
            <div className="h-auto z-50 flex flex-col items-center bg-white pt-6 pb-6 mx-200 border-2 border-[#F1592A] rounded">
              <div className="pt-2 absolute right-10 top-10">
                <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={handleEditModalClose}
                >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
              </div>
              <EditItemInShoppingList {...{editModalData: editModalData, handleEditModal: handleEditModal}}/>
            </div>
          </div>
        </div>
      )}

      {resultss && resultss.length > 4 ?
        <div className ="flex flex-col items-center bg-gray-700 w-[95vw] md:w-[600px] p-[10px] rounded-xl">


          <div className="flex items-center justify-center w-full">

            <label htmlFor="toggleB" className="flex items-center flex-col cursor-pointer">

              <div className="relative">

                <input type="checkbox" id="toggleB" className="sr-only" checked={allowBroadcastChecked} onChange={allowBroadCastToggleChecked}/>

                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>

                <div className="dot absolute left-1 top-1 bg-gray-600 w-6 h-6 rounded-full transition"></div>
              </div>

              <div className="pt-[5px] ml-3 text-[18px] text-white font-medium">
                Broadcast Shopping List
              </div>

            </label>

          </div>

          <div className="ml-3 text-[15px] text-white font-medium flex flex-col items-center">
            <span>(Other users will be notified if they are nearby you.</span>
            <span>This Feature would benefit mostly for users in</span>
            <span className ="text-[red] text-[18px]"> LA area </span>
            <span> at this moment.)</span>
          </div>

          <div className="py-[10px] ml-3 text-[15px] text-white font-medium">
            Your broadcasted Shopping List will be automatically expired in 7 days
          </div>

          {entireListExpectedCost != undefined && entireListExpectedCost != 0 &&
            <div className="text-white pt-3 pb-3 text-center">
              Expected Cost for Entire List <br/>(Tax Excluded): <span className ="text-[20px] text-white font-bold"> ${entireListExpectedCost.toFixed(2)}</span>
            </div>
          }
        </div>

        :

        <div className ="flex flex-col items-center bg-gray-700 w-[95vw] md:w-[600px] p-[10px] rounded-xl">

          <div className="pt-[5px] ml-3 text-[18px] text-white font-medium pb-[5px] flex flex-col items-center">
            {resultss && resultss.length != 0 && resultss.length < 5 ?
            <span>You need to have at least 5 items to Broadcast.<br /></span>
            :
            <div className = "flex flex-col items-center">
            <span> There is no item in your shopping list. <br />
            </span>
            <span> You also need to have at least 5 items to Broadcast. <br />
            </span>
            </div>
            }
            <span className="text-[red]">You cannot Broadcast now.</span>
          </div>


          <div className="flex items-center justify-center w-full">

            <label htmlFor="toggleB" className="flex items-center flex-col cursor-pointer">

              <div className="relative">

                <input type="checkbox" id="toggleB" className="sr-only" checked={false}/>

                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>

                <div className="dot absolute left-1 top-1 bg-gray-600 w-6 h-6 rounded-full transition"></div>
              </div>

              <div className="pt-[5px] ml-3 text-[18px] text-white font-medium">
                Broadcast Shopping List
              </div>

            </label>

          </div>

          <div className="ml-3 text-[15px] text-white font-medium flex flex-col items-center">
            <span>(Other users will be notified if they are nearby you.</span>
            <span>This feature would benefit mostly for users in</span>
            <span className ="text-[red] text-[18px]"> LA area </span>
            <span> at this moment.)</span>
          </div>

          <div className="py-[10px] ml-3 text-[15px] text-white font-medium">
            Your broadcasted Shopping List will be automatically expired in 7 days
          </div>

          {entireListExpectedCost != undefined && entireListExpectedCost != 0 &&
            <div className="text-white pt-3 pb-3 text-center">
              Expected Cost for Entire List <br/>(Tax Excluded): <span className ="text-[20px] text-white font-bold"> ${entireListExpectedCost.toFixed(2)}</span>
            </div>
          }
        </div>
      }



      <div className="flex flex-col items-center">{isAuthenticated && (

        <div className="text-black pt-3 pb-3 text-center">
          Your Shopping List Items:
        </div>

      )}




      {(resultss && editModalData.length == 0) && (
        <div>
          <div>
              <div className="w-[100vw] justify-items-center grid grid-cols-2 gap-[0.5vw] md:w-auto md:gap-[2vw] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {resultss.map((card, index) => (
                      <ShoppingListItemCard key={index} {...card} />
                  ))}
              </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
