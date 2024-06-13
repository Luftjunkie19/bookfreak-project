
import HeroSection from 'components/home/HeroSection';
import classes from '../stylings/gradient.module.css'
import BookSwiper from 'components/home/swipers/BookSwiper';



export default function Home() {
  return (
    <div className={`min-h-screen w-full bg-secondary-color ${classes['dark-blue-gradiented']}`}>
<HeroSection/>
<BookSwiper/>
    </div>
  );
}
