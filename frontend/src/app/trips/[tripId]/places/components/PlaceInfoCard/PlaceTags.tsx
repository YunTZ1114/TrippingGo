import { MaterialSymbol } from "@/components/MaterialSymbol";
import { Tag } from "@/components/Tag";
import { Dropdown, InputNumber, MenuProps, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import "./../../styles.css";
import { mappingTagValue } from "../../../constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { PlaceType } from "@/api/trips";

const items: MenuProps["items"] = Object.entries(mappingTagValue).map(
  ([key, value]) => ({
    label: value,
    key: key,
  }),
);

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

const TypeTag = ({
  value,
  onChange,
}: {
  value?: PlaceType | null;
  onChange: (value?: PlaceType | null) => void;
}) => {
  const [selectValue, setSelectValue] = useState(value);
  const onClick: MenuProps["onClick"] = ({ key }) => {
    setSelectValue(key as PlaceType);
    onChange(key as PlaceType);
  };

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: selectValue ? [selectValue] : undefined,
        onClick,
      }}
      trigger={["click"]}
    >
      <Tag className="group/type cursor-pointer bg-[#A4CE5B]">
        <div className="flex items-center gap-2">
          <MaterialSymbol icon="sell" size={12} />
          {selectValue ? (
            mappingTagValue[selectValue as keyof typeof mappingTagValue]
          ) : (
            <div className="text-white/60">設定類別</div>
          )}
          <MaterialSymbol
            icon="stat_minus_1"
            size={12}
            className="w-0 overflow-hidden transition-all group-hover/type:w-3"
          />
        </div>
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
  type,
  cost,
}: {
  tripId: number;
  placeId: number;
  duration?: number | null;
  type?: PlaceType | null;
  cost?: number | null;
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
      <DurationTag
        value={duration}
        onChange={(value) =>
          putPlaceAction.mutate({
            pathParams,
            data: { duration: value },
          })
        }
      />
      <TypeTag
        value={type}
        onChange={(value) =>
          putPlaceAction.mutate({
            pathParams,
            data: { type: value },
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
