"use client";
import Link from "next/link";
import { api } from "@/api";
import { CheckListType } from "@/api/trips";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageBlock } from "../../components";
import { CheckListBlock } from "../components";
import { useMemo } from "react";

const PreparationPage = ({ params }: { params: { tripId: number } }) => {
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

  const queryClient = useQueryClient();
  const patchCheckListAction = useMutation({
    mutationFn: api.trips.patchCheckList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.checkList(params.tripId),
      });
    },
  });

  const handleItemClick = (checkListId: number, text: string) => {
    patchCheckListAction.mutate({
      pathParams: {
        tripId: params.tripId,
        checkListId,
      },
      data: { descriptionKey: text },
    });
  };

  return (
    <PageBlock
      title="待買清單"
      description="一串介紹的文字"
      isLoading={isLoading}
      isEmpty={!checkList?.length}
      extra={
        <Link href="shopping/edit">
          <Button
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="edit" />}
          >
            編輯
          </Button>
        </Link>
      }
    >
      <div className="preparation-check-box--container w-full pb-4">
        {checkList?.map((data) => (
          <CheckListBlock
            onCheckClick={(text) => handleItemClick(data.id, text)}
            key={data.id}
            {...data}
          />
        ))}
      </div>
    </PageBlock>
  );
};

export default PreparationPage;
