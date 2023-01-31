import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useEffect, useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import ItemCardPublic from "../components/ItemCardPublic";



export default function SharingList() {
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

  var controlNum = 0


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


  useEffect(() => {
    async function MoralisCloudFunction() {
      const params = {}
      const results = await Moralis.Cloud.run("returnAllListedItems", params)
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
          itemImage: results[i].attributes.itemImage,
          whereBought: whereBoughtData,
          itemCreator: results[i].attributes.ObjId,
          itemId: results[i].id,
          itemShares: results[i].attributes.itemShares,
          itemSharesAvailable: results[i].attributes.itemSharesAvailable,
        })
      }
      //console.log("resultsToSet", resultsToSet)
      setResultss(resultsToSet)
      }
    MoralisCloudFunction();


    //setState(state => (userObj.attributes));
    //console.log("userObj.attributes.displayName", userObj.attributes.displayName)
  }, []);


  return (
    <div className="flex flex-col items-center">

      <div>{isAuthenticated && (

        <div className="text-black pt-3 pb-3 text-center">
          Items others are Sharing:
        </div>

      )}

      {resultss && (
      <div className="container !px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {resultss.map((card, index) => (
                  <ItemCardPublic key={index} {...card} />
              ))}
          </div>
      </div>

      )}

      </div>
    </div>
  );
}
