export const settingsSlider = {
  dots: false,
  className: "center",
  infinite: true,
  speed: 3000,
  rows: 2,
  slidesPerRow: 1,
  slidesToShow: 5,
  autoplaySpeed: 5000,
  autoplay: true,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 1530,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
}
