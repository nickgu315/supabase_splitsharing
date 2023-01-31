import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useEffect, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import ItemCard from "../components/ItemCard";
import EditItem from "../components/EditItem";



export default function SharingListUnlisted({refreshListed, toRefreshUnlisted}) {
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

  const changeEditModal = (arg) => {
    setEditModalData(arg)
    };

  var controlNum = 0


  const basicQuery0 = () => {
    setStartQ(false)
    if (controlNum==0){
      controlNum++
    basicQuery()}

  }

  const handleEditModalClose = () => {
    setEditModalData('')
    basicQuery0()
  }



  const handleEditModal = (arg) => {
    setEditModalData('')
    basicQuery0()
    refreshListed()
    };



  const { fetch } = useMoralisQuery(
    "testItemData2",
    (query) => query.equalTo("ObjId", userObjId),
    [userObjId],
    { autoFetch: false }
  );

  const basicQuery = async () => {
    const user = Moralis.User.current();
    const TestItemData2 = Moralis.Object.extend("testItemData2");
    const query = new Moralis.Query(TestItemData2);
    if (user){
      query.equalTo("ObjId", user.id);
      query.equalTo("archived", false);
      query.equalTo("public", false);
      var results
      if (controlNum==1){
      results = await query.find();}
      console.log("results", results)
      var resultsToSet = []
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
      }
      //console.log("resultsToSet", resultsToSet)
      setResultss(resultsToSet)
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
      {startQ && basicQuery0()}

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
              <EditItem {...{editModalData: editModalData, handleEditModal: handleEditModal}}/>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">{isAuthenticated && (

        <div className="text-black pt-3 pb-3 text-center">
          Your Unlisted Items:
        </div>

      )}


      {(resultss && editModalData.length == 0) && (
        <div>
          <div>
              <div className="w-[100vw] justify-items-center grid grid-cols-2 gap-[0.5vw] md:w-auto md:gap-[2vw] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {resultss.map((card, index) => (
                      <ItemCard key={index} {...card} />
                  ))}
              </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
