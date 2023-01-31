import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
//import Logo from "../Assets/MoralisLogo.png";
import { useState } from "react";
import { Magic } from 'magic-sdk';
import Link from "next/link";
import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import mixpanel from 'mixpanel-browser';
import { useRouter } from "next/router"
// or with require() syntax:
// const mixpanel = require('mixpanel-browser');



const animation = { duration: 5000, easing: t => 1 + --t * t * t * t * t * t * t * t * t * t * t}


export default function SignIn() {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCostBeforeTax, setItemCostBeforeTax] = useState('');
  const [itemCostAfterTax, setItemCostAfterTax] = useState('');
  const [itemImage, setItemImage] = useState(undefined);
  const [itemReceipt, setItemReceipt] = useState(undefined);
  const [authenticatingStage, SetAuthenticatingStage] = useState(0);
  const [myIsAuth, SetMyIsAuth] = useState(true);
  const [authMsg, SetAuthMsg] = useState("Authenticating");
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');



  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    created(s) {
      s.moveToIdx(1, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation)
    },
  })

  const keySubmit=(event)=> {
        if (event.keyCode === 13) {
            handleCustomLogin()
        }
    }


  const reRoute = () => {
      router.push({
                      pathname: '/shoppingTrips',
                  });
      return
  }

  const testFunction0 = () => {
      if(authenticatingStage==0){
        SetAuthenticatingStage(1)
        setTimeout(() => {
          console.log("Delayed for 1 second.");
        }, "1000")
        return true
      }
      return false
  }

  const testFunction1 = () => {
      if(authenticatingStage==1 && authMsg == "Authenticating"){
        SetAuthenticatingStage(2)
        SetAuthMsg("Redirecting")
        console.log("authenticatingStage", authenticatingStage)
        return true
      }
      return false
  }



  const alertMessageData = (arg) => {
    console.log("SetAuthenticatingStage", arg)
    SetAuthenticatingStage(arg)
    };

  const AuthenticatingMsgChange = ({authenticatingStage, alertMessageData}) => {
    if (authenticatingStage == 0) {
      console.log("authenticatingStage", authenticatingStage)
      alertMessageData(1)
    }
    if (authenticatingStage == 1) {
      console.log("authenticatingStage", authenticatingStage)
      alertMessageData(2)
    }
    return(
      <div>test
      </div>
    )

  }




  const handleCustomLogin = async () => {
    // Enabling the debug mode flag is useful during implementation,
    // but it's recommended you remove it for production
    mixpanel.init('ecfbebd0dee663b9febeb60279292c37', {debug: true});
    mixpanel.track('Sign up or Login');
    await authenticate({
      provider: "magicLink",
      email: email,
      apiKey: "pk_live_FCB9E5A10B0BA86D",
      network: "kovan",
    }).then(
      async (signInObj) => {
        console.log("signInObj", signInObj)
        const m = new Magic('pk_live_FCB9E5A10B0BA86D');
        ////const idToken = await m.user.getIdToken();
        const metadata = await m.user.getMetadata()
        ////console.log("idToken", idToken)
        //console.log("email", metadata.email)
        //console.log("signInObj from Moralis", signInObj)
        //console.log("signInObj email from Moralis", signInObj.attributes.email)
        if (metadata.email && signInObj.attributes.email==null){
          //console.log("bind email")
          signInObj.set("email", metadata.email);
          await signInObj.save();
        }
        const params = {test: "test"}
        const results = await Moralis.Cloud.run("sendEmailToUser", params)

        reRoute()
        //userObj.set("email", metadata.email);
        //await userObj.save();

        /*
        moralisUser
          .save({
            email: metadata.email,
          })
          .then(
            (results) => {
              // The object was saved successfully.
            },
            (error) => {
              // The save failed.
              // error is a Moralis.Error with an error code and message.
            }
          )*/


      }
    );
  };


  return (
    <div className="flex flex-col items-center pt-[80px] lg:pt-[60px]">





        <div className="flex flex-col items-center">
            <div className="invisible lg:visible w-full h-full">
              <img layout="responsive" src="/landing_image_2c.png" className="translate-y-[-30px]"/>
            </div>

            <div className="visible lg:invisible absolute w-full h-full">
              <img layout="responsive" src="/landing_image_2c_mobile.png" className="translate-y-[-30px]"/>
            </div>

            {!isAuthenticated && (
            <div className="flex flex-col items-center h-full z-10 lg:pt-[2vw] absolute hidden">
              <img layout="responsive" src="/SpliSharing_Logo4.png" className="w-[25vh] lg:w-[20vw]"/>
            </div>
            )}

            <div className="absolute lg:absolute pl-0 lg:pl-[300px] flex flex-col items-center lg:items-start lg:flex-col w-[90vw] lg:w-[1500px] pt-[6vw] lg:pt-[7vw]">
              <div>
                <p className="font-bold text-[20px] md:text-[20px] lg:text-[30px] text-[#F1592A] w-[280px] lg:w-[900px] font-Quicksand text-center lg:text-left pr-0 lg:pr-[10px] z-10">
                Split & Share
                <br /> Shopping Trips
                <br /> or Bulk Purchases
                </p>
              </div>
              <div ref={sliderRef} className="keen-slider">
                <div className="keen-slider__slide number-slide1 text-[20px] lg:text-[30px] text-center lg:text-left">with people who <br/> live Near You!</div>
                <div className="keen-slider__slide number-slide2 text-[20px] lg:text-[30px] text-center lg:text-left">with Friends!</div>
                <div className="keen-slider__slide number-slide3 text-[20px] lg:text-[30px] text-center lg:text-left">with Neighbors!</div>
              </div>
            </div>


            <div className="lg:pl-[65vw] pt-[45vw] md:pt-[35vw] lg:pt-[28vw] flex flex-col items-center z-10 absolute">



            {!isAuthenticated && (
                <div className="pt-[20px] lg:pt-0 lg:px-10 w-[180px] lg:w-[240px] xl:w-[300px]">
                    {isAuthenticating &&

                      <div>
                        <div ref={sliderRef} className="keen-slider">
                          <div className="keen-slider__slide number-slide1 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Authenticating...</div>
                          <div className="keen-slider__slide number-slide2 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Authenticating...</div>
                          <div className="keen-slider__slide number-slide3 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Authenticating...</div>
                          <div className="keen-slider__slide number-slide4 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Redirecting...</div>
                          <div className="keen-slider__slide number-slide5 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Redirecting...</div>
                          <div className="keen-slider__slide number-slide6 block text-[#F1592A] text-lg font-bold text-center font-Quicksand">Redirecting...</div>
                        </div>
                      </div>
                      }
                    {authError && (
                      <p className={styles.error}>{JSON.stringify(authError.message)}</p>
                    )}
                    {!isAuthenticating &&
                      <div className={styles.buttonCard}>
                        <input
                          type={"email"}
                          onKeyDown={(e) => keySubmit(e) }
                          className="border-2 border-[#F1592A] rounded-xl mb-5 w-full h-11 py-2 px-3 text-gray-700 font-bold font-Quicksand"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />

                          <button className={styles.loginButton} onClick={handleCustomLogin}>
                            Sign Up or Login
                          </button>

                      </div>

                    }
                </div>
                )}
            </div>
        </div>

    </div>
  );
}
