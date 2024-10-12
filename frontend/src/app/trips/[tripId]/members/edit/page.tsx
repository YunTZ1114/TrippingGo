"use client";

import { api } from "@/api";
import { Member, Role } from "@/api/trips";
import { Button, Form, Input, Loading, useForm } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { EditTableColumns } from "../constants";
import { getCustomKey } from "../utils";
import { DeleteConfineModal } from "../modal/DeleteConfineModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

const isLoading = false;
const members = [
  {
    id: 4,
    userId: 4,
    nickname: "Eeeva",
    description: "null",
    note: "null",
    isDeleted: false,
    createdAt: "2024-10-07T13:41:59.000Z",
    updatedAt: "2024-10-07T13:41:59.000Z",
    userName: "Eeeva",
    avatar: "/default-avatar.png",
    role: Role.CREATOR,
  },
  {
    id: 5,
    userId: 5,
    nickname: "Eeeva2",
    description: "null",
    note: "null",
    isDeleted: false,
    createdAt: "2024-10-07T13:41:59.000Z",
    updatedAt: "2024-10-07T13:41:59.000Z",
    userName: "Eeeva2",
    avatar: "/default-avatar.png",
    role: Role.EDITOR,
  },
];

const MembersPage = ({ params }: { params: { tripId: number } }) => {
  const {
    data: members,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: api.trips.keys.members(params.tripId),
    queryFn: async () =>
      await api.trips.getMembers({ pathParams: { tripId: params.tripId } }),
  });
  const router = useRouter();

  const editMembersAction = useMutation({
    mutationFn: api.trips.putMembers,
    onSuccess: () => {
      refetch();
      router.push(".");
    },
  });

  const [openConfineModal, setOpenConfineModal] = useState(false);
  const [confineModalState, setConfineModalState] = useState<Member>();

  const handleDeleteUser = (member: Member) => {
    setOpenConfineModal(true);
    setConfineModalState(member);
  };

  const [form] = useForm<Member[]>();
  const customKey = getCustomKey(members?.[0]);

  const handleFinish = (data: Record<number, Member>) => {
    if (!members) return;
    const dataArr = Object.values(data).map((data, i) => ({
      ...data,
      id: members[i].id,
    }));
    const permissions = dataArr.map(({ id, role }) => ({
      id,
      permissions: role,
    }));

    editMembersAction.mutate({
      pathParams: { tripId: params.tripId },
      data: { permissions, info: dataArr },
    });
  };

  return (
    <div className="flex h-full flex-col px-10 pt-7">
      {/* 上方資訊欄 */}
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">成員</div>
          <div className="mt-5 text-body-large">一串介紹的文字</div>
        </div>

        <div className="flex gap-2">
          <Button size="large" onClick={() => router.push(".")}>
            取消
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="save" />}
            loading={editMembersAction.isPending}
            onClick={form.submit}
          >
            儲存
          </Button>
        </div>
      </div>
      <div className="mt-5 flex h-0 flex-[1_1_0] flex-col gap-2 overflow-auto">
        {(() => {
          if (isLoading) return <Loading colorClass="text-gray-400" />;
          return (
            <Form initialValues={members} form={form} onFinish={handleFinish}>
              <Table
                rowKey="id"
                pagination={false}
                columns={EditTableColumns(customKey, handleDeleteUser)}
                dataSource={members}
              />
            </Form>
          );
        })()}
      </div>
      <DeleteConfineModal
        tripId={params.tripId}
        state={confineModalState}
        open={openConfineModal}
        onClose={() => setOpenConfineModal(false)}
      />
    </div>
  );
};

export default MembersPage;
