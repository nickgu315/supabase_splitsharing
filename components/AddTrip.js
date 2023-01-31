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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimePicker from "../components/TimePicker";
import MapWithMarker from "../components/MapWithMarker";
import Geocode from "react-geocode";
import Select from 'react-select';
//import DateTimePicker from 'react-datetime-picker';

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.setRegion("US");
Geocode.setLocationType("ROOFTOP");





export default function AddTrip() {
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
  const [hourInputValue, setHourInputValue] = useState('');
  const [minuteInputValue, setMinuteInputValue] = useState('');
  const [apmInputValue, setApmInputValue] = useState('');
  const [selectedValues, setselectedValues] = useState({ selected: [] });
  const [hourSelectedValues, setHourSelectedValues] = useState('');
  const [minuteSelectedValues, setMinuteSelectedValues] = useState('');
  const [apmSelectedValues, setApmSelectedValues] = useState('');
  const [selection, setSelection] = useState(undefined)
  const [hourSelection, setHourSelection] = useState(undefined)
  const [minuteSelection, setMinuteSelection] = useState(undefined)
  const [apmSelection, setApmSelection] = useState(undefined)
  const [takeUpAll, setTakeUpAll] = useState(true);
  const [tripDate, setTripDate] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [dropOffTime, setDropOffTime] = useState('');
  const [deadlineTime1, setDeadlineTime1] = useState('');
  const [deadlineTime2, setDeadlineTime2] = useState('');
  const [deadlineTime1Data, setDeadlineTime1Data] = useState(undefined);
  const [deadlineTime2Data, setDeadlineTime2Data] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState(null);


  const [isUCLA, setIsUCLA] = useState(false);
  const [loading, setLoading] = useState(undefined);

  const [addressInput, setAddressInput] = useState('');
  const [latlng, setLatlng] = useState(undefined);

  const [dropOffDay, setDropOffDay] = useState(undefined);
  const [dropOffDate, setDropOffDate] = useState(undefined);

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
  const [value, onChange] = useState(new Date());

  const searchEndpoint = (query) => `/api/search?q=${query}`

  const takeUpAllChecked = () => setTakeUpAll(value => !value);

  const passedDeadlineTime1 = (arg) => {
    console.log("passedDeadlineTime1 outside", arg)
    setDeadlineTime1(arg.time)
    setDeadlineTime1Data(arg)
  };

  const onChangeLatLng = (arg) => {
    console.log("onChangeLatLng arg", arg.toJSON())
    setLatlng(arg.toJSON())
  };

  const passedDeadlineTime2 = (arg) => {
    console.log("passedDeadlineTime2 outside", arg)
    setDeadlineTime2(arg.time)
    setDeadlineTime2Data(arg)
  };

  const [dateState, setDateState] = useState(new Date())
  const [dateState2, setDateState2] = useState(new Date())
  const changeDate = (e) => {

    const toSetDayNum = e.getDay()
    const toSetDate = e.getDate()
    const toSetMonthNum = e.getMonth()
    const toSetYear = e.getFullYear()

    var toSetDay = undefined
    var toSetMonth = undefined

    switch (toSetDayNum) {
      case 0:
        toSetDay = 'Sun';
        break;
      case 1:
        toSetDay = 'Mon';
        break;
      case 2:
        toSetDay = 'Tue';
        break;
      case 3:
        toSetDay = 'Wed';
        break;
      case 4:
        toSetDay = 'Thur';
        break;
      case 5:
        toSetDay = 'Fri';
        break;
      case 6:
        toSetDay = 'Sat';
        break;
    }

    switch (toSetMonthNum) {
      case 0:
        toSetMonth = 'Jan';
        break;
      case 1:
        toSetMonth = 'Feb';
        break;
      case 2:
        toSetMonth = 'Mar';
        break;
      case 3:
        toSetMonth = 'Apr';
        break;
      case 4:
        toSetMonth = 'May';
        break;
      case 5:
        toSetMonth = 'Jun';
        break;
      case 6:
        toSetMonth = 'Jul';
        break;
      case 7:
        toSetMonth = 'Aug';
        break;
      case 8:
        toSetMonth = 'Sept';
        break;
      case 9:
        toSetMonth = 'Oct';
        break;
      case 10:
        toSetMonth = 'Nov';
        break;
      case 11:
        toSetMonth = 'Dec';
        break;
    }

    const toSetDDMY = toSetDay + ' ' + toSetDate + ' ' + toSetMonth + ' ' + toSetYear

    //console.log("date to set:", toSetDDMY)
    setDropOffDay(toSetDay)
    setDropOffDate(toSetDate + ' ' + toSetMonth + ' ' + toSetYear)
    setTripDate(toSetDDMY)
    setDeadlineDate(toSetDDMY)
    setDateState(e)
    setDateState2(e)
  }

  const changeDate2 = (e) => {

    const toSetDayNum = e.getDay()
    const toSetDate = e.getDate()
    const toSetMonthNum = e.getMonth()
    const toSetYear = e.getFullYear()

    var toSetDay = undefined
    var toSetMonth = undefined

    switch (toSetDayNum) {
      case 0:
        toSetDay = 'Sun';
        break;
      case 1:
        toSetDay = 'Mon';
        break;
      case 2:
        toSetDay = 'Tue';
        break;
      case 3:
        toSetDay = 'Wed';
        break;
      case 4:
        toSetDay = 'Thur';
        break;
      case 5:
        toSetDay = 'Fri';
        break;
      case 6:
        toSetDay = 'Sat';
        break;
    }

    switch (toSetMonthNum) {
      case 0:
        toSetMonth = 'Jan';
        break;
      case 1:
        toSetMonth = 'Feb';
        break;
      case 2:
        toSetMonth = 'Mar';
        break;
      case 3:
        toSetMonth = 'Apr';
        break;
      case 4:
        toSetMonth = 'May';
        break;
      case 5:
        toSetMonth = 'Jun';
        break;
      case 6:
        toSetMonth = 'Jul';
        break;
      case 7:
        toSetMonth = 'Aug';
        break;
      case 8:
        toSetMonth = 'Sept';
        break;
      case 9:
        toSetMonth = 'Oct';
        break;
      case 10:
        toSetMonth = 'Nov';
        break;
      case 11:
        toSetMonth = 'Dec';
        break;
    }

    const toSetDDMY = toSetDay + ' ' + toSetDate + ' ' + toSetMonth + ' ' + toSetYear

    //console.log("date to set:", toSetDDMY)
    setDeadlineDate(toSetDDMY)
    setDateState2(e)
  }


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

    checkIsUCLA()

  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
    console.log("handleInputChange value", value)
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


  useCallback(
    (node) => {
      console.log(node);
    },
    [inputValue]
  );

  const handleInputChange2 = (value) => {
    setInputValue2(value);
    console.log("handleInputChange2 value", value)
  };

  useCallback(
    (node2) => {
      console.log(node2);
    },
    [inputValue2]
  );

  const handleOnChange = (e) => {

    const newOption = { label: inputValue, inputValue };

    inputValue !== '' && setSelection([...selection, newOption]);

    setInputValue('');

    setselectedValues(selection);
    console.log("handleOnChange e.value", e.value)
    setItemShares(e.value)

    let theSelection2=[]
    if(e.value>1){
      for(const i = 1; i < (e.value/1); i++){
        console.log("the i value:", i)
        theSelection2.push({ value: i.toString(), label: i.toString() })

      }
    } else if (e.value==1){
      var i=1
      theSelection2.push({ value: i.toString(), label: i.toString() })
    }
    setSelection2(theSelection2)



    //changeChartData({itemId:itemId, quantity: e.value})

  };

  const hourHandleOnChange = (e) => {

    //const newOption = { label: inputValue, inputValue };

    //inputValue !== '' && setSelection([...selection, newOption]);

    //setInputValue('');

    setHourSelectedValues(e.value);
    console.log("hourHandleOnChange e.value", e.value)
    //setItemShares(e.value)

    //let theSelection2=[]

    //setHourSelection(theSelection2)

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

  };


  const handleOnChange2 = (e) => {

    const newOption2 = { label: inputValue2, inputValue2 };

    inputValue2 !== '' && setSelection2([...selection2, newOption2]);

    setInputValue2('');

    setselectedValues2(selection2);

    console.log("handleOnChange2 e.value", e.value)
    setItemSharesTaking(e.value)

    //changeChartData({itemId:itemId, quantity: e.value})

  };

  const onChange_searchToAdd = useCallback((event) => {
    const query = event.target.value;
    setQuery(event.target.value)
    console.log("query.length at callback", query.length)
    if (query.length > 0){
      setTimeout(() => {
        handleSearchToAdd(event.target.value)
      }, 500);
    } else if(event.target.value.length == 0){
      setTimeout(() => {
        setResults([])
      }, 1000);
    }
  }, [])


  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])



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

  const handleTripFormSubmit = async () => {
    if (!isUCLA){
      displayAlert("This feature is currently only available to UCLA students or affiliates.")
      return
    }
    if(!tripDate){
      displayAlert("Please Pick a Trip Date!")
      return
    }
    if(!deadlineTime1){
      displayAlert("Please Set Drop Off Time!")
      return
    }
    if(!deadlineTime2){
      displayAlert("Please Set Deadline Date & Time!")
      return
    }
    if(!latlng){
      displayAlert("Please Set Marker on Map!")
      return
    }
    const userObj = Moralis.User.current()
    if (!userObj.attributes.phoneNumber){
      displayAlert("Your User Profile is not completed yet! Please complete first before initiating a trip.")

      return
    }

    setSubmitted(true)


    const ShoppingTripsData1 = Moralis.Object.extend("shoppingTripsData1");

    const ShoppingTripsData1ACL = new Moralis.ACL();
    ShoppingTripsData1ACL.setWriteAccess(userObj.id, true);
    ShoppingTripsData1ACL.setReadAccess(userObj.id, true); // after review only public can read
    const shoppingTripsData1 = new ShoppingTripsData1();
    shoppingTripsData1.setACL(ShoppingTripsData1ACL);

    const params = {
      ObjId: userObj.id,
      dropOffDate: dropOffDate,
      dropOffDay: dropOffDay,
      dropOffUTC: dateState,
      dropOffTime: deadlineTime1,
      dropOffLocation: addressInput,
      lat: latlng.lat,
      lng: latlng.lng,
      deadlineDate: deadlineDate,
      deadlineTime: deadlineTime2,
      deadlineUTC: dateState2,
      paymentDeadlineDate: deadlineDate,
      paymentDeadlineTime: deadlineTime2,
      tripStore: 'Costco',
      public: false,
      archived: false,
      teamChecked: false,
    }
    console.log("params", params)

    shoppingTripsData1
      .save(params)
      .then(
        (results) => {
          console.log("Submitted Results", results)
          displayAlert("Submitted Successfully! Your Trip will be Reviewed and made Public if no issues.")
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )

      /*
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
      }*/


    /*
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
    */
    setSubmitted(false)

  }


  const handleGeocodeSearch = () => {
    if (latlng != undefined){
      setLatlng('reset')
    }

    if(addressInput==''){
      displayAlert("Please Input Address.")
      return
    }
        Geocode.fromAddress(addressInput).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log('lat, lng', lat, lng);
        setLatlng({lat: lat, lng: lng})
      },
      (error) => {
        setLatlng(undefined)
        displayAlert("Address Not Found. Please Edit & Try Again.")
        console.error(error);
      }
    );
  };

  async function checkIsUCLA() {
      const user = Moralis.User.current()
      if (user){
        const params = {userId: user.id}
        const results = await Moralis.Cloud.run("checkIsUCLA", params)
        if (results){
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

  return (
    <div>
    <Head>
      <title>Shopping Trip | Split Sharing</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <Popup
      open={open}
      closeOnDocumentClick = {false}
      onClose={closeModal}
      contentStyle = {{
        background: "rgba(0, 0, 0, 0.3)",
        width: "100%",
        height: "100%",
      }}
    >
    {close => (
      <div className="flex flex-col items-center">
      <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center w-[90vw] md:w-[500px] translate-y-[50vh] md:translate-y-[50vh]">



        <div className="text-[18px] px-[10px] w-[90vw] md:w-[500px] text-center">
          {alertMessage}
        </div>


        <div className="flex flex-col items-center w-full pt-[15px]">
          <button
            className="text-[17px] text-center"
            onClick={() => {
              setOpen(false)
              if(alertMessage == "Submitted Successfully! Your Trip will be Reviewed and made Public if no issues."){
                Router.push({
                  pathname: '/shoppingTrips',
                })
              }
              setAlertMessage('')
            }}
          >
            close
          </button>
        </div>

      </div>
      </div>
    )}
    </Popup>
    <div className="flex flex-col items-center bg-white pt-6 pb-6 flex flex-col items-center rounded-lg border-2 border-[#F1592A] md:w-auto">




        {isAuthenticated && (
          <div>

          <div className='pl-[30px] flex flex-row w-[260px] justify-between h-[20px]'>
            <div className ='text-[18px] font-bold items-center text-left'>
            Initiate a Shopping Trip:
            </div>
          </div>

          <div
            className="px-6 w-80 relative md:w-[400px] pt-[30px] pb-[10px]"
            ref={searchRef}
          >


          </div>


          <div className="px-6 w-80 relative md:w-auto">
            <div className="absolute top-[-80px] right-[5px]">

              <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={()=>{
                if(true){
                Router.push({
                  pathname: '/shoppingTrips',
                })
              }

              }}



              >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>

            </div>


            <div>
              <div className='font-bold bg-[#F6F6F6] rounded-lg shadow py-[3px] px-[5px]'>
                <div>
                  Trip to: Costco
                </div>
              </div>

              <div className='flex flex-col items-center pt-[10px]'>
                <Popup
                  trigger={open => (<button className={styles.DatePickButton} id='datePickPopup1'> {!open ? 'Pick Store' : 'Set'} </button>)}
                  position="bottom center"
                >
                  {close => (
                    <div className='flex flex-col items-center bg-[#E6E6E6] rounded-xl py-[10px] px-[10px] shadow'>

                      <div className='flex flex-col items-center w-[280px]'>
                        <div>
                          Costco is the only option now.
                        </div>

                        <Select
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={[{ value: 'Costco', label: 'Costco' }]}
                          placeholder='Costco'
                        />
                      </div>

                    </div>
                  )}
                </Popup>
              </div>

            </div>



            <div className='pt-[20px]'>
              <div className='font-bold bg-[#F6F6F6] rounded-lg shadow py-[3px] px-[5px]'>
                <div>
                  Trip Date: <span className='text-[red]'> {tripDate != '' ? tripDate : 'Please Pick a Trip Date'} </span>
                </div>
                <div>
                  Drop Off Time: <span className='text-[red]'>  {deadlineTime1 !='' ? deadlineTime1 : 'Please Set'} </span>
                </div>
              </div>

              <div className='flex flex-col items-center pt-[10px]'>
                <Popup
                  trigger={open => (<button className={styles.DatePickButton} id='datePickPopup1'> {!open ? 'Pick Trip Date' : 'Set'} </button>)}
                  position="bottom center"
                  contentStyle = {{
                    background: 'rgb(255, 255, 255)',
                    width: '320px',
                  }}
                >
                  {close => (
                  <div className="flex flex-col items-center py-[5px]">
                    <Calendar
                    value={dateState}
                    onChange={changeDate}
                    />
                  </div>
                  )}
                </Popup>
              </div>

            </div>

            <div className='pt-[0pt]'>
              <div className='flex flex-col items-center pt-[5px]'>
                <Popup
                  trigger={open => (<button className={styles.DatePickButton} id='datePickPopup1'> {!open ? 'Set Drop Off Time' : 'Set'} </button>)}
                  position="bottom center"
                  contentStyle = {{
                    background: 'rgb(255, 255, 255)',
                    width: '300px',
                  }}
                >
                  {close => (
                    <div className='flex flex-col items-center bg-[#E6E6E6] rounded-xl py-[10px] px-[10px] shadow'>

                      <div className='flex flex-col items-center w-[280px]'>
                        <TimePicker {...{hourValue: deadlineTime1Data && deadlineTime1Data.hourValue,
                                         minuteValue: deadlineTime1Data && deadlineTime1Data.minuteValue,
                                         apmValue: deadlineTime1Data && deadlineTime1Data.apmValue,
                                         passedDeadlineTime1: passedDeadlineTime1}} />
                      </div>

                    </div>
                  )}
                </Popup>
              </div>
            </div>

            <div className='pt-[20px]'>
              <div className='font-bold bg-[#F6F6F6] rounded-lg shadow py-[5px] px-[5px]'>
                <div>
                  Item Add & Deposit Deadline <br /> Date: <span className='text-[red]'> {deadlineDate != '' ? deadlineDate : 'Please Pick Deadline Date'} </span>
                </div>
                <div>
                  Time: <span className='text-[red]'>  {deadlineTime2 !='' ? deadlineTime2 : 'Please Set'} </span>
                </div>
              </div>

              <div className='flex flex-col items-center pt-[10px]'>
                <Popup
                  trigger={open => (<button className={styles.DatePickButton} id='datePickPopup1'> {!open ? 'Pick Dealine Date' : 'Set'} </button>)}
                  position="bottom center"
                  contentStyle = {{
                    background: 'rgb(255, 255, 255)',
                    width: '320px',
                  }}
                >
                  {close => (
                  <div className="flex flex-col items-center py-[5px]">
                    <Calendar
                    value={dateState2}
                    onChange={changeDate2}
                    />
                  </div>
                  )}
                </Popup>
              </div>

            </div>

            <div>
              <div className='flex flex-col items-center pt-[5px]'>
                <Popup
                  trigger={open => (<button className={styles.DatePickButton} id='datePickPopup2'> {!open ? 'Set Dealine Time' : 'Set'} </button>)}
                  position="bottom center"
                  contentStyle = {{
                    background: 'rgb(255, 255, 255)',
                    width: '300px',
                  }}
                >
                  {close => (
                  <div className='flex flex-col items-center bg-[#E6E6E6] rounded-xl py-[10px] px-[10px] shadow'>

                    <div className='flex flex-col items-center w-[280px]'>
                      <TimePicker {...{hourValue: deadlineTime2Data && deadlineTime2Data.hourValue,
                                       minuteValue: deadlineTime2Data && deadlineTime2Data.minuteValue,
                                       apmValue: deadlineTime2Data && deadlineTime2Data.apmValue,
                                       passedDeadlineTime1: passedDeadlineTime2}} />
                    </div>

                  </div>
                  )}
                </Popup>
              </div>
            </div>


            <div className='pt-[20px]'>
              <div className='font-bold bg-[#F6F6F6] rounded-lg shadow py-[3px] px-[5px]'>
                <div>
                  Drop off Location: <br/ ><span className='text-[red]'> {addressInput != '' ? addressInput : 'Please Input Address Below'} </span>
                </div>

              </div>

              <div className='pt-[10px]'>
                <input className="rounded-2xl shadow appearance-none border rounded w-full h-[45px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="addressInput" type="text" placeholder="e.g. 625 Landfair Ave." value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value);
                }}
                />
              </div>

              <div className="pt-[5px] flex items-center justify-between">
                <button className={styles.loginButton} type="button"
                onClick={handleGeocodeSearch}
                >
                  Set Marker on Map
                </button>
              </div>
            </div>

            {latlng != undefined &&
            <div className='flex flex-col items-center pt-[20px]'>
              <div className='text-[12px]'>
              You can Click on map to further adjust the location.
              </div>
              {latlng != 'reset' ?
              <MapWithMarker {...latlng} onChangeLatLng={onChangeLatLng} justDisplay={false}/>
              : latlng == 'reset' &&
              <div className='w-[300px] h-[300px] bg-white'>
              </div>
              }
            </div>
            }

            <div className="pt-[30px] flex items-center justify-between">
              {!submitted ?
              <button className={styles.loginButton} type="button"
              onClick={handleTripFormSubmit}
              >
                Submit
              </button> :
              <p>Uploading Item</p>}
            </div>


          </div>
          </div>

      )}

    </div>
    </div>
  );
}
