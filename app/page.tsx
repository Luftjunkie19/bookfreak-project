
import HeroSection from 'components/home/HeroSection';
import classes from '../stylings/gradient.module.css'
import BookSwiper from 'components/home/swipers/BookSwiper';
import CompetitionSwiper from 'components/home/swipers/CompetitionSwiper';
import ClubSwiper from 'components/home/swipers/ClubSwiper';

import Subscriptions from 'components/home/Subscriptions';



export default function Home() {
  return (
    <div className={`min-h-screen w-full `}>
      <HeroSection />
      <BookSwiper />
      <CompetitionSwiper />
      <ClubSwiper />
      <Subscriptions/>
    </div>
  );
}
