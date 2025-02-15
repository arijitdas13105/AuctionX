import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BASE_URL } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

function ExploreCategories() {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items/categories`);
      const categoryData = response?.data?.data;
      setAllCategories(categoryData);
      console.log(categoryData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categoryImages = {
    Electronics:
      "https://blog.adobe.com/en/publish/2021/03/02/media_188ed8740da44ae27380511d57fe31fed9c971a24.png?width=750&format=png&optimize=medium",
    Furniture:
      "https://www.mobelhomestore.com/cdn/shop/files/helbrp.jpg?v=1703153580",
    Books:
      "https://i0.wp.com/apeejay.news/wp-content/uploads/2023/10/281023-10-most-read-books-Feature.jpg?fit=569%2C509&ssl=1",
    Clothing:
      "https://cdn.shopify.com/s/files/1/0070/7032/files/how_20to_20start_20a_20clothing_20brand.png?v=1693935729",
      Accessories:
      "https://i0.wp.com/fashion2apparel.com/wp-content/uploads/2023/10/Fashion-Accessories.jpg?fit=600%2C400&quality=100&ssl=1",
    Clothing2:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNGXmVmKMupNca5NrMEckYMcfWBcf1KI8tRw&s",
      Kitchenware:
      "https://media.istockphoto.com/id/1184868790/photo/kitchen-utensils-dark-background-with-cast-iron-black-kitchenware.jpg?s=612x612&w=0&k=20&c=hNT5GhTveFKjU_qxykhdRJF4-j-e344J-Yo5JydQsaE=",
      Instruments:
      "https://www.sweetwater.com/sweetcare/media/2024/05/Instrument-Care-Basics-for-Beginners-featured-image.jpg",
      Gaming:
      "https://www.bluent.com/images/wher-are-we-going.webp",
      Stationery:
      "https://www.dollarsense.au/cdn/shop/collections/pexels-yan-krukov-8613062_1.jpg?v=1653070463",
      Sports:
      "https://pain-cakes.com/cdn/shop/articles/The_Most_Popular_Sports_in_America_Header_1500x.jpg?v=1723474780",
      Miscellaneous:
      "https://mixed-reality.co.za/wp-content/uploads/2024/08/exploring-how-mr-is-offering-new-gaming-experiences-that-blend-physical-and-digital-elements.jpg",
  };
 
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className=" px-3 mt-5    ">
      <h2 className="font-bold text-xl mb-4">Explore Categories</h2>
      <Carousel
        responsive={responsive}
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={2000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
      >
        {allCategories.map((category) => {
          const categoryImage =
            categoryImages[category.name] || "default-image-url.jpg";

          return (
            <div
              key={category.id}
              className="  relative group w-full h-40 overflow-hidden rounded-lg px-3 "
              onClick={() => navigate(`/category/${category.id}`)}
            >
              {/* Category Image */}
              <img
                src={categoryImage}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-md "
              />
              {/* Overlay with Category Name */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white font-bold text-lg">
                  {category.name}
                </span>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default ExploreCategories;
