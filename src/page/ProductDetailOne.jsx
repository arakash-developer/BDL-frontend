import { Button, Form, Image, Input, Modal, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "../axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function ProductDetailOne() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { authUser, login } = useContext(AuthContext);
  const [form] = Form.useForm();
  // const handleToggle = () => {
  //   setIsItemVisible(!isItemVisible);
  // };

  let navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedSeries, setSelectedSeries] = useState([]);
  const [subSeries, setSubSeries] = useState([]);
  const [productsToShow, setProductsToShow] = useState([]);
  const [seriseID, setSeriseID] = useState();
  const [subSeriesID, setSubSeriesID] = useState();
  const [displayedProduct, setDisplayedProduct] = useState({});
  const [refaranceImageAndVideo, setRefaranceImageAndVideo] = useState({
    image: [],
    video: [],
  });
  const [seletedImage, setSeletedImage] = useState();
  const [seletedVideo, setSeletedVideo] = useState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    await login(values);
    setIsModalVisible(false); // Close the modal after login
    form.resetFields();
  };

  // Fetch series data
  useEffect(() => {
    bdlSeries();
    fetchRecentWorks();
    getSubSerises();
  }, []);

  // Fetch products based on series ID
  useEffect(() => {
    if (seriseID) {
      getProductsBySeries(seriseID);
    }
    fetchRecentWorks();
  }, [seriseID]);

  // Fetch products based on sub-series ID
  useEffect(() => {
    if (subSeriesID) {
      console.log(subSeriesID);
      getProductsBySubSeries(subSeriesID);
    }
    fetchRecentWorks();
  }, [subSeriesID]);

  const bdlSeries = async () => {
    try {
      let res = await axios.get(`/series/group/${id}`);
      const seriesByGroupId = res.data;
      setSelectedSeries(seriesByGroupId);
      //for sub serise
      if (!searchParams.get("series")) {
        setSearchParams({ series: seriesByGroupId[0]._id });
      }

      if (seriesByGroupId.length > 0) {
        setSeriseID(searchParams.get("series"));
        getProductsBySeries(
          searchParams.get("series") || seriesByGroupId[0]._id
        );
      }
    } catch (error) {
      console.error("Error fetching the series data:", error);
    }
  };

  const getSubSerises = async () => {
    try {
      let res2 = await axios.get("/sub-series");
      setSubSeries(res2.data);
    } catch (error) {
      console.error("Error fetching the sub-series data:", error);
    }
  };

  // Fetch products based on series ID
  const getProductsBySeries = async (seriesId) => {
    setLoading(true);
    try {
      let res = await axios.get(`/products/series/${seriesId}`);

      if (res.status === 200) {
        setLoading(false);
      }
      const products = res.data;
      setProductsToShow(products);

      // Automatically set the first product as the displayed product if available
      if (products.length > 0) {
        setDisplayedProduct({
          id: products[0]._id,
          series: products[0].series.name,
          itemCode: products[0].itemCode,
          image: `https://code.bdluminaries.com/${products[0].image}`,
          price: products[0].price,
          description: products[0].description || "No description available.",
        });
      } else {
        setDisplayedProduct(null);
      }
    } catch (error) {
      console.error("Error fetching the products:", error);
    }
  };
  const getProductsBySubSeries = async (subSeriesID) => {
    setLoading(true);
    try {
      let res = await axios.get(`/products/sub-series/${subSeriesID}`);
      console.log(res.data);
      if (res.status === 200) {
        setLoading(false);
      }
      const products = res.data;
      setProductsToShow(products);

      // Automatically set the first product as the displayed product if available
      if (products.length > 0) {
        setDisplayedProduct({
          id: products[0]._id,
          series: products[0].series.name,
          itemCode: products[0].itemCode,
          image: `https://code.bdluminaries.com/${products[0].image}`,
          price: products[0].price,
          description: products[0].description || "No description available.",
        });
      } else {
        setDisplayedProduct(null);
      }
    } catch (error) {
      console.error("Error fetching the products:", error);
    }
  };

  const fetchRecentWorks = async () => {
    try {
      let res = await axios.get("/recent-works");
      if (res.status === 200) {
        const recentWorks = res.data.filter((item) =>
          item.series.includes(searchParams.get("series"))
        );
        const recentWorksWithImage = recentWorks.flatMap((item) => {
          return item.images.map(
            (image) => `https://code.bdluminaries.com/${image}`
          );
        });
        const recentWorksWithVideo = recentWorks.flatMap((item) => {
          return item.videos.map((video) => {
            return {
              video: `https://code.bdluminaries.com/${video.video}`,
              thumbnail: `https://code.bdluminaries.com/${video.thumbnail}`,
            };
          });
        });
        setRefaranceImageAndVideo({
          video: [...recentWorksWithVideo],
          image: [...recentWorksWithImage],
        });
      }
    } catch (error) {
      console.error("Error fetching recent works:", error);
    }
  };

  /**
   * Handles product click event by updating the displayed product state with the clicked product's data
   * @param {Object} product The product object containing the series name, item code, image, price, and description
   */
  const handleProductClick = (product) => {
    setDisplayedProduct({
      id: product._id,
      series: product.series.name,
      itemCode: product.itemCode,
      image: `https://code.bdluminaries.com/${product.image}`,
      price: product.price,
      description: product.description || "No description available.",
    });
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="w-full h-[40%] flex items-center justify-center">
          <Spin spinning={loading} size="large" />;
        </div>
      );
    }
    return (
      <section className="h-[40%]">
        <div className="grid grid-cols-5 items-start w-full gap-1 pr-1 no-scrollbar overflow-y-scroll h-full">
          {productsToShow.length > 0 ? (
            productsToShow.map((product, i) => (
              <div
                key={i}
                className="bg-[#8ac249] p-1 shadow-md rounded"
                onClick={() => {
                  console.log(product);
                  handleProductClick(product);
                }}
              >
                <img
                  src={`https://code.bdluminaries.com/${product.image}`}
                  className="w-full h-11 object-contain"
                  alt={product?.itemCode || "Product image missing"}
                />
              </div>
            ))
          ) : (
            <p className="text-[#777777] text-sm font-semibold col-span-5 h-full flex items-center justify-center">
              This series product is not available
            </p>
          )}
        </div>
      </section>
    );
  };

  if (!selectedSeries || selectedSeries.length === 0) {
    return <Preloader />;
  }

  return (
    <div className="bg-green-100 h-screen flex flex-col">
      <Navbar />
      <header className="flex gap-1 h-[48%] mt-1">
        <div className="w-[20%] flex flex-col gap-y-1">
          <h2 className="text-xs font-bold text-center uppercase bg-[#f15b26] text-white py-0.5 rounded-r">
            {selectedSeries[0]?.group?.name}
          </h2>
          <div className="flex flex-col gap-1 pl-1 no-scrollbar overflow-y-scroll h-[100%]">
            {selectedSeries.map((item) => (
              <div
                key={item._id}
                className="shadow-md rounded bg-[#8ac249] cursor-pointer"
                onClick={() => {
                  setSeriseID(item._id);
                  setSearchParams({ series: item._id });
                }} // Update products when clicked
              >
                <img
                  src={`https://code.bdluminaries.com/${item.image}`}
                  className="w-full h-11 object-contain"
                  alt={item.Title}
                />
                <div className="text-[8px] tracking-widest font-semibold text-center bg-[#1d1d1d] text-white uppercase py-1">
                  <h3 className="-mt-0.5">{item.name}</h3>
                </div>

                {/* Sub-series section */}
                <div className="px-2">
                  {subSeries
                    .filter((sub) => sub.series._id === item._id) // Filter sub-series for this series
                    .map((subItem) => (
                      <div
                        onClick={() => {
                          console.log("bodys");
                        }}
                        key={subItem._id}
                        className="flex flex-col my-1 border"
                      >
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubSeriesID(subItem._id);
                            setSearchParams({ subSeries: subItem._id });
                          }}
                          src={`https://code.bdluminaries.com/${subItem.image}`}
                          className="w-full h-11 object-contain"
                          alt={subItem.series.name}
                        />
                        <h3 className="text-[8px] tracking-widest font-semibold text-center bg-[#ff702e] text-[#000000] uppercase py-1 -mt-0.5 rounded-sm leading-none">
                          {subItem.name}
                        </h3>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[80%] flex flex-col gap-1">
          <div className="h-[60%] bg-[#8bc24a] relative grid grid-rows-6 grid-cols-8 rounded-ss">
            <div className="col-span-7 row-span-5 flex justify-center items-center">
              {displayedProduct ? (
                <img
                  onClick={() => navigate(`/test/${displayedProduct?.id}`)}
                  className="h-full w-full object-contain"
                  src={displayedProduct.image}
                  alt={displayedProduct.itemCode}
                />
              ) : (
                <p className="text-[yellow] text-sm font-semibold">
                  This series product is not available
                </p>
              )}
            </div>
            <div
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              className="border-l border-[#ffffff60] col-span-1 row-span-5  flex flex-col items-center justify-center"
            >
              <h2 className="text-white font-semibold text-sm">
                {displayedProduct?.series}
              </h2>
            </div>
            <div className="p-0.5 shadow-lg backdrop-filter border border-black/10 border-r-0 border-opacity-30 col-span-8 grid grid-cols-4 gap-0.5 text-[10px]">
              <div>
                <p className="bg-black h-1/2 text-[#cc3903] font-bold flex justify-center items-center">
                  ART#
                </p>
                <p className="bg-white h-1/2 text-[#cc3903] text-[8px] font-bold flex justify-center items-center">
                  {displayedProduct?.itemCode}
                </p>
              </div>
              <div className="bg-white col-span-2 overflow-y-scroll no-scrollbar">
                <p className="text-gray-800 font-bold text-left px-0.5 leading-tight text-[8px]">
                  {displayedProduct?.description}
                </p>
              </div>
              <div
                onClick={() => {
                  if (!authUser?.user) {
                    setIsModalVisible(true);
                  }
                }}
              >
                <p className="bg-black h-1/2 text-[#cc3903] font-bold flex justify-center items-center">
                  MRP
                </p>
                <p className="bg-white h-1/2 text-[#cc3903] font-bold flex gap-1 justify-center items-center cursor-pointer">
                  <span className="text-sm -mt-0.5">৳</span>{" "}
                  {authUser?.user ? displayedProduct?.price : <IoEyeOff />}
                </p>
              </div>
            </div>
          </div>
          {renderProducts()}
        </div>
      </header>

      <main className="flex-1 mt-2 no-scrollbar overflow-x-scroll h-[48%]">
        <section className="h-full">
          <div className="h-[91%] flex flex-col gap-y-1">
            <div className="grid grid-cols-5 grid-rows-3 gap-1 h-1/2">
              <div className="bg-slate-500 col-span-4 row-span-3 relative rounded-r-lg overflow-hidden flex flex-col">
                <h2 className="text-xs font-bold z-10 text-center uppercase bg-[#F15B26] pl-3 text-white py-0.5 absolute w-full left-0 top-0">
                  Reference Photo
                </h2>
                <div className="w-full overflow-hidden h-full">
                  <Image
                    width="100%"
                    height="100%"
                    className="w-full object-cover"
                    src={seletedImage || refaranceImageAndVideo?.image[0]}
                    alt=""
                  />
                </div>
              </div>
              {/* image navigate */}
              <div className="overflow-y-scroll space-y-1 h-full row-span-3">
                {refaranceImageAndVideo?.image?.map((item) => (
                  <div
                    key={item}
                    className="bg-slate-400 rounded-l-md overflow-hidden"
                    onClick={() => setSeletedImage(item)}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={item}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/*  */}
            <div className="grid grid-cols-5 grid-rows-3 gap-1 h-1/2">
              {/* image navigate */}
              <div className="overflow-y-scroll space-y-1 h-full row-span-3">
                {refaranceImageAndVideo?.video?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-400 rounded-md overflow-hidden"
                    onClick={() => {
                      setSeletedVideo(item);
                    }}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={item?.thumbnail}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-slate-500 col-span-4 row-span-3 relative rounded-l-lg overflow-hidden flex flex-col">
                <h2 className="text-xs font-bold z-10 text-center uppercase bg-[#F15B26] pl-3 text-white py-0.5 absolute w-full left-0 top-0">
                  Reference Video
                </h2>
                <div className="w-full rounded overflow-hidden h-full">
                  <video
                    loading="lazy"
                    className="w-full h-full object-cover"
                    src={
                      seletedVideo?.video ||
                      refaranceImageAndVideo?.video[0]?.video
                    }
                    alt=""
                    muted
                    controls
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        title="User Login"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Remove the default footer buttons
      >
        {/* Login Form */}
        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={handleLogin}
          maskChanging={false}
        >
          {/* Email Input */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          {/* Password Input */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductDetailOne;
