import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/search.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useCallback, useRef, useState, useEffect } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import Popup from 'reactjs-popup';
import { withRouter } from 'next/router';
import Router from "next/router";
import { useRouter } from 'next/router'
import CreatableSelect from 'react-select/creatable';
import Head from "next/head";
import Select from 'react-select';



export default function TimePicker({passedDeadlineTime1, hourValue, minuteValue, apmValue}) {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();

  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemRetailPrice, setItemRetailPrice] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [whereBought, setWhereBought] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [itemShares, setItemShares] = useState(undefined);
  const [itemSharesAvailable, setItemSharesAvailable] = useState(undefined);
  const [itemSharesTaking, setItemSharesTaking] = useState(undefined);
  const [itemBasicUnitsNo, setItemBasicUnitsNo] = useState('');
  const [itemCode, setItemCode] = useState(undefined);
  const [searchValue, setSearchValue] = useState('');
  const [toBack, setToBack] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValues, setselectedValues] = useState({ selected: [] });
  const [selection, setSelection] = useState(undefined)
  const [takeUpAll, setTakeUpAll] = useState(true);

  const [hourInputValue, setHourInputValue] = useState('');
  const [minuteInputValue, setMinuteInputValue] = useState('');
  const [apmInputValue, setApmInputValue] = useState('');

  const [hourSelectedValues, setHourSelectedValues] = useState('');
  const [minuteSelectedValues, setMinuteSelectedValues] = useState('');
  const [apmSelectedValues, setApmSelectedValues] = useState('');

  const [hourSelection, setHourSelection] = useState(undefined)
  const [minuteSelection, setMinuteSelection] = useState(undefined)
  const [apmSelection, setApmSelection] = useState(undefined)

  const [inputValue2, setInputValue2] = useState('');
  const [selectedValues2, setselectedValues2] = useState({ selected: [] });
  const [selection2, setSelection2] = useState(undefined)

  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');

  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])
  const [selectedFrSearchToAdd, setSelectedFrSearchToAdd] = useState(false)
  const [itemRefImage, setItemRefImage] = useState(undefined);
  const [itemRefPrice, setItemRefPrice] = useState(undefined);
  const [itemRefUrl, setItemRefUrl] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);


  const searchEndpoint = (query) => `/api/search?q=${query}`

  const takeUpAllChecked = () => setTakeUpAll(value => !value);


  useEffect(() => {
    let theSelection=[]
    if(true){
      for(const i = 1; i < 11; i++){
        theSelection.push({ value: i.toString(), label: i.toString() })

      }
    }
    setSelection(theSelection)

    let theHourSelection=[]
    if(true){
      for(const i = 1; i < 13; i++){
        theHourSelection.push({ value: i.toString(), label: i.toString() })

      }
    }
    setHourSelection(theHourSelection)

    let theMinuteSelection=[]
    if(true){
      theMinuteSelection.push({ value: "00", label: "00" })
      theMinuteSelection.push({ value: "05", label: "05" })
      for(const i = 10; i < 60; i+=5){
        theMinuteSelection.push({ value: i.toString(), label: i.toString() })

      }
    }
    setMinuteSelection(theMinuteSelection)

    let theApmSelection=[]
    if(true){

      theApmSelection.push({ value: 'AM', label: 'AM' })
      theApmSelection.push({ value: 'PM', label: 'PM' })


    }
    setApmSelection(theApmSelection)

    console.log("hourValue", hourValue)
    setSelectedOption(hourValue)
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
    console.log("handleInputChange value", value)
  };

  useCallback(
    (node) => {
      console.log(node);
    },
    [inputValue]
  );



  useCallback(
    (node2) => {
      console.log(node2);
    },
    [inputValue2]
  );

  const hourHandleOnChange = (e) => {

    //const newOption = { label: inputValue, inputValue };

    //inputValue !== '' && setSelection([...selection, newOption]);

    //setInputValue('');

    setHourSelectedValues(e.value);
    console.log("hourHandleOnChange e.value", e.value)
    //setItemShares(e.value)

    //let theSelection2=[]

    //setHourSelection(theSelection2)
    toPassBack({hour: e.value})
  };

  const minuteHandleOnChange = (e) => {

    //const newOption = { label: inputValue, inputValue };

    //inputValue !== '' && setMinuteSelection([...selection, newOption]);

    //setInputValue('');

    setMinuteSelectedValues(e.value);
    console.log("minuteHandleOnChange e.value", e.value)
    //setItemShares(e.value)

    //let theSelection2=[]

    //setHourSelection(theSelection2)
    toPassBack({minute: e.value})
  };

  const apmHandleOnChange = (e) => {

    //const newOption = { label: inputValue, inputValue };

    //inputValue !== '' && setMinuteSelection([...selection, newOption]);

    //setInputValue('');

    setApmSelectedValues(e.value);
    console.log("apmHandleOnChange e.value", e.value)
    //setItemShares(e.value)

    //let theSelection2=[]

    //setHourSelection(theSelection2)
    toPassBack({apm: e.value})

  };


  const toPassBack = (param) => {
    if(!hourValue){
      if (param.apm){
        if (minuteSelectedValues != '' && hourSelectedValues != ''){
          passedDeadlineTime1({time: hourSelectedValues + ':' + minuteSelectedValues + ' ' + param.apm, hourValue: hourSelectedValues, minuteValue: minuteSelectedValues, apmValue: param.apm})
          return
        }
      }

      if (param.hour){
        if (minuteSelectedValues != '' && apmSelectedValues != ''){
          passedDeadlineTime1({time: param.hour + ':' + minuteSelectedValues + ' ' + apmSelectedValues, hourValue: param.hour, minuteValue: minuteSelectedValues, apmValue: apmSelectedValues})
          return
        }
      }

      if (param.minute){
        if (hourSelectedValues != '' && apmSelectedValues != ''){
          passedDeadlineTime1({time: hourSelectedValues + ':' + param.minute + ' ' + apmSelectedValues, hourValue: hourSelectedValues, minuteValue: param.minute, apmValue: apmSelectedValues})
          return
        }
      }
    } else {
      if (param.apm){

          passedDeadlineTime1({time: hourValue + ':' + minuteValue + ' ' + param.apm, hourValue: hourValue, minuteValue: minuteValue, apmValue: param.apm})
          return

      }

      if (param.hour){

          passedDeadlineTime1({time: param.hour + ':' + minuteValue + ' ' + apmValue, hourValue: param.hour, minuteValue: minuteValue, apmValue: apmValue})
          return

      }

      if (param.minute){

          passedDeadlineTime1({time: hourValue + ':' + param.minute + ' ' + apmValue, hourValue: hourValue, minuteValue: param.minute, apmValue: apmValue})
          return

      }
    }
  };

  const hourHandleInputChange = (value) => {
    setHourInputValue(value);
    console.log("hourHandleInputChange value", value)
  };

  const minuteHandleInputChange = (value) => {
    setMinuteInputValue(value);
    console.log("minuteHandleInputChange value", value)
  };

  const apmHandleInputChange = (value) => {
    setApmInputValue(value);
    console.log("apmHandleInputChange value", value)
  };





  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])


  const itemBasicUnitText = "* Total Number of Basic Units for this item:"

  const displayAlert = (message) => {
    setAlertMessage(message)
    setOpen(true)
  }

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')
  }

  const keySubmit=(event)=> {
        if (event.keyCode === 13) {
          handleSearch()
        }
    }



  const handleItemFormSubmit = async () => {
    if(!itemName){
      displayAlert("Please Input Item Name")
      return
    }
    if(!itemRetailPrice){
      displayAlert("Please Input Item Price")
      return
    }
    if(!itemShares){
      displayAlert("Please Input Number of Share(s) Item is Splitting Into.")
      return
    }
    if(!itemSharesTaking){
      displayAlert("Please Input Number of Share(s) You are Taking Up.")
      return
    }
    const userObj = Moralis.User.current()
    if (!userObj.attributes.phoneNumber){
      displayAlert("Your User Profile is not completed yet! Please complete first before listing items.")
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
    var finalUploadItemImageResults

    if (itemImage){
    const uploadItemImage = new Moralis.File(itemImage.name, itemImage);
    uploadItemImageResults = await uploadItemImage.saveIPFS();
    console.log("uploadItemImageResults", uploadItemImageResults)
    setImageUrl1(uploadItemImageResults._url)
    finalUploadItemImageResults = uploadItemImageResults._url
    }
    else if (!itemRefImage){
      setSubmitted(false)
      displayAlert("Item Image not chosen.")
      return
    }
    else if (!itemImage && itemRefImage){
      finalUploadItemImageResults = itemRefImage
    }

    if (itemReceipt){
    const uploadItemReceipt = new Moralis.File(itemReceipt.name, itemReceipt);
    uploadItemReceiptResults = await uploadItemReceipt.saveIPFS();
    console.log("uploadItemReceiptResults", uploadItemReceiptResults)
    setImageUrl2(uploadItemReceiptResults._url)}

    //const userObj = Moralis.User.current();

    const TestItemData = Moralis.Object.extend("shoppingTripItemsData1");

    const TestItemDataACL = new Moralis.ACL();
    TestItemDataACL.setWriteAccess(userObj.id, true);
    TestItemDataACL.setReadAccess(userObj.id, true); // after review only public can read
    const testItemData = new TestItemData();
    testItemData.setACL(TestItemDataACL);

    const params = {
      ObjId: userObj.id,
      tripId: tripId,
      itemName: itemName,
      itemBrand: itemBrand,
      itemRetailPrice: itemRetailPrice,
      itemCostAfterTax: itemCostAfterTax,
      itemBasicUnitsNo: itemBasicUnitsNo,
      itemShares: itemShares,
      itemSharesAvailable: itemSharesAvailable,
      itemSharesTaking: itemSharesTaking,
      whereBought: whereBought,
      itemImage: finalUploadItemImageResults,
      itemReceipt: itemReceipt ? uploadItemReceiptResults._url : null,
      public: true,
      archived: false,
      teamChecked: false,
      matched: false,
      takeUpAll: takeUpAll,
      itemCode: itemCode,
    }
    console.log("params", params)

    testItemData
      .save(params)
      .then(
        (results) => {
          console.log("Submitted Results", results)
          displayAlert("Submitted Successfully!")
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



    setItemName('')
    setItemBrand('')
    setItemRetailPrice('')
    setItemCostBeforeTax('')
    setItemCostAfterTax('')
    setWhereBought('')
    setItemBasicUnitsNo('')
    setItemShares(undefined)
    setItemSharesTaking(undefined)
    setItemImage(undefined)
    setItemReceipt(undefined)
    setSubmitted(false)

  }




  return (
      <div className='flex flex-row items-center'>
        <div className='flex- flex-col items-center'>
          <div>
          Hour:
          </div>
          <CreatableSelect
            className="text-[11px] lg:text-[12px] w-[85px]"
            options={hourSelection}
            onChange={hourHandleOnChange}
            isSearchable={false}
            onInputChange={hourHandleInputChange}
            inputValue={hourInputValue}
            value={hourSelectedValues.selected}
            placeholder = {hourValue && hourValue}
            controlShouldRenderValue={true}
          />
        </div>
        <div className='flex- flex-col items-center px-[10px]'>
          <div>
          Minute:
          </div>
          <CreatableSelect
            className="text-[11px] lg:text-[12px] w-[85px]"
            options={minuteSelection}
            onChange={minuteHandleOnChange}
            isSearchable={false}
            onInputChange={minuteHandleInputChange}
            inputValue={minuteInputValue}
            value={minuteSelectedValues.selected}
            controlShouldRenderValue={true}
            placeholder = {minuteValue && minuteValue}
          />
        </div>
        <div className='flex- flex-col items-center'>
          <div>
          AM/ PM
          </div>
          <CreatableSelect
            className="text-[11px] lg:text-[12px] w-[85px]"
            options={apmSelection}
            onChange={apmHandleOnChange}
            isSearchable={false}
            onInputChange={apmHandleInputChange}
            inputValue={apmInputValue}
            value={apmSelectedValues.selected}
            controlShouldRenderValue={true}
            placeholder = {apmValue && apmValue}
          />
        </div>
      </div>

  );
}
