import { Reservation } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import dayjs from "dayjs";
import { mappingTagValue, TagType } from "../constants";
import { Collapse, CollapseProps, Divider } from "antd";
import { useState } from "react";
import { MarkdownPreview } from "@/components";

export const ReservationBlock = ({
  reservation,
  onEdit,
  onCopy,
  onDelete,
}: {
  reservation: Reservation;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) => {
  const items: CollapseProps["items"] = [
    {
      collapsible: "icon",
      key: "1",
      extra: (
        <div className="flex items-center gap-1 text-primary opacity-0 transition-all group-hover:opacity-100">
          <MaterialSymbol
            className="cursor-pointer"
            onClick={onEdit}
            icon="edit"
            size={24}
          />

          <MaterialSymbol
            className="cursor-pointer"
            onClick={onCopy}
            icon="content_copy"
            size={24}
          />

          <MaterialSymbol
            className="cursor-pointer"
            onClick={onDelete}
            icon="delete"
            size={24}
          />
        </div>
      ),
      label: (
        <div className="rounded-lg px-3 pt-[60px]">
          <div className="absolute bottom-3 left-3 flex gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary px-2 py-1 text-xs text-white shadow-md">
              時間：
              {dayjs(reservation.reservationTime).format("YYYY-MM-DD hh:mm")}
              {reservation.endTime &&
                ` ~ ${dayjs(reservation.endTime).format("YYYY-MM-DD hh:mm")}`}
            </div>
            <div
              className="flex items-center justify-center rounded-full px-2 py-1 text-xs text-white shadow-md"
              style={{ background: "#F0BF38" }}
            >
              人數： {reservation.amount} 人
            </div>
            <div
              className="flex items-center justify-center rounded-full px-2 py-1 text-xs text-white shadow-md"
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
              <div className="px-1 text-label-medium font-bold">注意事項</div>
            </div>
            <div className="flex items-center pt-2">
              <MarkdownPreview className="px-2 text-xs">
                {reservation.note}
              </MarkdownPreview>
            </div>
          </div>

          <div>
            <div className="mt-2 flex items-center px-2 pt-3">
              <MaterialSymbol
                icon="chat_bubble"
                size={16}
                className="text-gray-400"
              />
              <div className="text-label-mediums px-1 font-bold">描述</div>
            </div>
            <div className="flex items-center pt-2">
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
      className="group bg-white"
      items={items}
      bordered={false}
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

          <span className="text-headline-small font-bold leading-none">
            {reservation.title}
          </span>

          {new Date(reservation.reservationTime) < new Date() ? (
            <MaterialSymbol
              icon="task_alt"
              size={24}
              className="text-[#35C3B8]"
            />
          ) : null}
        </div>
      )}
    />
  );
};
