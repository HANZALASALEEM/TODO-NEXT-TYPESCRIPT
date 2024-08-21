"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Modal from "@/components/Modal/Modal";
import { Select, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import DetailComponent from "@/components/DetailComponent";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

const HomePage = () => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [title, setTitle] = useState<String>("");
  const [description, setDescription] = useState<String>("");
  const [taskType, setTaskType] = useState<String>("");
  const [date, setDate] = useState<any>("");
  const [userId, setUserId] = useState(session?.user?.id);
  const { data, error, isLoading } = useSWR(
    userId ? `/api/getTasks?id=${userId}` : null,
    fetcher
  );

  //   // Error handling
  //   if (error) return <div>Error loading tasks</div>;

  //   // Loading state
  //   if (isLoading) return <div>Loading...</div>;

  useEffect(() => {
    setUserId(session?.user?.id);
    console.log(data);
    console.log(userId);
    // const getTasks = async () => {
    //   try {
    //     const response = await fetch(`/api/getTasks?id=${userId}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (response.status === 200) {
    //       const data = await response.json();
    //       console.log(data);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    // getTasks();
  }, [session]);

  const handleTypePicker = (value: String) => {
    setTaskType(value);
  };

  dayjs.extend(customParseFormat);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
  const handleDatePicker = (value: any) => {
    const formattedDate = value.format("DD MMMM YYYY");
    setDate(formattedDate);
  };

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, taskType, date, userId }),
      });

      if (response.status === 201) {
        const data = await response.json();
        mutate(`/api/getTasks?id=${userId}`);
        alert("New Task Added In Database");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row">
      {/* Modal Component */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
          {/* container */}
          <div className="py-10 px-8 border-2 border-gray-300 rounded-xl">
            <h1 className="text-2xl mb-2 font-semibold">Add a new Task</h1>

            <form className="flex flex-col" onSubmit={handleAddTask}>
              <label className="text-sm font-semibold py-1">Title</label>
              <input
                type="text"
                className="rounded-sm border-2"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="text-sm font-semibold py-1">Description</label>
              <input
                type="text"
                className="rounded-sm border-2"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
              <label className="text-sm font-semibold py-1">Task Type</label>
              <Space wrap>
                <Select
                  defaultValue="Work"
                  style={{
                    width: 120,
                  }}
                  onChange={handleTypePicker}
                  options={[
                    {
                      value: "Personal",
                      label: "Personal",
                    },
                    {
                      value: "Work",
                      label: "Work",
                    },
                  ]}
                />
              </Space>
              <label className="text-sm font-semibold py-1">Date</label>
              <Space direction="vertical" size={12}>
                <DatePicker
                  defaultValue={dayjs("01/01/2024", dateFormatList[0])}
                  format={dateFormatList}
                  onChange={handleDatePicker}
                  required
                />
              </Space>

              <button
                className="bg-yellow-500 my-2 text-sm py-1 rounded-sm"
                type="submit"
              >
                Continue
              </button>
            </form>
          </div>
        </Modal>
      )}
      {/* Home Screen */}
      <div className=" w-full min-h-screen md:w-[60%] md:h-full">
        <div className="flex justify-between items-center px-7">
          <h1 className="text-2xl font-semibold px-3 py-3">
            {session?.user?.name}
          </h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
        {/* Add A Task Button */}
        <button
          className="w-full h-8 bg-white border-t-[1px] border-b-[1px] border-gray-300 px-8 flex flex-row items-center"
          onClick={() => setShowModal(true)}
        >
          <Image
            src="/images/plus.png"
            alt="add icon "
            width={22}
            height={22}
          />
          <p className="text-gray-400 px-1">Add a new Task</p>
        </button>
        {data &&
          data.data.tasks.map((item: any) => (
            <Link
              href={`/home?userId=${userId}&itemId=${item.id}`}
              className="w-full h-8 bg-white border-b-[1px] border-gray-300 pl-8 flex flex-row items-center justify-between"
            >
              <p key={item.id}>{item.title}</p>
              <div className="flex flex-row">
                <p className="text-gray-400">{item.date}</p>
                <Image
                  src="/images/right.png"
                  alt="right icon"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </div>
            </Link>
          ))}
      </div>
      {/* Detail Component */}
      <div className="w-full max-h-screen md:w-[40%] md:h-full py-4 px-4 ">
        <DetailComponent />
      </div>
    </div>
  );
};

export default HomePage;
