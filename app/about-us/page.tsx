'use client';


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
import HeroSection from 'components/home/HeroSection';
import WhatIsSection from 'components/about/WhatIsSection';
import SolutionSection from 'components/about/SolutionSection';
import ExcelSection from 'components/about/ExcelSection';
import AccordionSection from 'components/about/AccordionSection';
import SliderSection from 'components/about/SliderSection';

function AboutUs() {
  const { next, prev, current, total } = useSteps();
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

;
  return (
    <div className={`min-h-screen flex flex-col gap-6 h-full w-full p-6 ${isDarkModed ? "text-white" : "text-black"}`}>
      <HeroSection />
      <WhatIsSection />
      <SolutionSection />
      <ExcelSection />
      <AccordionSection />

      <SliderSection/>
 
    </div>
  );
}

export default AboutUs;
