import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useState, useEffect } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import { withRouter } from 'next/router';
import Router from "next/router";
import { useNewMoralisObject } from "react-moralis";




function EditItem({editModalData, handleEditModal}) {
  const {isAuthenticated, Moralis} = useMoralis();
  const { save } = useNewMoralisObject("testItemData2");

  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemRetailPrice, setItemRetailPrice] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [itemBasicUnitsNo, setItemBasicUnitsNo] = useState('');
  const [whereBought, setWhereBought] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemOldImage, setItemOldImage] = useState(undefined);
  const [itemOldReceipt, setItemOldReceipt] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [itemShares, setItemShares] = useState(2);
  const [itemSharesAvailable, setItemSharesAvailable] = useState(1);
  const [toChangeItem, setToChangeItem] = useState(undefined);
  const [isPublic, setIsPublic] = useState(undefined);




  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');

  const itemBasicUnitText = "Item's Total Number of Basic Units:"

  useEffect(() => {
    console.log("item data: ", editModalData)
    const singleUserItemQ = async () => {
      const user = Moralis.User.current();
      const TestItemData2 = Moralis.Object.extend("testItemData2");
      const query = new Moralis.Query(TestItemData2);
        if (user){
          query.equalTo("objectId", editModalData);
          const results = await query.find();
          setToChangeItem(results)
          console.log("results", results[0].attributes.itemName)

          setItemName(results[0].attributes.itemName)
          setItemBrand(results[0].attributes.itemBrand)
          setItemRetailPrice(results[0].attributes.itemRetailPrice)
          setItemCostBeforeTax(results[0].attributes.itemCostBeforeTax)
          setItemCostAfterTax(results[0].attributes.itemCostAfterTax)
          setWhereBought(results[0].attributes.whereBought)
          setItemOldImage(results[0].attributes.itemImage)
          setItemOldReceipt(results[0].attributes.itemReceipt)
          setItemReceipt(results[0].attributes.itemReceipt)
          setItemShares(results[0].attributes.itemShares)
          setItemSharesAvailable(results[0].attributes.itemSharesAvailable)
          setItemBasicUnitsNo(results[0].attributes.itemBasicUnitsNo)
          setIsPublic(results[0].attributes.public)
        }
    }
    singleUserItemQ()

  }, []);


  const displayAlert = (message) => {
    alert(message)
  }

  const handleModalClose = async () => {
    handleEditModal()
  }


  const handleUnlistItem = async () => {
    const TestItemData2 = Moralis.Object.extend("testItemData2");
    const query = new Moralis.Query(TestItemData2);

    query.equalTo("objectId", editModalData);
    const toSaveItem = await query.find();
    console.log("toSaveItem:", toSaveItem)

    const params = {

      public: false,
      archived: false,
      //teamChecked: false,
      //matched: false,
    }

    toSaveItem[0].set(params)

    toSaveItem[0]
      .save(params)
      .then(
        (results) => {
          alert("Unlisted Item.")
          handleModalClose()

          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )
  }

  const handleRelistItem = async () => {
    const TestItemData2 = Moralis.Object.extend("testItemData2");
    const query = new Moralis.Query(TestItemData2);

    query.equalTo("objectId", editModalData);
    const toSaveItem = await query.find();
    console.log("toSaveItem:", toSaveItem)

    const params = {

      public: true,
      //teamChecked: false,
      //matched: false,
    }

    toSaveItem[0].set(params)

    toSaveItem[0]
      .save(params)
      .then(
        (results) => {
          alert("Relisted Item.")
          handleModalClose()
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )
  }

  const handleDeleteItem = async () => {
    const TestItemData2 = Moralis.Object.extend("testItemData2");
    const query = new Moralis.Query(TestItemData2);

    query.equalTo("objectId", editModalData);
    const toSaveItem = await query.find();
    console.log("toSaveItem:", toSaveItem)

    const params = {

      public: false,
      archived: true,
      //teamChecked: false,
      //matched: false,
    }

    toSaveItem[0].set(params)

    toSaveItem[0]
      .save(params)
      .then(
        (results) => {
          alert("Deleted Item.")
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )
  }

  const handleItemFormSubmit = async () => {
    const userObj = Moralis.User.current()
    if (!userObj.attributes.phoneNumber){
      alert("Your User Profile is not completed yet! Please complete first before listing items.")
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

    if (itemImage){
    const uploadItemImage = new Moralis.File(itemImage.name, itemImage);
    uploadItemImageResults = await uploadItemImage.saveIPFS();
    console.log("uploadItemImageResults", uploadItemImageResults)
    setImageUrl1(uploadItemImageResults._url)}
    //else {
      //setSubmitted(false)
      //displayAlert("Item Image not chosen.")
      //return
    //}

    if (itemReceipt){
    const uploadItemReceipt = new Moralis.File(itemReceipt.name, itemReceipt);
    uploadItemReceiptResults = await uploadItemReceipt.saveIPFS();
    console.log("uploadItemReceiptResults", uploadItemReceiptResults)
    setImageUrl2(uploadItemReceiptResults._url)}

    //const userObj = Moralis.User.current();

    const TestItemData2 = Moralis.Object.extend("testItemData2");
    const query = new Moralis.Query(TestItemData2);

    query.equalTo("objectId", editModalData);
    const toSaveItem = await query.find();
    console.log("toSaveItem:", toSaveItem)

    const TestItemData = Moralis.Object.extend("testItemData2");

    const TestItemDataACL = new Moralis.ACL();
    TestItemDataACL.setWriteAccess(userObj.id, true);
    TestItemDataACL.setReadAccess(userObj.id, true); // after review only public can read
    const testItemData = new TestItemData();
    testItemData.setACL(TestItemDataACL);

    const params = {
      //ObjId: userObj.id,
      itemName: itemName,
      itemBrand: itemBrand,
      itemRetailPrice: itemRetailPrice,
      itemCostAfterTax: itemCostAfterTax,
      itemShares: itemShares,
      itemSharesAvailable: itemSharesAvailable,
      itemBasicUnitsNo: itemBasicUnitsNo,
      whereBought: whereBought,
      itemImage: itemImage ? uploadItemImageResults._url : itemOldImage,
      itemReceipt: itemReceipt ? uploadItemReceiptResults._url : itemOldReceipt,
      //public: true,
      //archived: false,
      //teamChecked: false,
      //matched: false,
    }
    console.log("params.itemImage", params.itemImage)

    toSaveItem[0].set(params)

    toSaveItem[0]
      .save(params)
      .then(
        (results) => {
          console.log("Submitted Results", results)
          if (itemImage){
          setItemOldImage(uploadItemImageResults._url)}
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


    alert("Submitted Successfully!")
    /*
    setItemName('')
    setItemBrand('')
    setItemRetailPrice('')
    setItemCostBeforeTax('')
    setItemCostAfterTax('')
    setWhereBought('')
    setItemShares(2)
    setItemSharesAvailable(1)
    */
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
    <div className="rounded flex flex-col items-center pt-6 pb-6 flex flex-col items-center">

        {isAuthenticated && (

          <form className="px-6 w-80">
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
                * Item Brand
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
                Where did you buy this item?
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
                Entire Item Price (Tax included) <br /><span className="text-xs">(This price will be listed. <br />If you have markups, please adjust here.)</span>
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="itemRetailPrice" type="number" placeholder="18.99" value={itemRetailPrice}
              onChange={(e) => {
                setItemRetailPrice(e.target.value);
              }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCostAfterTax">
                {itemBasicUnitText}<br /><span className="text-xs">(Units with Individual Packaging)</span>
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="noBasicUnits" type="number" placeholder="10" value={itemBasicUnitsNo}
              onChange={(e) => {
                setItemBasicUnitsNo(e.target.value);
              }}
              />
            </div>
            <div className="mb-3 flex flex-row items-end justify-between">
              <div className="mb-3 mr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCostAfterTax">
                  Number of  <br/> Shares Item <br/>  is Splitting Into:
                </label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="itemShares" id="itemShares" type="number" value={itemShares}
                onChange={(e) => {
                  setItemShares(Math.floor(e.target.value));
                }}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-3 ml-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCostAfterTax">
                  Number of  <br/> Shares Available:
                </label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="itemShares" id="itemShares" type="number" value={itemSharesAvailable}
                onChange={(e) => {
                  setItemSharesAvailable(Math.floor(e.target.value));
                }}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Price per Share: {itemRetailPrice && (itemRetailPrice/itemShares).toFixed(2)}
              </label>
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Unit(s) per Share: {itemBasicUnitsNo && (itemBasicUnitsNo/itemShares).toFixed(0)}
              </label>
            </div>
            <div className="mb-3 py-[20px]">
              <p className="block text-gray-700 text-sm font-bold">Existing Item Image:
              </p>
              <div className="pt-2">
                <img width={120} height={120} layout="responsive" src={itemOldImage} />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemImage">
                Change Item Image:
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="itemImage" type='file' onChange={onSelectItemImage} name="Item_Image" />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemReceipt">
                Item Receipt (will not be disclosed to the public)
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="itemReceipt" type='file' onChange={onSelectItemReceipt} name="Item_Receipt" />
            </div>
            <div className="pt-2 flex items-center justify-between">
              {!submitted ?
              <button className={styles.loginButton} type="button"
              onClick={handleItemFormSubmit}
              >
                Update
              </button> :
              <p>Updating Item</p>}
            </div>

            {isPublic &&
            <div className="pt-2 flex items-center justify-between">

              <button className={styles.loginButton} type="button"
              onClick={handleUnlistItem}
              >
                Unlist Item
              </button>
            </div>}

            {!isPublic &&
            <div className="pt-2 flex items-center justify-between">

              <button className={styles.loginButton} type="button"
              onClick={handleRelistItem}
              >
                Re-list Item
              </button>
            </div>}



            <div className="pt-2 flex items-center justify-between">

              <button className={styles.loginButton} type="button"
              onClick={handleDeleteItem}
              >
                Delete Item
              </button>

            </div>


          </form>

      )}


    </div>
  );
}

export default EditItem
