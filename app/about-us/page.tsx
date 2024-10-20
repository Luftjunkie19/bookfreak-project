// pages/about.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Assuming Shadcn provides an Accordion component
import Image from 'next/image';

// Dummy data for the project history
const historyData = [
  {
    title: 'Project Start',
    description: 'Our project began with a simple idea of bringing people together.',
    imageUrl: '/images/history1.jpg',
  },
  {
    title: 'First Milestone',
    description: 'We reached our first milestone within six months, expanding our community significantly.',
    imageUrl: '/images/history2.jpg',
  },
  {
    title: 'Current Status',
    description: 'Today, we are proud to have thousands of users and a vibrant community.',
    imageUrl: '/images/history3.jpg',
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="py-10">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-6"
      >
        About Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-center text-gray-700 mb-8"
      >
        We are dedicated to building a platform that fosters community and collaboration. Our journey has been
        incredible, and we are excited to share our story with you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        {/* <Swiper spaceBetween={30} pagination={true} className="mySwiper">
          {historyData.map((item, index) => (
            <SwiperSlide key={index}>
              <Card isHoverable>
                <Card>
                  <Image src={item.imageUrl} alt={item.title} width={400} height={300} layout="responsive" />
                  <Text h4 className="mt-4">
                    {item.title}
                  </Text>
                  <Text>{item.description}</Text>
                </Card>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper> */}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-3xl font-semibold text-center mb-4"
      >
        Our History
      </motion.h2>


      <Accordion type="single" collapsible>
      {historyData.map((item, index) => (

<AccordionItem key={index} title={item.title} value={''}>
<AccordionTrigger>{item.title}</AccordionTrigger>
<AccordionContent>
<Image src={item.imageUrl} alt={item.title} width={400} height={300} className="mt-2" />
{item.description}
</AccordionContent>
</AccordionItem>
         
        ))}

</Accordion>
   
    </div>
  );
};

export default AboutUs;
