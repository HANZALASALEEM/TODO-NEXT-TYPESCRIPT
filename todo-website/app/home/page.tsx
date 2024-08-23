"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("");
  const [date, setDate] = useState<any>("");
  const { data, error, isLoading } = useSWR(`/api/tasks`, fetcher);
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR(`/api/users`, fetcher);
  const handleTypePicker = (value: string) => {
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
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, taskType, date }),
      });

      if (response.status === 201) {
        mutate(`/api/tasks`);
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
          {userLoading ? (
            <p>Loading...</p>
          ) : userError ? (
            <p>Error loading user data</p>
          ) : user ? (
            <h1 className="text-2xl font-semibold px-3 py-3">
              {user.data.name}
            </h1>
          ) : (
            <p>No user data available</p>
          )}
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
              href={`/home?itemId=${item.id}`}
              className="w-full h-8 bg-white border-b-[1px] border-gray-300 pl-8 flex flex-row items-center justify-between"
            >
              <p key={item.id}>{item.title}</p>
              <div className="flex flex-row">
                <p className="text-gray-400">{item.date}</p>
                <Image
                  src="/images/right.png"
                  alt="right icon"
                  width={30}
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
