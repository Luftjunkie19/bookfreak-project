import '../stylings/backgrounds.css';
import '../stylings/scrollbarStyling.css';
import 'react-image-gallery/styles/css/image-gallery.css';

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
  from '../../assets/lottieAnimations/Animation - 1702680446031.json';
import breakImg2 from '../../assets/ProjectHistory/Screenshot (1167).png';
import breakImg1 from '../../assets/ProjectHistory/Screenshot (1174).png';
import difficultiesImage1
  from '../../assets/ProjectHistory/Zrzut ekranu (1128).png';
import aboutUsTranslations
  from '../../assets/translations/aboutUsTranslations.json';

function AboutUs() {
  const { next, prev, current, total } = useSteps();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
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
    (state) => state.languageSelection.selectedLangugage
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
    <div className={`min-h-screen h-full w-full overflow-x-hidden pattern-bg ${isDarkModed ? "text-white" : "text-black"}`}>
      <div className="w-full flex justify-center items-center py-8">
        <div className="sm:w-full lg:max-w-[96rem] flex flex-wrap sm:justify-start lg:justify-around sm:items-center lg:items-start lg:gap-12 py-6">
          <motion.div
            className="w-72 h-72 self-center p-4 group relative top-0 left-0"
            transition={{ duration: 0.75, bounce: 0.3, stiffness: 50 }}
            initial={{
              y: -100,
              x: -150,
              opacity: 0,
              scale: 0.25,
              rotate: -270,
            }}
            animate={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
          >
            <img
              className="w-full h-full rounded-full object-cover"
              src={myImage}
              alt=""
            />
          </motion.div>
          <div className="justify-self-end self-start md:max-w-xl gap-2 flex flex-col">
            <motion.div
              transition={{ duration: 0.5, delay: 0.75 }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-bold  px-1"
            >
              <Typewriter words={[aboutUsTranslations.aboutSection.TopText[selectedLanguage]]} loop={1} />
            </motion.div>
            <motion.p
              transition={{ duration: 0.5, delay: 1.25 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className=" p-2"
            >
           {aboutUsTranslations.aboutSection.description[selectedLanguage]}
            </motion.p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-around sm:flex-wrap xl:flex-nowrap items-center">
        <motion.div
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          className="flex sm:w-full lg:w-64 xl:w-80 flex-col gap-4 p-4 rounded-lg bg-blue-500"
        >
          <div className="flex justify-between items-center">
                    <GiBull className=" text-7xl text-white" />
           <motion.div
            variants={typingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <CountUp
              className="font-bold text-6xl rounded-full stat-title text-white p-4"
              start={0}
              end={Math.round(
                (new Date().getTime("31.12.2023") - new Date("02.15.2023").getTime()) /
                  1000 /
                  60 /
                  60 /
                  24 /
                  30
              )}
            />
          </motion.div>
  
     </div>

     
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className="font-semibold  text-lg p-2 text-white"
          >
            {aboutUsTranslations.ThreeBoxes.first[selectedLanguage]}
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          className="flex flex-col sm:w-full lg:w-64 xl:w-80 gap-4 p-4 rounded-lg bg-white text-accColor"
        >

          <div className="flex justify-between items-center">
          <SiFuturelearn className=" text-7xl" />

          <motion.div
            variants={typingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <CountUp
              className="font-bold text-6xl rounded-full p-4"
              start={0}
              end={1000}
            />
          </motion.div>
          </div>
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className=" font-semibold text-lg  p-2"
          >
            {aboutUsTranslations.ThreeBoxes.second[selectedLanguage]}
          </motion.p>
        </motion.div>
         <motion.div
          className="flex flex-col sm:w-full lg:w-64 xl:w-80 gap-4 p-4 rounded-lg bg-primeColor "
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center">
          <ImBooks className=" text-7xl text-white" />
          <motion.div
            variants={typingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <CountUp
              className="font-bold text-6xl rounded-full p-4 text-white"
              start={0}
              end={23}
            />
          </motion.div>
          </div>
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className=" font-semibold text-lg p-2 text-white"
          >
             {aboutUsTranslations.ThreeBoxes.third[selectedLanguage]}
          </motion.p>
        </motion.div> 
      </div>

      <Steps>
        <motion.div
          className="flex flex-col gap-4 px-2"
          initial="offscreen"
          whileInView="onscreen"
          variants={mainHolderVariant}
          viewport={{ once: true }}
        >
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={iconVariant}
            viewport={{ once: true }}
            className="self-center justify-self-center"
          >
            <TbCircleNumber1 className="text-6xl text-yellow-300" />
          </motion.div>

          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={typingTextVariant}
            className=" font-bold text-4xl self-center justify-self-center"
          >
            <Typewriter words={[aboutUsTranslations.steps.first.header[selectedLanguage]]} />
          </motion.div>
          <div className="w-full flex 2xl:justify-evenly flex-wrap gap-6">
            <div className="flex flex-col gap-2 max-w-xl self-center">
              <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
                viewport={{ once: true }}
                className=" text-4xl font-bold"
              >
              {aboutUsTranslations.steps.first.sideHeader[selectedLanguage]}
              </motion.p>
              <motion.div
                transition={{ delay: 0.5, duration: 0.5 }}
                className="sm:w-full md:max-w-3xl flex flex-wrap"
              >
                <motion.span
                  viewport={{ once: true }}
                  className=""
                  initial="offscreen"
                  whileInView="onscreen"
                  variants={descriptionVariant}
                >
                 {aboutUsTranslations.steps.first.sideDescription[selectedLanguage]}
                </motion.span>
              </motion.div>
            </div>

            
<div className="carousel sm:w-full max-w-xl h-80">
  <div id="slide1" className="carousel-item relative w-full h-full">
    <img alt='' src={logoImage} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide4" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide2" className="carousel-item relative w-full h-full">
    <img alt='' src={myImage} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide3" className="carousel-item relative w-full h-full">
    <img alt='' src={breakImg2} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle">❮</a> 
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide4" className="carousel-item relative w-full h-full">
    <img alt='' src={breakImg1} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div>
</div>
  
 
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          variants={mainHolderVariant}
          viewport={{ once: true }}
          className="flex flex-col px-2"
        >
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={iconVariant}
            className="self-center justify-self-center"
            viewport={{ once: true }}
          >
            <TbCircleNumber2 className="text-6xl text-yellow-300" />
          </motion.div>

          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={typingTextVariant}
            viewport={{ once: true }}
            className=" font-bold text-4xl self-center"
          >
            <Typewriter words={[aboutUsTranslations.steps.second.header[selectedLanguage]]} />
          </motion.div>

          <div className="flex w-full 2xl:justify-evenly flex-wrap gap-2 p-3">
            <div className="sm:w-full md:max-w-2xl self-center flex flex-col gap-4">
              <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
                viewport={{ once: true }}
                className="text-4xl font-bold"
              >
                {aboutUsTranslations.steps.second.sideHeader[selectedLanguage]}
              </motion.p>
              <motion.span
                className=""
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={descriptionVariant}
              >
                {aboutUsTranslations.steps.second.sideDescription[selectedLanguage]}
              </motion.span>
            </div>


<div className="carousel sm:w-full max-w-xl h-80">
  <div id="slide1" className="carousel-item relative w-full h-full">
    <img alt='' src={difficultiesImage1} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div> 
 
</div>
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          variants={mainHolderVariant}
          viewport={{ once: true }}
          className="flex flex-col px-2"
        >
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={iconVariant}
            className="self-center"
            viewport={{ once: true }}
          >
            <TbCircleNumber3 className="text-6xl text-yellow-300" />
          </motion.div>
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={typingTextVariant}
            viewport={{ once: true }}
            className=" font-bold text-4xl self-center"
          >
            <Typewriter words={[aboutUsTranslations.steps.third.header[selectedLanguage]]} />
          </motion.div>
          <div className="flex flex-wrap w-full 2xl:justify-evenly items-center gap-3 p-2">
            <div className="max-w-2xl flex flex-col gap-2">
              <motion.p
                className=" text-4xl font-bold"
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
              >
                {aboutUsTranslations.steps.third.sideHeader[selectedLanguage]}
              </motion.p>
              <motion.span
                className=""
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={descriptionVariant}
              >
                {aboutUsTranslations.steps.third.sideDescription[selectedLanguage]}
              </motion.span>
            </div>

      
 <div className="carousel sm:w-full max-w-xl h-80">
  <div id="slide1" className="carousel-item relative w-full h-full">
    <img alt='' src={breakImg1} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide2" className="carousel-item relative w-full h-full">
    <img alt='' src={breakImg2} className="w-full h-full object-cover" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div> 

</div>


         
          </div>
        </motion.div>
      </Steps>
      <div className="flex justify-center items-center py-4 gap-5">
        {current !== 1 && (
          <button onClick={prev} className="bg-accColor btn text-white">
            <FaArrowLeft />
            Prev
          </button>
        )}

        {current !== total && (
          <button className="bg-accColor btn text-white" onClick={next}>
            Next
            <FaArrowRight />
          </button>
        )}
      </div>

      <div className="flex w-full items-center justify-around">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          variants={mainHolderVariant}
          viewport={{ once: true }}
          className="max-w-[110rem] flex flex-wrap items-center justify-around p-2"
        >
          <div className="max-w-xl flex flex-col gap-2">
            <motion.p
              className=" font-bold text-3xl"
              initial="offscreen"
              whileInView="onscreen"
              variants={headingTextVariant}
              viewport={{ once: true }}
            >
              {aboutUsTranslations.reasonForProject.header[selectedLanguage]}
            </motion.p>
            <motion.p
              className=""
              initial="offscreen"
              whileInView="onscreen"
              variants={descriptionVariant}
              viewport={{ once: true }}
            >
             {aboutUsTranslations.reasonForProject.description[selectedLanguage]}
            </motion.p>
          </div>

          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={descriptionVariant}
            viewport={{ once: true }}
          >
            <Lottie animationData={lottieAnimation} className="max-w-md" />
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        variants={mainHolderVariant}
        viewport={{ once: true }}
        initial="offscreen"
        whileInView="onscreen"
        className="w-full flex flex-wrap justify-center items-center p-3"
      >
        <div className="sm:w-full lg:w-[90vw] flex flex-wrap lg:justify-around gap-3">
          <motion.img
            initial="offscreen"
            whileInView="onscreen"
            variants={firstImageVariant}
            viewport={{ once: true }}
            src={logoImage}
            className="w-60 h-60 object-cover rounded-md"
            alt=""
          />
          <div className="max-w-lg flex flex-col gap-2">
            <motion.p
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={headingTextVariant}
              className="text-4xl  font-semibold"
            >
                 {aboutUsTranslations.firstLogoSection.header[selectedLanguage]}
            </motion.p>
            <motion.p
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={descriptionVariant}
              className=" text-lg"
            >
               {aboutUsTranslations.firstLogoSection.description[selectedLanguage]}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutUs;
