import React, { useRef, CSSProperties, Component } from "react";
import styles from "../styles/Home.module.css";
//import HeaderGame from "../components/HeaderGame"
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection"
//import AnnouncementBar from "../components/AnnouncementBar";
//import Displaygameinfo from "../components/Displaygameinfo"
//import Form1 from "../components/Form1";
//import Footer from "../components/Footer"
import useTranslation from "next-translate/useTranslation"
import Head from "next/head"
import { useRouter } from 'next/router'
import AddItem from "../components/AddItem";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useCSVReader } from 'react-papaparse';
import { usePapaParse } from 'react-papaparse';
import Header from "../components/Header";
import ReactDOM from 'react-dom'
import CSVReader from 'react-csv-reader'

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();
  const [itemsData, setItemsData] = useState([]);

  const handleItemsUpload = async () => {
    if(itemsData.length > 0 && true){
      for (const itemData of itemsData){

        let params = undefined
        params = {
          itemUrl: itemData[0],
          itemName: itemData[1],
          itemRefPrice: itemData[2],
          itemCode: itemData[3],
          itemRefImage: itemData[4]
        }
        console.log("params:" ,params)

        const CostcoItemData = Moralis.Object.extend("CostcoItemsDB");
        const costcoItemData = new CostcoItemData();

        costcoItemData
          .save(params)
          .then(
            (results) => {
              console.log("Submitted Results", results)
              // The object was saved successfully.
            },
            (error) => {
              // The save failed.
              // error is a Moralis.Error with an error code and message.
            }
          )

      }
    }
  }

    return (
      <>
      <Header/>
      <div className='pt-[100px] items-center flex flex-col'>
      Test Display Image from Outside
      <a href="http://farm3.staticflickr.com/2881/10000610654_fdf29eb02f_q.jpg" download="fileName.jpg">
        <img src="http://farm3.staticflickr.com/2881/10000610654_fdf29eb02f_q.jpg" alt="Smiley face" />
      </a>

      <div>
        <a href="https://images-qa.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=6262016-847&recipeName=680&viewId=1" download="new-image-name.jpg"> save image</a>
      </div>
      <img src="https://images-qa.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=6262016-847&recipeName=680&viewId=1" className = 'w-[150px] py-[100px]'/>
      <CSVReader onFileLoaded={(data, fileInfo, originalFile) => {
        setItemsData(data)
        console.dir(data, fileInfo, originalFile)}} />
      </div>
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
            <button className={styles.loginButton} type='button' onClick={handleItemsUpload}>
              Upload Items Data to DB!
            </button>
        </div>
      </div>
      </>
    )

}

export default Home
