import '../stylings/backgrounds.css';
import '../stylings/scrollbarStyling.css';

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
import { Typewriter } from 'react-simple-typewriter';
import {
  Steps,
  useSteps,
} from 'react-step-builder';

import myImage from '../../assets/about-image.jpg';
import logoImage from '../../assets/Logo.png';
import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1702680446031.json';
import begginingImage1 from '../../assets/ProjectHistory/another.png';
import breakImg2 from '../../assets/ProjectHistory/Screenshot (1167).png';
import breakImg1 from '../../assets/ProjectHistory/Screenshot (1174).png';
import difficultiesImage1
  from '../../assets/ProjectHistory/Zrzut ekranu (1128).png';
import begginingImage3 from '../../assets/ProjectHistory/Zrzut_ekranu_983.png';
import begginingImage2 from '../../assets/ProjectHistory/Zrzut_ekranu_999.png';

function AboutUs() {
  const { next, prev, current, total } = useSteps();

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

  const secondImageVariant = {
    onscreen: { y: 0, opacity: 1, transition: { delay: 1 } },
    offscreen: { y: 100, opacity: 0 },
  };

  const thirdImageVariant = {
    onscreen: { y: 0, opacity: 1, transition: { delay: 1.25 } },
    offscreen: { y: 100, opacity: 0 },
  };
  return (
    <div className="min-h-screen h-full w-full overflow-x-hidden pattern-bg">
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
              className="text-4xl font-bold text-white px-1"
            >
              <Typewriter words={["Hello And Welcome"]} loop={1} />
            </motion.div>
            <motion.p
              transition={{ duration: 0.5, delay: 1.25 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-white p-2"
            >
              My name is Łukasz, I'm 19 years old and I created BookFreak,
              because something was missing for me in the books industry. There
              were some book's forums etc. However it was not that, what I was
              looking for. I initialized this project in February 2023, however
              the work on it not always was possible. Because of complications,
              I had at school, because I wanted to develop this project and also
              because of my mental collapse at some point.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap">
        <motion.div
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          className="sm:w-full lg:w-1/3 sm:h-screen md:h-[50vh] bg-accColor text-white flex flex-col justify-center items-center gap-3"
        >
          <GiBull className=" text-7xl" />

          <motion.div
            variants={typingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <CountUp
              className="font-bold text-6xl rounded-full p-4"
              start={0}
              end={Math.round(
                (new Date().getTime() - new Date("02.15.2023").getTime()) /
                  1000 /
                  60 /
                  60 /
                  24 /
                  30
              )}
            />
          </motion.div>
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className=" font-semibold text-2xl text-center p-2"
          >
            Months of struggling
          </motion.p>
        </motion.div>
        <motion.div
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          className="sm:w-full lg:w-1/3 sm:h-screen md:h-[50vh] flex gap-3 flex-col justify-center items-center bg-white text-accColor"
        >
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
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className=" font-semibold text-2xl text-center p-2"
          >
            Of hours of acquiring knowledge from tutorials
          </motion.p>
        </motion.div>
        <motion.div
          className="sm:w-full lg:w-1/3 flex flex-col justify-center items-center sm:h-screen md:h-[50vh] bg-primeColor text-white gap-3"
          variants={mainHolderVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <ImBooks className=" text-7xl" />
          <motion.div
            variants={typingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <CountUp
              className="font-bold text-6xl rounded-full p-4"
              start={0}
              end={23}
            />
          </motion.div>
          <motion.p
            variants={headingTextVariant}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            className=" font-semibold text-2xl text-center p-2"
          >
            Books, I have read since I stopped being stupid (23.06.2022)
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
            className="text-white font-bold text-4xl self-center justify-self-center"
          >
            <Typewriter words={["The Very Beginnings"]} />
          </motion.div>
          <div className="w-full flex 2xl:justify-evenly flex-wrap gap-6">
            <div className="flex flex-col max-w-xl self-center">
              <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
                viewport={{ once: true }}
                className="text-white text-2xl font-bold"
              >
                When it all started?
              </motion.p>
              <motion.div
                transition={{ delay: 0.5, duration: 0.5 }}
                className="sm:w-full md:max-w-3xl flex flex-wrap"
              >
                <motion.span
                  viewport={{ once: true }}
                  className="text-white"
                  initial="offscreen"
                  whileInView="onscreen"
                  variants={descriptionVariant}
                >
                  The has been initialized on 15.02.2023, I've been typing the
                  every line of CSS-code by my own, here are the results. It
                  won't be a lie that you would not use BookFreak, if it would
                  stay like that, would you?
                </motion.span>
              </motion.div>
            </div>
            <div className="flex flex-wrap gap-4 sm:justify-around max-w-[90rem]">
              <motion.img
                initial="offscreen"
                whileInView="onscreen"
                variants={firstImageVariant}
                viewport={{ once: true }}
                className=" w-64 h-42 object-cover"
                src={begginingImage1}
                alt=""
              />{" "}
              <motion.img
                initial="offscreen"
                whileInView="onscreen"
                variants={firstImageVariant}
                viewport={{ once: true }}
                className=" w-64 h-42 object-cover"
                src={begginingImage2}
                alt=""
              />
              <motion.img
                initial="offscreen"
                viewport={{ once: true }}
                whileInView="onscreen"
                variants={thirdImageVariant}
                className=" w-64 h-42 object-cover"
                src={begginingImage3}
                alt=""
              />
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
            className="text-white font-bold text-4xl self-center "
          >
            <Typewriter words={["The Difficulties"]} />
          </motion.div>

          <div className="flex w-full 2xl:justify-evenly flex-wrap gap-4 p-3">
            <div className="sm:w-full md:max-w-2xl flex flex-wrap">
              <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
                viewport={{ once: true }}
                className="text-white text-2xl font-bold"
              >
                What was wrong?
              </motion.p>
              <motion.span
                className="text-white"
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={descriptionVariant}
              >
                Unfortunetely, every bigger project has his own struggles, it
                has to face with. The same was in my case I struggled at school
                and I had a classification test after vacation in order to pass
                the class. I did pass, but it had an enormous impact on the
                state of my app. Even I contemplated, if I shouldn't shut it
                just up and give up with coding. But after all, there was kinda
                breakthough 😮
              </motion.span>
            </div>

            <div className="flex flex-wrap gap-4 sm:justify-center lg:justify-start max-w-6xl px-3">
              <motion.img
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={firstImageVariant}
                className="w-80 h-42 object-cover"
                src={difficultiesImage1}
                alt=""
              />
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
            className="text-white font-bold text-4xl self-center"
          >
            <Typewriter words={["BreakThrough"]} />
          </motion.div>
          <div className="flex flex-wrap w-full 2xl:justify-evenly gap-3 p-2">
            <div className="max-w-2xl flex flex-col gap-2">
              <motion.p
                className="text-white text-2xl font-bold"
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={headingTextVariant}
              >
                What happened?
              </motion.p>
              <motion.span
                className="text-white"
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={descriptionVariant}
              >
                Finally, after 3 months break, i've got the spirit to work and
                continue this project. You have to admit, that the Interface
                looks much better here, doesn't it?
              </motion.span>
            </div>

            <div className="flex flex-wrap gap-4 sm:justify-center lg:justify-start max-w-6xl px-3">
              <motion.img
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={firstImageVariant}
                className="w-80 h-42 object-cover"
                src={breakImg1}
                alt=""
              />
              <motion.img
                viewport={{ once: true }}
                initial="offscreen"
                whileInView="onscreen"
                variants={secondImageVariant}
                className="w-80 h-42 object-cover"
                src={breakImg2}
                alt=""
              />
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
              className="text-white font-bold text-3xl"
              initial="offscreen"
              whileInView="onscreen"
              variants={headingTextVariant}
              viewport={{ once: true }}
            >
              Why have I decided to create this project?
            </motion.p>
            <motion.p
              className="text-white"
              initial="offscreen"
              whileInView="onscreen"
              variants={descriptionVariant}
              viewport={{ once: true }}
            >
              I decided to create this project, not only because I thought about
              my future portfolio as a developer, but I also wanted to
              revolutionize an outdated industry. This project contains tests,
              books, competitions, chats, clubs, money. Everything in one place.
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
              className="text-4xl text-white font-semibold"
            >
              First Logo
            </motion.p>
            <motion.p
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={descriptionVariant}
              className="text-white text-lg"
            >
              It is worth to emphasize, that I'm not great at graphics and so
              forth. That's why I had to create our first logo by the means of
              Intenet. That one appealed to me, thus it's like that for now. How
              do you rate it?
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutUs;
