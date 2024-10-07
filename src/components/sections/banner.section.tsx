import r1 from '@/assets/banner/r1.jpg'
import r2 from '@/assets/banner/r2.jpg'
import banner_1 from '@/assets/banner/banner_1.jpg'
import banner_2 from '@/assets/banner/banner_2.jpg'
import banner_3 from '@/assets/banner/banner_3.jpg'
import banner_4 from '@/assets/banner/banner_4.jpg'
import LayoutWapper from '../warper/layout.wrapper'
import Slider from "react-slick";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear",
  
  };

  return (
      <section className="w-full">
        <div className="flex rounded items-center gap-2">
          <div className="w-3/4 rounded">
            <div className="slider-container md:max-h-[300px] max-sm:h-[125px] rounded">
              <Slider {...settings}>
                  <img className='min-w-full object-cover md:h-[300px] max-sm:h-[125px]  rounded'  src={banner_1} alt={r1} />
                  <img className='min-w-full object-cover md:h-[300px] max-sm:h-[125px]  rounded' src={banner_2} alt={r1} />
                  <img className='min-w-full object-cover md:h-[300px] max-sm:h-[125px]  rounded' src={banner_3} alt={r1} />
                  <img className='min-w-full object-cover md:h-[300px] max-sm:h-[125px]  rounded' src={banner_4} alt={r1} />
              </Slider>
            </div>
          </div>
          <div className="w-1/4 nd:h-[300px] max-sm:h-[125px] rounded flex items-center flex-col gap-1">
            <img className='w-full rounded md:min-h-[148px] max-sm:h-[64px] object-cover' src={r1} alt={r1} />
            <img className='w-full rounded md:min-h-[148px] max-sm:h-[64px] object-cover' src={r2} alt={r1} />
          </div>
        </div>
      </section>
  )
}

export default Banner
