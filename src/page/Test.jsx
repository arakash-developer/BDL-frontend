import { Button, Image } from "antd";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

const SpecificationItem = ({ title, items, data, sItemClass }) => {
  /**
   * @MirFaisal
   * এইখানে আমি, আগে চেক করছি যে ডাটা Array কি না। যদি Array হয় তাহলে
   * কোন কাজ করতে হবে না। আর যদি ডাঁটা স্ট্রিং হই তাহলে আমি এইখানে অই ডাঁটা কে কমা সেপারেত করছি। স্লপিট মেথড Array return করে।
   *
   */
  const procesedData = Array.isArray(data) ? "" : data?.split(",");
  return (
    <div className={` ${sItemClass} bg-[#d6cbb4] border  `}>
      <h2 className="px-1 text-[9px] bg-[#282828] mb-0.5 text-center uppercase font-bold text-[#e3e3e3] py-0.5 ">
        {title}
      </h2>
      <ul className="pl-1 text-black ">
        {Array.isArray(data)
          ? items.map((item, index) => (
              <p key={index} className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={data.includes(item)}
                  className="h-2 w-2 border bg-transparent appearance-none checked:bg-[#F15B26] rounded-full border-[#000000] checked:border-[#F15B26]"
                />
                <li className="text-[10px] leading-3" key={index}>
                  {item}
                </li>
              </p>
            ))
          : procesedData?.length > 0 &&
            procesedData[0] &&
            procesedData?.map((item, index) => (
              <p key={index} className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={item}
                  className="h-2 w-2 border bg-transparent appearance-none checked:bg-[#F15B26] rounded-full border-[#000000] checked:border-[#F15B26]"
                />
                <li className="text-[9px] leading-3" key={index}>
                  {item}
                </li>
              </p>
            ))}
      </ul>
    </div>
  );
};

