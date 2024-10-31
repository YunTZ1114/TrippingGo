import { MaterialSymbol } from "@/components/MaterialSymbol";
import { Tag } from "@/components/Tag";
import { Divider, Dropdown, InputNumber } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import "./../../styles.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import {
  foodIcons,
  MarkerIconType,
  otherIcons,
  trafficIcons,
} from "@/api/trips";
import { classNames } from "@/utils";

const DurationTag = ({
  value,
  onChange,
}: {
  value?: number | null;
  onChange: (value?: number | null) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isEditing) return;
    ref.current?.focus();
  }, [isEditing]);

  return (
    <Tag
      className="group/time cursor-pointer bg-primary"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-center gap-2">
        <MaterialSymbol icon="schedule" size={12} />
        {isEditing ? (
          <>
            <InputNumber
              ref={ref}
              className="place-time-input h-4 w-12 bg-surfaceLight text-[12px]"
              style={{ paddingInline: "0" }}
              precision={0}
              min={1}
              step={1}
              variant="filled"
              value={inputValue}
              onChange={(v) => setInputValue(v)}
              onBlur={() => {
                setIsEditing(false);
                onChange(inputValue);
              }}
            />
            <MaterialSymbol
              icon="cancel"
              size={12}
              onClick={() => {
                setIsEditing(false);
                setInputValue(value);
              }}
            />
          </>
        ) : (
          <>
            {!!inputValue ? (
              `${inputValue} 分鐘`
            ) : (
              <div className="text-white/60">設定停留時間</div>
            )}
            <MaterialSymbol
              icon="edit"
              size={12}
              className="ml w-0 overflow-hidden transition-all group-hover/time:w-3"
            />
          </>
        )}
      </div>
    </Tag>
  );
};

const MarkerIconList = ({
  value,
  onChange,
}: {
  value: MarkerIconType;
  onChange: (value: MarkerIconType) => void;
}) => {
  return (
    <div className="flex w-[310px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 w-full">選擇地點圖示</div>
      {[foodIcons, trafficIcons, otherIcons].map((icons, i) => (
        <Fragment key={i}>
          {!!i && <Divider />}
          <div className="flex w-full flex-wrap gap-2">
            {icons.map((iconName) => (
              <div
                onClick={() => onChange(iconName)}
                key={iconName}
                className={classNames(
                  "group flex h-8 w-8 items-center justify-center gap-2 rounded-full transition-all duration-200 hover:shadow-md",
                  iconName === value
                    ? "bg-primary"
                    : "cursor-pointer bg-gray-50 hover:bg-gray-400",
                )}
              >
                <MaterialSymbol
                  icon={iconName}
                  size={16}
                  className={classNames(
                    "transition-all duration-200",
                    iconName === value
                      ? "text-white"
                      : "text-gray-600 group-hover:text-white",
                  )}
                />
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

const IconTag = ({
  value,
  onChange,
}: {
  value: MarkerIconType;
  onChange: (value: MarkerIconType) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      dropdownRender={() => {
        return <MarkerIconList value={value} onChange={onChange} />;
      }}
      onOpenChange={setOpen}
    >
      <Tag
        className={classNames(
          "cursor-pointer",
          open ? "bg-[#7eadc4]" : "bg-[#90bfd7]",
        )}
      >
        <MaterialSymbol
          icon={value}
          size={16}
          className="text-white transition-all duration-200"
        />
      </Tag>
    </Dropdown>
  );
};

const CostTag = ({
  value,
  onChange,
}: {
  value?: number | null;
  onChange: (value?: number | null) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isEditing) return;
    ref.current?.focus();
  }, [isEditing]);

  return (
    <Tag
      className="group/time cursor-pointer bg-orange-300"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-center gap-2">
        <MaterialSymbol icon="payments" size={12} />
        {isEditing ? (
          <>
            <InputNumber
              ref={ref}
              className="place-time-input h-4 w-20 bg-surfaceLight text-[12px]"
              style={{ paddingInline: "0" }}
              precision={2}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              min={0}
              max={99999999.99}
              step={1}
              variant="filled"
              value={inputValue}
              onChange={(v) => v && setInputValue(v)}
              onBlur={() => {
                setIsEditing(false);
                onChange(inputValue);
              }}
            />
            <MaterialSymbol
              icon="cancel"
              size={12}
              onClick={() => {
                setIsEditing(false);
                setInputValue(value);
              }}
            />
          </>
        ) : (
          <>
            {!!inputValue ? (
              `${inputValue} ¥`
            ) : (
              <div className="text-white/60">設定預估花費</div>
            )}
            <MaterialSymbol
              icon="edit"
              size={12}
              className="ml w-0 overflow-hidden transition-all group-hover/time:w-3"
            />
          </>
        )}
      </div>
    </Tag>
  );
};

export const PlaceTags = ({
  tripId,
  placeId,
  duration,
  cost,
  icon,
}: {
  tripId: number;
  placeId: number;
  duration?: number | null;
  cost?: number | null;
  icon: MarkerIconType;
}) => {
  const queryClient = useQueryClient();
  const putPlaceAction = useMutation({
    mutationFn: api.trips.putPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.trips.keys.place(tripId) });
    },
  });
  const pathParams = { tripId, placeId };

  return (
    <div className="flex gap-2">
      <IconTag
        value={icon}
        onChange={(value) =>
          putPlaceAction.mutate({
            pathParams,
            data: { icon: value },
          })
        }
      />
      <DurationTag
        value={duration}
        onChange={(value) =>
          putPlaceAction.mutate({
            pathParams,
            data: { duration: value },
          })
        }
      />
      <CostTag
        value={cost}
        onChange={(value) =>
          putPlaceAction.mutate({
            pathParams,
            data: { cost: value },
          })
        }
      />
    </div>
  );
};
