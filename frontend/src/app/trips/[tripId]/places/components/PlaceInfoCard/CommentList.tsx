import React, { useEffect, useRef, useState } from "react";
import { HeartFilled } from "@ant-design/icons"; // 用於顯示評分的圖示
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { FavoriteRate } from "./FavoriteRate";
import { Avatar, Slider, Switch } from "antd";
import "./../../styles.css";

const tripMemberData = [
  {
    id: 8,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocKM9eaA-2AsYaAG4VYo0Yd555L6de_jnja_7x24alyBzDBb6G9A=s96-c",
    nickname: "Rex",
    role: "CREATOR",
  },
  {
    id: 12,
    avatar: null,
    nickname: "Eva",
    role: "EDITOR",
  },
  {
    id: 15,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocI73v1mYLFYs3JYTVnisqZ6ZZOJGP6OsJ28QubQ8M5aADeoQF4A-Q=s96-c",
    nickname: "Eeeva",
    role: "VIEWER",
  },
];

const apiComments = [
  {
    id: 1,
    tripMemberId: 8,
    comment: "旁邊的ㄘㄨㄚˋ冰很好吃",
    rate: 5,
    isOwner: true,
  },
  {
    id: 2,
    tripMemberId: 12,
    comment: "我不想去.....",
    rate: null,
    isOwner: false,
  },
  {
    id: 3,
    tripMemberId: 15,
    comment: "上面去吃大便啦",
    rate: 3,
    isOwner: false,
  },
];

const getTripMember = (tripMemberId: number) => {
  return tripMemberData.find((member) => member.id === tripMemberId);
};

type CommentType = {
  id: number;
  tripMemberId: number;
  comment: string;
  rate: null | number;
  isOwner: boolean;
};

interface CommentProps extends CommentType {
  onRateChange: (value: number) => void;
}
const Comment = ({ onRateChange, ...comment }: CommentProps) => {
  const [showSlider, setShowSlider] = useState(false);
  const isEditing = useRef(false);
  const [rate, setRate] = useState(comment.rate ?? 0);

  const tripMember = getTripMember(comment.tripMemberId);
  const { avatar, nickname } = tripMember || {
    avatar: null,
    nickname: "Unknown",
  };

  const handleFinish = () => {
    onRateChange(rate);
    isEditing.current = false;
    setShowSlider(false);
  };

  useEffect(() => {
    if (!isEditing.current) return;
    document.addEventListener("mouseup", handleFinish);
    return () => {
      document.removeEventListener("mouseup", handleFinish);
    };
  }, [rate]);

  return (
    <div className="mb-4 flex items-center">
      <Avatar
        className="mr-3 border border-[#AE9A9A]"
        size={24}
        icon={nickname[0].toUpperCase()}
        src={avatar}
      />

      <div className="flex w-full items-center justify-between">
        <span className="text-xs text-gray-600">{comment.comment}</span>
        {showSlider && comment.isOwner ? (
          <div
            className="flex items-center gap-2"
            onMouseLeave={() => !isEditing.current && setShowSlider(false)}
          >
            <Slider
              className="my-0 w-12"
              min={1}
              max={5}
              step={1}
              defaultValue={rate}
              onChange={setRate}
              styles={{ track: { backgroundColor: "#E77F6C" } }}
              onFocus={() => {
                isEditing.current = true;
              }}
              onBlur={() => {
                onRateChange(rate);
                isEditing.current = false;
                setShowSlider(false);
              }}
            />
            <div className="mr-1 text-[12px] text-primary">{rate}</div>
          </div>
        ) : (
          <div
            onMouseEnter={() => {
              setShowSlider(true);
            }}
          >
            <FavoriteRate iconSize={16} rating={comment.rate} />
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentList = () => {
  const [rate, setRate] = useState(
    apiComments.filter(({ isOwner }) => isOwner)[0].rate,
  );

  return (
    <div className="comment-list">
      {apiComments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            {...comment}
            rate={comment.isOwner ? rate : comment.rate}
            onRateChange={setRate}
          />
        );
      })}
    </div>
  );
};
