'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import React from 'react';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import CountUp from 'react-countup';
import {
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { GiBull } from 'react-icons/gi';
import { ImBooks } from 'react-icons/im';
import { SiFuturelearn } from 'react-icons/si';
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { Typewriter } from 'react-simple-typewriter';
import {
  Steps,
  useSteps,
} from 'react-step-builder';

import myImage from '../../assets/about-image.jpg';
import logoImage from '../../assets/Logo.png';
import lottieAnimation
  from '../../assets/lottieAnimations/Astronaut-Reading.json';
import breakImg2 from '../../assets/ProjectHistory/August.png';
import breakImg1 from '../../assets/ProjectHistory/September2.png';
import difficultiesImage1
  from '../../assets/ProjectHistory/March.png';
import aboutUsTranslations
  from '../../assets/translations/aboutUsTranslations.json';
import Image from 'next/image';


function AboutUs() {
  
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const mainHolderVariant = {
    offscreen: { y: 100, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
      },
    },
  };
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const iconVariant = {
    onscreen: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        type: "spring",
        bounce: 0.5,
      },
    },
    offscreen: {
      opacity: 0,
      scale: 0.1,
    },
  };

  const typingTextVariant = {
    onscreen: { x: 0, opacity: 1 },
    offscreen: { x: 100, opacity: 0 },
  };

  const headingTextVariant = {
    onscreen: { transition: { delay: 0.5 }, opacity: 1 },
    offscreen: { opacity: 0 },
  };

  const descriptionVariant = {
    onscreen: { x: 0, opacity: 1, transition: { delay: 0.75 } },
    offscreen: {
      x: -100,
      opacity: 0,
    },
  };

  const firstImageVariant = {
    onscreen: { y: 0, opacity: 1, transition: { delay: 0.75 } },
    offscreen: { y: 100, opacity: 0 },
  };

  const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

;
  return (
    <div className={`min-h-screen flex flex-col gap-6 h-full w-full p-6 ${isDarkModed ? "text-white" : "text-black"}`}>
     <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
 
    </div>
  );
}

export default AboutUs;
