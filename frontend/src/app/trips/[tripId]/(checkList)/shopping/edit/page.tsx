"use client";
import { Form, type FormProps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { api } from "@/api";
import { type BaseCheckListItemWithId, CheckListType } from "@/api/trips";
import { Button, useForm } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditableCheckListBlock } from "../../components";
import { newItemData } from "../../constants";
import { PageBlock } from "../../../components";

type FormData = { list: BaseCheckListItemWithId[] };

const PreparationEditPage = ({ params }: { params: { tripId: number } }) => {
  const [form] = useForm<FormData>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleMutateSuccess = () =>
    queryClient.invalidateQueries({
      queryKey: api.trips.keys.checkList(params.tripId),
    });

  const { data: queryData, isLoading } = useQuery({
    queryKey: api.trips.keys.checkList(params.tripId),
    queryFn: async () =>
      await api.trips.getCheckList({
        pathParams: { tripId: params.tripId },
      }),
  });

  const checkList = useMemo(() => {
    if (!queryData) return [];
    return queryData.filter(({ type }) => type === CheckListType.SHOPPING);
  }, [queryData]);

  const putCheckListAction = useMutation({
    mutationFn: api.trips.putCheckList,
    onSuccess: handleMutateSuccess,
  });

  const postCheckListAction = useMutation({
    mutationFn: api.trips.postCheckList,
    onSuccess: handleMutateSuccess,
  });

  const deleteCheckListAction = useMutation({
    mutationFn: api.trips.deleteCheckList,
    onSuccess: handleMutateSuccess,
  });

  const handleDeleteCheckList = (checkListId: number) => {
    deleteCheckListAction.mutate({
      pathParams: { tripId: params.tripId, checkListId },
    });
  };

  const timer = useRef<NodeJS.Timeout>();
  const handleEditCheckList: FormProps["onFieldsChange"] = (
    fieldData,
    allFieldData,
  ) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const listIndex = fieldData[0].name[1] as number;
      const allValue = allFieldData.find(
        ({ name }) => name.length === 1,
      )?.value;

      const currentValue = allValue[listIndex];

      if (!currentValue || !currentValue.id) return;

      putCheckListAction.mutate({
        pathParams: {
          tripId: params.tripId,
          checkListId: currentValue.id,
        },
        data: currentValue,
      });
    }, 500);
  };

  useEffect(() => {
    if (!checkList) return;
    const list = form.getFieldValue("list");
    form.setFieldValue(
      "list",
      checkList.map(({ title, description, isPublic, id, type }, i) => ({
        title,
        isPublic,
        id,
        type,
        description: description.map(({ text }) => text),
        ...list[i],
      })),
    );
  }, [checkList]);

  return (
    <Form
      className="h-full"
      onFieldsChange={handleEditCheckList}
      form={form}
      initialValues={{ list: [] }}
    >
      <Form.List name="list">
        {(fields, { add, remove }) => (
          <PageBlock
            description="一串介紹的文字"
            title="待買清單"
            isLoading={isLoading}
            isEmpty={!fields?.length}
            extra={
              <div className="flex gap-2">
                <Button
                  size="large"
                  onClick={() => {
                    add(newItemData);
                    postCheckListAction.mutate({
                      pathParams: { tripId: params.tripId },
                      data: { ...newItemData, type: CheckListType.SHOPPING },
                    });
                  }}
                  icon={<MaterialSymbol icon="add" />}
                >
                  新增清單
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<MaterialSymbol icon="frame_inspect" />}
                  onClick={() => router.push(".")}
                >
                  檢視模式
                </Button>
              </div>
            }
            contentClassName="!mt-1"
          >
            <div className="preparation-check-box--container w-full pb-4 pt-4">
              {fields.map(({ name, key }, i) => (
                <Form.Item noStyle name={name} key={key}>
                  <EditableCheckListBlock
                    onCopy={(value) => {
                      if (!value) return;
                      const { id, ...currentValue } = value;
                      add(currentValue);
                      postCheckListAction.mutate({
                        pathParams: { tripId: params.tripId },
                        data: currentValue,
                      });
                    }}
                    onRemove={(id) => {
                      handleDeleteCheckList(id);
                      remove(i);
                    }}
                    name={[name]}
                  />
                </Form.Item>
              ))}
            </div>
          </PageBlock>
        )}
      </Form.List>
    </Form>
  );
};

export default PreparationEditPage;
