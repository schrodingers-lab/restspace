import { Carousel } from "react-responsive-carousel";

export const RestAreaCarousel = (restarea) => {
  if(restarea?.images == undefined || restarea?.images == null || restarea?.images == []) return;
  const restAreaImages = JSON.parse(restarea?.images);

  console.log("restAreaImages",restAreaImages)
  return (
    <Carousel showArrows={true} >
      {
        restAreaImages?.map((image, index) => {
          console.log('image',  image, index)
          return (
            <div key={index}>
              <img src={image} alt="rest area image" />
            </div>
          );
        })
      }
  </Carousel>
  );
}
    
  export default RestAreaCarousel;