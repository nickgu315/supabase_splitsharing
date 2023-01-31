import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";



export default function UserProfileEdit({displayName, firstName, lastName, address, city, zipCode, phoneNumber, profilePicture}) {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();


  const [displayNameEdit, setDisplayNameEdit] = useState(displayName);
  const [firstNameEdit, setFirstNameEdit] = useState(firstName);
  const [lastNameEdit, setLastNameEdit] = useState(lastName);
  const [addressEdit, setAddressEdit] = useState(address);
  const [cityEdit, setCityEdit] = useState(city);
  const [zipCodeEdit, setZipCodeEdit] = useState(zipCode);
  const [phoneNumberEdit, setPhoneNumberEdit] = useState(phoneNumber);
  const [profilePictureEdit, setProfilePictureEdit] = useState(undefined);
  const [allowContactChecked, setAllowContactChecked] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState(profilePicture);


  const allowContactToggleChecked = () => setAllowContactChecked(value => !value);

  const displayAlert = (message) => {
    alert(message)
  }

  const handleProfileFormSubmit = async () => {
    setSubmitted(true)
    //console.log("itemImage", itemImage)
    var uploadProfilePictureResults

    if (profilePictureEdit){
    const uploadProfilePictureEdit = new Moralis.File(profilePictureEdit.name, profilePictureEdit);
    uploadProfilePictureResults = await uploadProfilePictureEdit.saveIPFS();
    console.log("uploadProfilePictureResults", uploadProfilePictureResults)
    setImageUrl1(uploadProfilePictureResults._url)}

    const userObj = Moralis.User.current();

    const TestItemData = Moralis.Object.extend("testItemData2");
    const testItemData = new TestItemData();


    const params = {
      displayName: displayNameEdit,
      firstName: firstNameEdit,
      lastName: lastNameEdit,
      address: addressEdit,
      city: cityEdit,
      zipCode: zipCodeEdit,
      phoneNumber: phoneNumberEdit,
      profilePicture: profilePictureEdit ? uploadProfilePictureResults._url : null,
      archived: false,
      teamChecked: false,
    }
    console.log("params", params)

    userObj
      .save(params)
      .then(
        (results) => {
          console.log("Profile Data Submitted:", results)
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )

      var es = document.forms[0].elements;

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
    setItemImage(undefined)
    setItemReceipt(undefined)
    */
    setSubmitted(false)
  }


  const onSelectProfilePicture = e => {
    //console.log("e.target.files.length", e.target.files.length)
        if (!e.target.files || e.target.files.length === 0) {
            setProfilePictureEdit(undefined)
            return
        }
        //console.log("e.target.files[0]", e.target.files[0].name)
        //using the first image instead of multiple
        setProfilePictureEdit(e.target.files[0])
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
    <div className="rounded flex flex-col items-center bg-white pt-6 pb-6 flex flex-col items-center">

        {isAuthenticated && (

          <form className="px-6 w-80">
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                *Display Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="displayNameEdit" type="text" value={displayNameEdit}
              onChange={(e) => {
                setDisplayNameEdit(e.target.value);
              }}
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstNameEdit" type="text" value={firstNameEdit}
              onChange={(e) => {
                setFirstNameEdit(e.target.value);
              }}
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastNameEdit" type="text" value={lastNameEdit}
              onChange={(e) => {
                setLastNameEdit(e.target.value);
              }}
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Address
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="addressEdit" type="text" value={addressEdit}
              onChange={(e) => {
                setAddressEdit(e.target.value);
              }}
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cityEdit" type="text" value={cityEdit}
              onChange={(e) => {
                setCityEdit(e.target.value);
              }}
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                * Zip code
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="zipCodeEdit" type="number" value={zipCodeEdit}
              onChange={(e) => {
                setZipCodeEdit(e.target.value);
              }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                * Phone Number
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumberEdit" type="number" value={phoneNumberEdit}
              onChange={(e) => {
                setPhoneNumberEdit(e.target.value);
              }}
              />
            </div>

            {imageUrl1 && (
            <div className="pt-2 pb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Existing Profile Picture:
              </label>
              <img width={120} height={120} layout="responsive" src={imageUrl1} />
            </div>
            )}

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select New Profile Picture:
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="profilePicture" type='file' onChange={onSelectProfilePicture} name="profilePicture" />
            </div>




            <div className="flex items-center justify-center w-full">

              <label htmlFor="toggleB" className="flex items-center cursor-pointer">

                <div className="relative">

                  <input type="checkbox" id="toggleB" className="sr-only" checked={allowContactChecked} onChange={allowContactToggleChecked}/>

                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                </div>

                <div className="ml-3 text-gray-700 font-medium">
                  Allow other users to contact you directly after matching of item(s).
                </div>
              </label>

            </div>



            <div className="pt-2 flex items-center justify-between">
              {!submitted ?
              <button className={styles.loginButton} type="button"
              onClick={handleProfileFormSubmit}
              >
                Submit
              </button> :
              <p>Uploading Profile Data</p>}
            </div>





          </form>

      )}

    </div>
  );
}
