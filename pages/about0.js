import React, { useRef } from "react";
import styles from "../styles/Home.module.css";
//import HeaderGame from "../components/HeaderGame"
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection"
//import AnnouncementBar from "../components/AnnouncementBar";
//import Displaygameinfo from "../components/Displaygameinfo"
//import Form1 from "../components/Form1";
import Footer from "../components/Footer"
import useTranslation from "next-translate/useTranslation"
import Head from "next/head"
import { useRouter } from 'next/router'
import AddItem from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import SharingList from "../components/SharingList";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();


  return (
    <>
      <Header/>
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-[300px] md:w-[600px] px-6 py-[100px] text-[22px] md:text-[45px] font-Quicksand text-left">
            Split Sharing is a Marketplace that lets people share bulk purchases or shopping trips to save money.
        </div>
      </div>

      <div className="items-center flex flex-col py-[1px] lg:py-[10px]">
        <div className='text-[20px] lg:text-[30px] font-Quicksand font-normal'>Team</div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center w-full pt-[20px] lg:pt-[40px] pb-[40px]" >
          <div className="my-[20px] lg:mx-[40px] w-[55vw] lg:w-[300px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
          ">
            <div>
              <img src="https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/00ba1d5872aa2cd3ef5a34035cba8db4_nickgu.png" className="w-[45vw] lg:w-[250px] pt-[25px]"/>
            </div>

            <div className="items-center flex flex-col pb-[25px]">
              <div className='text-[16px] pt-[5px] font-Quicksand font-bold'>Nick Gu</div>
              <div className='text-[16px] font-Quicksand'>Founder</div>
              <div className='text-[12px] pt-[5px] font-Quicksand'>Previously Co-Founder of Eone</div>
              <div className='text-[12px] font-Quicksand'>Full Stack Developer</div>
            </div>
          </div>

          <div className="my-[20px] lg:mx-[40px] w-[55vw] lg:w-[300px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
          ">
            <div>
              <img src="https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/6c4c925535e7f8d6c88eb074301a4015_jielulu.png" className="w-[45vw] lg:w-[250px] pt-[25px]"/>
            </div>

            <div className="items-center flex flex-col pb-[25px]">
              <div className='text-[16px] pt-[5px] font-Quicksand font-bold'>Jielu Lu</div>
              <div className='text-[16px] font-Quicksand'>Co-Founder</div>
              <div className='text-[12px] pt-[5px] font-Quicksand'>Registered Architect</div>
              <div className='text-[12px] font-Quicksand'>Harvard MArch, UCLA BA</div>
            </div>
          </div>
      </div>
      <Footer/>
    </>
  )
}

export default Home
