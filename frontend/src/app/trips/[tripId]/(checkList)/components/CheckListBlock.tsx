import { CheckListItem } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { classNames } from "@/utils";
import { Checkbox } from "antd";
import { useEffect, useState } from "react";
import { Card } from "./Card";

interface CheckListBlockProps extends CheckListItem {
  onCheckClick: (text: string) => void;
}

export const CheckListBlock = ({
  title,
  description: currentDescription,
  isPublic,
  onCheckClick,
}: CheckListBlockProps) => {
  const [description, setDescription] =
    useState<(CheckListItem["description"][0] & { isPadding?: boolean })[]>(
      currentDescription,
    );
  const itemCount = description.length;
  const checkedItemCount = description.filter(({ checked }) => checked).length;
  const handleItemClick = (changedText: string, index: number) => {
    onCheckClick(changedText);
    setDescription((des) =>
      des.map((data) =>
        data.text === changedText
          ? {
              text: data.text,
              checked: !data.checked,
              isPadding: true,
            }
          : data,
      ),
    );
  };

  useEffect(() => {
    setDescription((des) =>
      currentDescription.map((data, i) =>
        data.checked === des[i].checked ? data : des[i],
      ),
    );
  }, [currentDescription]);

  return (
    <Card isPublic={isPublic} className="p-5">
      <div className="mb-3 flex items-center gap-2 text-headline-small font-bold">
        <span>{title}</span>
        {checkedItemCount === itemCount ? (
          <MaterialSymbol
            className="text-teal-500"
            size={28}
            weight={500}
            icon="task_alt"
          />
        ) : (
          `(${checkedItemCount}/${itemCount})`
        )}
      </div>
      {description.map(({ text, checked, isPadding }, i) => (
        <Checkbox
          key={i}
          className={classNames(
            "group w-full items-start py-1 text-body-large",
            isPadding && "pointer-events-none opacity-75",
          )}
          checked={checked}
          onChange={() => handleItemClick(text, i)}
        >
          {text}
        </Checkbox>
      ))}
    </Card>
  );
};