const Test = () => {
  const [seletedproduct, setSeletedproduct] = useState([]);
  const [specification, setSpecification] = useState();
  const [productsToShow, setProductsToShow] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchSpecification();
  }, [seletedproduct]);

  useEffect(() => {
    fetchProductsToShow();
  }, [seletedproduct]);

  /**
   * @MirFaisal
   *
   * Fetches the product data from the backend and updates the state with the result.
   * If the request is successful, it sets the loading state to false.
   * If there is an error, it logs the error to the console.
   */
  const fetchProduct = async () => {
    try {
      const res = await axios.get("/products/" + id);
      // if (res.status === 200) setLoading(false);
      setSeletedproduct(res.data);
    } catch (error) {
      console.error("Error fetching the group data:", error);
    }
  };

  /**
   * @MirFaisal
   *
   * Fetches the products that should be shown on the page based on the sub-series or series of the currently selected product.
   * If the request is successful, it sets the productsToShow state with the result.
   * If there is an error, it logs the error to the console.
   */
  const fetchProductsToShow = async () => {
    try {
      const res = await axios.get(
        `/products/${seletedproduct?.subSeries ? "sub-series" : "series"}/${
          seletedproduct?.subSeries
            ? seletedproduct?.subSeries._id
            : seletedproduct?.series._id
        }`
      );
      if (res.status === 200) {
        setProductsToShow(res.data);
      }
    } catch (error) {
      console.error("Error fetching the group data:", error);
    }
  };

  /**
   * @MirFaisal
   *
   * Fetches the specifications of the currently selected product's series or sub-series.
   * If the request is successful, it sets the loading state to false and updates the specification state with the result.
   * If there is an error, it logs the error to the console.
   */
  const fetchSpecification = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/specifications/${
          seletedproduct.subSeries ? "sub-series" : "series"
        }/${
          seletedproduct.subSeries
            ? seletedproduct.subSeries._id
            : seletedproduct.series._id
        }`
      );
      if (res.status === 200) {
        setLoading(false);
        console.log(res.data[0]);
        setSpecification(res.data[0]);
      }
    } catch (error) {
      console.error("Error fetching the group data:", error);
    }
  };
  if (loading) {
    return <Preloader />;
  }
  return (
    <div className="h-screen pb-9 pt-0 bg-gray-100">
      <Navbar />
      {specification ? (
        <div className=" h-[97%] flex flex-col justify-between">
          <h2 className="bg-orange-600 p-1  uppercase text-gray-200 mt-1 mx-1 rounded text-center text-sm font-bold">
            Technical Perameter
          </h2>
          <div className="h-[44%] ">
            <div className="h-[100%] ">
              <div className="w-[100%] h-full   ">
                <div className="h-[100%] grid grid-cols-4">
                  <div className="col-span-3 grid grid-cols-3 gap-1 overflow-y-scroll no-scrollbar p-1">
                  {productsToShow?.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#8ac249] p-1 shadow-md rounded flex items-center justify-center"
                    >
                      <Image
                        src={`https://code.bdluminaries.com/${product.image}`}
                        className="!w-full !h-14 object-contain "
                      />
                    </div>
                  ))}
                  </div>
                  <div className="col-span-1  pt-1">
                  {specification?.dimming.length > 0 || specification?.thickness ? (
                <SpecificationItem
                  sItemClass="h-1/2 w-full"
                  title={
                    specification?.dimming.length > 0 ? "Dimming" : "Thickness"
                  }
                  data={
                    specification?.dimming.length > 0
                      ? specification?.dimming
                      : specification?.thickness
                  }
                  items={[
                    "Wireless 2.4g",
                    "0-10V",
                    "DALi",
                    "ZiGbee",
                    "Mash 5.0",
                    "DMX512",
                    "24VDC",
                    "+",
                  ]}
                />
              ) : (
                ""
              )}
              {specification?.cct.length > 0 || specification?.shape ? (
                <SpecificationItem
                  sItemClass="h-1/2 w-full"
                  title={specification?.cct.length > 0 ? "CCT" : "Shape"}
                  data={
                    specification?.cct.length > 0
                      ? specification?.cct
                      : specification?.shape
                  }
                  items={[
                    "8000K",
                    "7500K",
                    "6500K",
                    "5000K",
                    "4000K",
                    "3000K",
                    "2700K",
                    "2000K",
                    "+",
                  ]}
                />
              ) : (
                ""
              )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {specification && (
            <div className="h-[16%] bg-gray-100 flex justify-end ">
              <SpecificationItem
                sItemClass="h-full w-full"
                title={
                  specification?.mounting_array.length > 0
                    ? "Mounting"
                    : "Capacity"
                }
                data={
                  specification?.mounting_array.length > 0
                    ? specification?.mounting_array
                    : specification?.capacity
                }
                items={[
                  "Surface",
                  "Recessed",
                  "Base Plate",
                  "Pendant",
                  "F-Standing",
                  "+",
                ]}
              />

              <SpecificationItem
                sItemClass="h-full w-full"
                title={
                  specification?.rimColor.length > 0 ? "Rim Color" : "Protocol"
                }
                data={
                  specification?.rimColor.length > 0
                    ? specification?.rimColor
                    : specification?.protocol
                }
                items={["White", "Black", "Chrome", "Rose Gold", "+"]}
              />

              
              {specification?.bodyColor.length > 0 ||
              specification?.mounting ? (
                <SpecificationItem
                  sItemClass="h-full w-full"
                  title={
                    specification?.bodyColor.length > 0
                      ? "Body Color"
                      : "Mounting"
                  }
                  data={
                    specification?.bodyColor.length > 0
                      ? specification?.bodyColor
                      : specification?.mounting
                  }
                  items={["White", "Black", "Gold", "Chrome", "Rose Gold", "+"]}
                />
              ) : (
                ""
              )}
              {specification?.glare.length > 0 || specification?.finish ? (
                <SpecificationItem
                  sItemClass="h-full w-full"
                  title={
                    specification?.glare.length > 0 ? "Glare/UGI" : "Finish"
                  }
                  data={
                    specification?.glare.length > 0
                      ? specification?.glare
                      : specification?.finish
                  }
                  items={["Lens", "Parabolic", "Honeycomb", "+"]}
                />
              ) : (
                ""
              )}
            </div>
          )}
          {specification && (
            <div className="h-[16%] bg-gray-100 flex-row-reverse flex justify-end">
             {specification?.lumens.length > 0 && specification?.watts ? (
              <div className="w-full h-full bg-[#d6cbb4] flex flex-col justify-between">
              {specification?.lumens.length > 0 && (
                <SpecificationItem
                  sItemClass="w-full h-full"
                  title="lumens"
                  data={specification.lumens}
                  items={["110lm/W", "120lm/W", "130lm/W"]}
                />
              )}
              {specification?.watts.length > 0 && (
                <SpecificationItem
                  sItemClass="w-full h-full"
                  title="Watts"
                  data={specification.watts}
                  items={["1-10W", "11-20W", "21-30W"]}
                />
              )}
            </div>
             ):null} 





              {specification?.cri.length > 0 || specification?.dimention ? (
                <SpecificationItem
                  sItemClass="w-full"
                  title={specification?.cri.length > 0 ? "CRI" : "Dimention"}
                  data={
                    specification?.cri.length > 0
                      ? specification?.cri
                      : specification?.dimention
                  }
                  items={["<80", ">80", ">90", ">92", ">95", ">97", "+"]}
                />
              ) : (
                ""
              )}
              

              {specification?.beamAngle.length > 0 && (
                <SpecificationItem
                  sItemClass="w-full"
                  title="B-Angle"
                  data={specification.beamAngle}
                  items={["8D", "12D", "24D", "36D", "45D", "+"]}
                />
              )}

              <SpecificationItem
                sItemClass="w-full"
                title={specification?.ip.length > 0 ? "IP" : "Customization"}
                data={
                  specification?.ip.length > 0
                    ? specification?.ip
                    : specification?.customization
                }
                items={["20", "40", "65", "66", "67", "68", "+"]}
              />
            </div>
          )}
          {specification && (
            <div className="h-[20%] bg-slate-200 p-1">
              <div className="w-full h-[100%] flex justify-between flex-wrap">
                <h2 className="bg-orange-600 mb-2 w-full p-1 border-l border-t uppercase text-gray-200 rounded text-center text-sm font-bold">
                  Installation Guideline
                </h2>
                <div className="w-[49%] h-[70%] flex justify-center items-stretch overflow-hidden">
                  <Image
                    height="100%"
                    width="100%"
                    className="  object-cover rounded"
                    src={`https://code.bdluminaries.com/${specification?.image}`}
                    alt=""
                  />
                </div>
                <div className="w-[49%] h-full overflow-hidden flex justify-center items-start ">
                  <video
                    className="!w-full !h-[70%] object-cover rounded"
                    controls
                    autoPlay
                    loop
                    muted
                    src={`https://code.bdluminaries.com/${specification?.video}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen w-full flex-col flex justify-center items-center bg-gray-800 ">
          <p className="text-center px-3 text-yellow-300">
            No specification to show. Please contact with product manager to
            know information
          </p>
          <Button
            icon={<IoIosArrowBack />}
            onClick={() => history.back()}
            className="mt-3"
          >
            Back
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Test;
