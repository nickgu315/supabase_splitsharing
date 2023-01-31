import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";
import { useDisclosure } from '@chakra-ui/react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function BlogPost1_Card({title, titleSpecial, paragraph, youSave, image, keyNo}) {
    const {isAuthenticated, Moralis} = useMoralis();


    return (
      <>
      <div className="w-full md:w-[600px] py-[10px] md:py-[20px] text-[13px] md:text-[16px] font-Quicksand font-bold">
      {keyNo}. &nbsp; {title} <span className='text-[#a30003]'> {titleSpecial} </span>
      </div>

      <div>
      <img src={image} className="w-[250px] md:w-[300px]" />
      </div>

      <div className="w-full md:w-[600px] py-[10px] md:py-[10px] text-[12px] md:text-[16px] font-Quicksand">
      {paragraph}
      </div>

      <div className="w-full md:w-[600px] pt-[1px] pb-[15px] md:pt-[2px] md:pb-[20px] text-[12px] md:text-[16px] font-Quicksand font-bold">
      <span className='text-[#a30003]'> {youSave} </span>
      </div>
    </>
    )
}

export default BlogPost1_Card
