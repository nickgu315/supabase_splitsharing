import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";
import Head from "next/head"
import React, { useState, useCallback, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';

function ItemCardPublic({itemBasicUnitsNo, changeChartData, itemId, itemName, itemBrand, indexNo, itemCostBeforeTax, itemCostAfterTax, itemImage, whereBought, itemRetailPrice, itemCreator, itemShares, itemSharesAvailable}) {
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

    const handleOnChange = (e) => {

      const newOption = { label: inputValue, inputValue };

      inputValue !== '' && setSelection([...selection, newOption]);

      setInputValue('');

      setselectedValues(selection);

      changeChartData({itemId:itemId, quantity: e.value})

    };

    /*
    useEffect(() => {
      changeChartData(itemId);
    }, [checked]);
    */

    useEffect(() => {
      let theSelection=[]
      if(itemSharesAvailable>0){
        theSelection.push({ value: "0", label: "0" })
        for(const i = 1; i < itemSharesAvailable+1; i++){
          theSelection.push({ value: i.toString(), label: i.toString() })

        }
      }
      setSelection(theSelection)
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
    }, []);

    const toggleChange = () => {
      setChecked(value => !value);
      changeChartData(itemId)
    }



    return (
      <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

          <div className="rounded-xl w-[45vw] h-auto lg:w-[300px] lg:h-auto bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300">

            <div className="w-[45vw] h-auto lg:w-[300px] lg:h-auto rounded-xl flex flex-col item-center relative">
                <div className="flex flex-col items-center bg-white border-4 border-[#edeef2] rounded-xl shadow-inner pl-[15vw] lg:pl-[5vw]">
                  <img layout="responsive" src={itemImage} className="w-[30vw] h-[23vw] lg:w-[292px] lg:h-[160px] object-contain pt-[3px]"/>
                  <p className="px-[2px] bg-white border-[1px] border-[#f2f2f2] rounded text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black font-bold absolute top-[19vw] lg:top-[138px] left-[5px] lg:left-[6px]">{itemBrand}</p>
                </div>

                <div className="pl-[7px] flex flex-col items-left">
                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[10px] md:text-[10px] lg:text-[12px] xl:text-[15px]">{itemName && itemName}</p>

                  </div>


                    <div className="pt-[15px]">
                        <div className="text-gray-700 text-[8px] lg:text-[12px]">
                          Entire Item Listing Price:
                          <span className="text-black font-bold text-[9px] lg:text-[13px]">{itemRetailPrice && " $" + itemRetailPrice} </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-700 text-[8px] lg:text-[12px]">
                          Price/Unit:
                          <span className="text-black font-bold text-[9px] lg:text-[13px] text-[red]">{(itemRetailPrice/itemBasicUnitsNo).toFixed(2)}</span>
                        </div>
                    </div>


                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Splitting into:
                        <span className="text-[#009dcf] font-bold text-[9px] lg:text-[13px] text-[red]">{ " " + itemShares + " shares"}</span>
                        <div className="text-[#009dcf] text-[8px] lg:text-[11px] pl-[2px]">   ({(itemBasicUnitsNo/itemShares).toFixed(0)} unit(s)/share) </div>
                      </div>
                  </div>

                  <div className="flex flex-col items-start">
                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Price Per Share:
                        <span className="text-black font-bold text-[12px] lg:text-[16px] text-[red]"> ${(itemRetailPrice/itemShares).toFixed(2)} </span>
                      </div>
                  </div>

                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Available share(s):
                        <span className="font-bold text-[12px] lg:text-[16px] text-[#009dcf]"> {itemSharesAvailable}</span>
                      </div>
                  </div>
                  <div className="pt-2 lg:right-6 lg:bottom-6 flex flex-row items-center pb-[10px]">
                    <div className="font-bold block text-gray-700 text-[8px] lg:text-xs font-regular lg:pr-[5px]">
                      No. of Shares I am <br/>interested in:
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
                  </div>




                </div>



            </div>
          </div>




    </>
    )
}

export default ItemCardPublic
