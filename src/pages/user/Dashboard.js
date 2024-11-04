/* eslint-disable jsx-a11y/alt-text */
import { Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Feet from "../../assets/image/feet.png";
import LoadingSpinner from "../../component/Loading";
import Appbar from "../../component/Calendar";
import { Modal } from "antd";
import api from "../../utils/api";
import Login from "../auth/Login";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numcat, setNumcat] = useState(1);
  const [numcamera, setNumcamera] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [room_overlap, setRoom_overlap] = useState([]);
  const [loac2, SetLoad2] = useState(false);
  const [error, setError] = useState("");
  const [modal1Open, setModal1Open] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    api.getBooking().then((res) => {
      setBooking(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
    api.getRoom().then((res) => {
      setData(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let overlaping = booking.filter(({ check_in_date, check_out_date }) => {
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        (data.room_name === booking.room_name &&
          start >= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end <= checkOut) ||
        (start <= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end <= checkOut) ||
        (start >= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end >= checkOut) ||
        (start <= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end >= checkOut)
      );
    });

    let room_overlap = overlaping.reduce((acc, item) => {
      let found = acc.find((room) => room.room_name === item.room_name);
      if (found) {
        found.len_room += item.total_rooms;
      } else {
        acc.push({
          room_name: item.room_name,
          len_room: item.total_rooms,
        });
      }
      return acc;
    }, []);

    setRoom_overlap(room_overlap);
  }, [booking, data, numcat, numcamera, startDate, endDate]);

  const saveToLocalStorage = (index) => {
    localStorage.setItem("data", JSON.stringify(data[index]));
    JSON.parse(localStorage.getItem("data"));
  };

  const handleTimeChange = (e) => {
    setNumcat(e.numcat);
    setNumcamera(e.numcamera);
    setStartDate(e.startDate);
    setEndDate(e.endDate);
  };

  const checkroom = (room_name) => {
    for (let i = 0; i < room_overlap.length; i++) {
      if (room_overlap[i].room_name === room_name) {
        return room_overlap[i].len_room;
      }
    }
  };

  let handle_login = (e) => {
    setModal1Open(e);
    if (e) {
      SetLoad2(e);
      setTimeout(() => {
        SetLoad2(!e);
      }, 1000);
    } else {
      SetLoad2(e);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-center" data-aos="fade-up">
        <Appbar handleAppbar={(e) => handleTimeChange(e)} />
      </div>
      <Modal
        style={{ top: 20 }}
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
        loading={loac2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">เข้าสู่ระบบ</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5 h-5" alt="feet" />
            <p className="text-sm">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Login handleAppbar={(e) => handle_login(e)} />
        </div>
      </Modal>

      {data.map((item, index) => (
        <div key={index} className="w-full">
          <div
            className={`${index % 2 === 0 ? "bg-[#B6D4F0]" : "bg-[#f2f4f6]"} 
                        flex flex-col lg:flex-row p-7 items-center justify-center lg:align-middle w-full`}
          >
            <div
              className="rounded-lg px-4 py-5 w-full lg:w-10/12"
              data-aos="fade-up"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="col-span-2 flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 overflow-hidden w-full">
                  <div className="w-full lg:w-96">
                    <img
                      className="rounded-lg scale-95 object-cover border-gray-400 border-4 w-full"
                      src={`${item.image[0]}`}
                      alt={item.room_name}
                    />
                  </div>

                  <div className="w-full">
                    <p className="opacity-45 font-extralight text-sm lg:text-base">CoCoCat Hotel</p>
                    <h2 className="text-2xl lg:text-3xl font-bold">{item.room_name}</h2>
                    <div className="mt-5 space-y-3 lg:space-y-5">
                      <div className="flex space-x-4">
                        <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                        <p className="text-sm lg:text-base">สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว</p>
                      </div>
                      <div className="flex space-x-4">
                        <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                        <p className="text-sm lg:text-base">จำนวนน้องแมว {item.number_of_cats} ตัว</p>
                      </div>
                      <div className="flex space-x-4">
                        <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                        <p className="text-sm lg:text-base">
                          มีห้องว่างทั้งหมด{" "}
                          {checkroom(item.room_name) >= 0
                            ? `${Math.max(item.number_of_rooms - checkroom(item.room_name), 0)}`
                            : `${item.number_of_rooms}`}{" "}
                          ห้อง
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                        <p className="text-sm lg:text-base break-words">{item.description}</p>
                      </div>
                      <div className="w-full lg:w-52 h-12 lg:h-14 text-lg lg:text-xl text-black bg-[#e8f773] hover:bg-[#f4f0af] flex rounded-full items-center text-center justify-center">
                        <p className="font-semibold">{item.price} บาท /คืน</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bottom-0 justify-end items-end flex h-full lg:h-96 mt-4 lg:mt-0">
                  <span></span>
                  <div className="w-full lg:w-52 h-12 lg:h-14 text-lg lg:text-xl text-white bg-[#16305C] hover:bg-[#224683] flex rounded-full items-center text-center justify-center mt-4">
                    {localStorage.getItem("token") ? (
                      <Link to={`/detail/${item.type}`}>
                        <button
                          className="w-full h-full font-semibold"
                          onClick={() => saveToLocalStorage(index)}
                        >
                          จองที่พัก
                        </button>
                      </Link>
                    ) : (
                      <button
                        className="w-full h-full font-semibold"
                        onClick={() => setModal1Open(true)}
                      >
                        จองที่พัก
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
