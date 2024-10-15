import { BaseCheckListItem, BaseCheckListItemWithId } from "@/api/trips";
import { Button, Form } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { classNames } from "@/utils";
import { Card } from "./Card";
import { Input } from "antd";

const CheckItem = ({
  value,
  onChange,
  onRemove,
}: {
  value?: string;
  onRemove: () => void;
  onChange?: (value: string) => void;
}) => {
  return (
    <div className="group">
      <div className="flex items-center">
        <div className="flex w-full">
          <span className="ml-2 mr-1 text-xl">∙</span>
          <Input.TextArea
            value={value}
            autoSize
            onChange={(e) => onChange?.(e.target.value)}
            className="border-none bg-transparent pl-1 text-body-large focus:bg-white group-hover:bg-white"
          />
        </div>
        <MaterialSymbol
          onClick={onRemove}
          className="cursor-pointer text-primary opacity-0 transition-all group-hover:opacity-100 group-focus:opacity-100"
          icon="close"
          size={24}
        />
      </div>
    </div>
  );
};

interface EditableCheckListBlockProps {
  name: (string | number)[];
  value?: BaseCheckListItemWithId;
  onCopy: (value: BaseCheckListItemWithId | undefined) => void;
  onRemove: (id: number) => void;
}

export const EditableCheckListBlock = ({
  name,
  value,
  onCopy,
  onRemove,
}: EditableCheckListBlockProps) => {
  return (
    <Card isPublic={value?.isPublic} className="group/block px-2 py-3">
      <div className="absolute -right-2 -top-4 z-10 flex items-center gap-1 rounded-md bg-white p-2 text-primary opacity-0 shadow-md group-hover/block:opacity-100">
        <MaterialSymbol
          onClick={() => onCopy(value)}
          className="cursor-pointer rounded-sm transition-all hover:bg-primary/20 active:bg-primary/40"
          icon="content_copy"
        />
        <MaterialSymbol
          onClick={() => value && onRemove(value.id)}
          className="cursor-pointer rounded-sm transition-all hover:bg-primary/20 active:bg-primary/40"
          icon="delete"
        />
      </div>
      <Form.Item noStyle name={[...name, "title"]}>
        <Input className="mb-2 border-none bg-transparent text-headline-small font-bold hover:bg-white focus:bg-white" />
      </Form.Item>

      <Form.List name={[...name, "description"]}>
        {(fields, { remove, add }) => {
          return (
            <>
              {fields?.map((field, i) => (
                <Form.Item noStyle {...field} key={field.key}>
                  <CheckItem onRemove={() => remove(i)} />
                </Form.Item>
              ))}

              <Button
                type="link"
                onClick={() => add("新項目")}
                className="mt-1 px-2"
                icon={<MaterialSymbol icon="add" />}
              >
                新增項目
              </Button>
            </>
          );
        }}
      </Form.List>
    </Card>
  );
};
