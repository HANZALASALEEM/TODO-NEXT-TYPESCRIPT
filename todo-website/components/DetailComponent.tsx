import React, { useEffect, useState, FormEvent } from "react";
import useSWR, { mutate } from "swr";
import { useSearchParams } from "next/navigation";
import { Select, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from "next/navigation";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

const DetailComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("");
  const [date, setDate] = useState<any>("");

  useEffect(() => {
    setUserId(searchParams.get("userId"));
    setItemId(searchParams.get("itemId"));
  }, [searchParams]);

  const { data, error, isLoading } = useSWR(
    userId && itemId
      ? `/api/getUniqueTask?userId=${userId}&itemId=${itemId}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
      setTaskType(data.data.taskType);
      setDate(dayjs(data.data.date).format("DD MMMM YYYY"));
    }
  }, [data]);

  const handleTypePicker = (value: string) => {
    setTaskType(value);
  };

  dayjs.extend(customParseFormat);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
  const handleDatePicker = (value: any) => {
    const formattedDate = value.format("DD MMMM YYYY");
    setDate(formattedDate);
  };

  const handleUpdateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/updateTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          taskType,
          date,
          userId,
          itemId,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        mutate(`/api/getTasks?id=${userId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(
        `/api/deleteTask?userId=${userId}&itemId=${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        mutate(`/api/getTasks?id=${userId}`);
        router.replace("/home");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-stone-200 w-full h-screen rounded-xl p-4 mb-2">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-200 w-full h-screen rounded-xl p-4 mb-2">
        <p className="text-2xl font-semibold">Error loading task details</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-stone-200 w-full h-screen rounded-xl p-4 mb-2">
        <p className="text-2xl font-semibold">Select a task to get details</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-200 w-full h-screen rounded-xl p-4 mb-2">
      <h1 className="text-2xl font-semibold">Task Details</h1>
      <form className="flex flex-col" onSubmit={handleUpdateTask}>
        <label className="text-xl font-semibold mt-8">Title</label>
        <textarea
          className="rounded-md border-2 max-h-20 min-h-14 bg-stone-200 border-stone-400 px-1 py-1 my-2"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        >
          {title}
        </textarea>
        <label className="text-xl font-semibold mt-8">Description</label>
        <textarea
          className="rounded-md border-2 max-h-28 min-h-14 bg-stone-200 border-stone-400 px-1 py-1 my-2 "
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        >
          {description}
        </textarea>
        <label className="text-xl font-semibold mt-8 mb-2">Task Type</label>
        <Space wrap>
          <Select
            value={taskType}
            style={{
              width: 150,
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
        <label className="text-xl font-semibold mt-8 mb-2">Date</label>
        <Space direction="vertical" size={12}>
          <DatePicker
            format={dateFormatList}
            onChange={handleDatePicker}
            required
            placeholder={date}
            value={dayjs(date, "DD MMMM YYYY")}
          />
        </Space>
        <div className="flex flex-row items-center justify-evenly mt-36 mb-20 gap-1">
          <button
            className="w-1/2 bg-red-500 my-2 text-sm md:text-md py-1 rounded-md"
            onClick={handleDeleteTask}
            type="button"
          >
            Delete Task
          </button>
          <button
            className="w-1/2 bg-yellow-500 my-2 text-sm md:text-md py-1 rounded-md"
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailComponent;
