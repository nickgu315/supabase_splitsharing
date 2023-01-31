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
import BlogPost1_Card from "../components/BlogPost1_Card";
import SharingList from "../components/SharingList";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();

  const itemsData = [{title: "12-Count Butter Croissants - $5.99 or",
                      titleSpecial: "$0.50/count",
                      paragraph:  "Depending on where you live, Starbucks sells a Croissant for about $2.45/count. That is almost a 400% markup. If you are a Croissant enthusiast like us, get them from Costco! They taste just as good. The thing is, Croissants don’t last more than three days. After that, you could still reheat it in the oven, but it won’t taste as good. So find a friend or two to share. It would be all worth it!",
                      youSave:  "You save: $11.70/6pcs (if you are sharing 6pcs with others)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/80758a54731cfc5c7bc8a28bfec8b0aa_croisant_costco.jpeg",
                      keyNo: 1},

                      {title: "2-bottle of Nutella Hazelnut Spread with Cocoa, 33.5 oz. - $12.99 or",
                      titleSpecial: "$6.50/bottle",
                      paragraph:  "Ralphs is selling a 26.5oz bottle for $8.49. Wait, what? That’s 65% more expensive than what Costco offers. Well, the trick is it comes with a pack of 2. The bottles are extraordinarily more significant than what you would get from a typical retail store. If you aren’t super into baking, one bottle could last you quite a while. It also expires within a year and can not be refrigerated. So it wouldn’t make sense to buy two bottles if you live in a small household unless you could find someone to share the pack.",
                      youSave:  "You save: $4.2/bottle (adjusted to oz/bottle)! (if you are sharing 1 bottle with another person.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/83440321810276c17c8d75cb2a4e9989_Nutella%20Hazelnut%20Spread%20with%20Cocoa.jpeg",
                      keyNo: 2},

                      {title: "24-Count Nissin Cup Noodles - $7.79 or",
                      titleSpecial: "$0.32/count ",
                      paragraph:  "Vons sells one cup for $0.74, a 130% hike from Costco. Nissin Cup Noodles are always the perfect guilty pleasure encompassed in the small foam cups, but 24 cups seem way too much guilt one’s willing to take on, especially considering the number of preservatives in them. Well, if you could find a friend or two to share the 24 cups, they will make a great backup meal or two for those rainy days with less guilt.",
                      youSave:  "You save: $5/12counts (if you are sharing 12 counts with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/a0fd265294a9602e9025a45e1cf3b4ec_Nissin_01.webp",
                      keyNo: 3},

                      {title: "8-Count Garofalo Organic Spaghetti Made in Italy - $12.49 or",
                      titleSpecial: "$1.56/count",
                      paragraph:  "Truly delicious Spaghetti. Organic and made in Italy. Worth every penny. Amazon sells it for $26.99 - 116% more than Costco. It’s shareable. But honestly, I would just keep them to myself. Shush :)",
                      youSave:  "You Save: $7.25 (if you are sharing 4 counts with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/594b0aa784588557aa08fcd67303e260_Garofalo%20Organic%20Spaghetti%20Noodles.jpeg",
                      keyNo: 4},

                      {title: "2-Count Heinz Organic Tomato Ketchup - $9.39 or",
                      titleSpecial: "$4.7/count",
                      paragraph:  "Every household would have a bottle of Ketchup in the fridge. Walmart sells it for $19.68 - 109% more than what Costco offers. 2 bottles seem a bit overboard, although it goes well with the spaghettis.",
                      youSave:  "You Save: $5.15 (if you are sharing 1 bottle with another person.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/1a8b2547a0dadaa1f7c50f20b21a5352_Heinz%202packs.jpeg",
                      keyNo: 5},

                      {title: "3-Bottle of Clorox Performance Bleach 121oz. - $14.89 or",
                      titleSpecial: "$4.96/bottle",
                      paragraph:  "Home Depot sells same 3 packs for $21.87 - 47% more than what Costco offers by unit price. But let’s face it, three bottles of Clorox could probably last you for years and you probably can't use them up beyond the expiration date. So well, perfect purchase to share with someone else.",
                      youSave:  "You Save: $2.33/bottle (if you are sharing 2 bottles with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/b7a84fd396d149704521c5f01516b077_clorox_02.jpg",
                      keyNo: 6},

                      {title: "12-Roll of Bounty Advanced Paper Towels - $22.99 or",
                      titleSpecial: "$1.92/roll",
                      paragraph:  "Ralphs sells at $10.49 for 4 rolls - 37% more per roll than what Costco offers. Each roll is packed individually, which is perfect to share with others.",
                      youSave:  "You Save: $4.25/6rolls (if you are sharing 6 rolls with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/772ff411052a10cdf49e32ff1ee58190_Bounty_01.webp",
                      keyNo: 7},

                      {title: "5-Tub of Colgate Total Advanced Whitening Toothpaste 6.4oz - $15.89 or",
                      titleSpecial: "$3.18/tub",
                      paragraph:  "Walmart sells them for $24.95 - 57% more than what Costco offers.",
                      youSave:  "You Save: $3.6/2tubs (if you are sharing 3 tubs with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/ed6a7c944632d4f3741dcff16e6700f5_Colgate_02.webp",
                      keyNo: 8},

                      {title: "2-Jar of OLAY Vitamin C & Peptide 24 Advanced Moisturizer, 1.7oz - $46.49 or",
                      titleSpecial: "$23.26/jar",
                      paragraph:  "OLAY's official website sells each for $29.99/jar - 29% more than what Costco offers. OLAY claims its products have a shelf life of 2-3 years. It’s probably safe to keep both bottles in your medicine cabinet, but if you were me, who’s always curious about a new skincare product, buying two at once is too much of a commitment to make. Best to share!",
                      youSave:  "You Save: $6.73/jar (if you are sharing 1 jar with a friend.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/68933eec5cc4563c5ff25ad9ef984311_OLAY.webp",
                      keyNo: 9},

                      {title: "3-bottle Nexium 24HR Delayed Release Heartburn Relief Capsules - Esomeprazole Magnesium Acid Reducer, $23.69 or",
                      titleSpecial: "$7.90/bottle",
                      paragraph:  "Target sells one bottle for $10.49 - 33% more than what Costco offers. Each bottle of Nexium is a 14-day course. Nexium recommends repeating a 14-day regimen once every four months. A 3-bottle pack would last you at least one year, if not longer. Split it with others so you don’t risk wasting perfectly good medicine.",
                      youSave:  "You Save: $2.6/bottle (if you are sharing 2 bottle with others.)",
                      image: "https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/11ef6c749b79eaa578dc49e9c200defb_Nexium_01.webp",
                      keyNo: 10},
                    ]

  return (
    <>
      <Header/>
        <div className="flex flex-col items-center pt-[0px] md:pt-[40px] w-full justify-center px-[30px]" >
          <div className="flex flex-col items-center w-full md:w-[600px] pt-[80px] md:pt-[100px] text-[18px] md:text-[30px] font-Quicksand font-bold">
          10 Great Sharable Costco Items that Could Easily Save You Over $60
          </div>

          <div className="text-[#808080] w-full md:w-[600px] pt-[5px] md:pt-[100px] text-[10px] md:text-[15px] font-Quicksand font-bold text-left">
          by Jielu Lu <span className="text-[8px] md:text-[12px]">Aug 4, 2022 </span>
          </div>

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          While Costco has one of the lowest unit price products, many of us often spend more per trip to Costco than any other retail store. Costco products usually come in large quantities,
          so we buy more than we need to get the perks.
          </div>

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          Not to mention Costco’s membership price ranges from $60 to $120. While the warehouse store offers one of the lowest unit price products in the market,
          the membership fee doesn’t seem to justify for many of us who live in small households.
          </div>

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          Or does it?
          </div>

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          Although products come in bulk, Costco packs most of them individually for their small-business-owner customers to resell.
          It means if you could find a perfect Buddy, or two, to share your purchase, it will most definitely help you to save in the long run.
          </div>

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          Here are 10 great shareable products from Costco that could easily save you over $120 as a household or if you share with others:
          </div>



          {itemsData.map((card, index) => (
              <BlogPost1_Card key={index} {...card} />
          ))}

          <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[12px] md:text-[16px] font-Quicksand">
          As Inflation hits our wallets, most of us are tightening our purse strings. That’s why we developed <span className="font-bold">SplitSharing </span>to help people save a little extra. On <span className="font-bold">Split Sharing </span>, we match you with others nearby to split and share bulk purchases! It would save you the expense, improve your monthly cash flow, and avoid waste. Give us a try. We hope you will also experience the sheer joy of sharing, just as we do.

          <br/><br/>(Prices listed above are thoroughly researched and accurate at the time of writing. The listed Costco prices above are the in-store retail prices.)

          <br/><br/>(Online prices are around 10-20% higher than the retail stores. So when you get the chance, buying things from a physical Costco store is cheaper.)

          </div>


        </div>
      <Footer/>
    </>
  )
}

export default Home
