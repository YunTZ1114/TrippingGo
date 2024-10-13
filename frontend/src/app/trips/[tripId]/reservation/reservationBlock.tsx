import { Reservation } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import dayjs from "dayjs";
import { mappingTagValue, TagType } from "../constants";
import { Collapse, CollapseProps, Divider } from "antd";
import { useState } from "react";
import { MarkdownPreview } from "@/components";

export const ReservationBlock = ({
  reservation,
}: {
  reservation: Reservation;
}) => {
  const items: CollapseProps["items"] = [
    {
      collapsible: "icon",
      key: "1",
      extra: (
        <div className=" flex items-center gap-1 text-primary">
          <MaterialSymbol icon="edit" size={24} />
          <MaterialSymbol icon="content_copy" size={24} />
          <MaterialSymbol icon="delete" size={24} />
        </div>
      ),
      label: (
        <div className="px-3 rounded-lg pt-[60px]">
          <div className="absolute left-3 bottom-3 flex gap-2">
            <div className="bg-primary flex items-center justify-center text-xs px-2 py-1 rounded-full shadow-md text-white">
              時間：
              {dayjs(reservation.reservationTime).format("YYYY-MM-DD hh:mm")}
              {reservation.endTime &&
                ` ~ ${dayjs(reservation.endTime).format("YYYY-MM-DD hh:mm")}`}
            </div>
            <div
              className="flex items-center justify-center text-xs px-2 py-1 rounded-full shadow-md text-white"
              style={{ background: "#F0BF38" }}
            >
              人數： {reservation.amount} 人
            </div>
            <div
              className="flex items-center justify-center text-xs px-2 py-1 rounded-full shadow-md text-white"
              style={{ background: "#80A927" }}
            >
              # {mappingTagValue[reservation.type as TagType]}
            </div>
          </div>
        </div>
      ),
      children: (
        <>
          <div>
            <div className="flex items-center px-2">
              <MaterialSymbol
                icon="error"
                size={16}
                fill
                className="text-red-500"
              />
              <div className="px-1 text-label-medium font-bold ">注意事項</div>
            </div>
            <div className="flex items-center pt-2">
              <MarkdownPreview className="px-2 text-xs">
                {reservation.note}
              </MarkdownPreview>
            </div>
          </div>

          <div>
            <div className="flex items-center px-2 pt-3 mt-2">
              <MaterialSymbol
                icon="chat_bubble"
                size={16}
                className="text-gray-400"
              />
              <div className="px-1 text-label-mediums font-bold">描述</div>
            </div>
            <div className="flex items-center  pt-2">
              <MarkdownPreview className="px-2 text-xs">
                {reservation.description}
              </MarkdownPreview>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Collapse
      expandIcon={({ isActive }) => (
        <div className="flex items-center gap-2">
          <MaterialSymbol
            icon="arrow_forward_ios"
            size={16}
            className="transition-transform duration-300"
            style={{
              transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />

          <div className="text-headline-small font-bold">
            {reservation.title}
          </div>
          <MaterialSymbol
            icon="task_alt"
            size={24}
            className=" text-[#35C3B8]"
          />
        </div>
      )}
      items={items}
      bordered={false}
      className="bg-white"
      defaultActiveKey={["1"]}
    />
  );
};
