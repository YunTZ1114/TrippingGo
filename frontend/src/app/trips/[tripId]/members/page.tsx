"use client";

import { Form, Table } from "antd";
import { api } from "@/api";
import { Button, Loading } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { TableColumns } from "./constants";
import Link from "next/link";
import { getCustomKey } from "./utils";
import { InviteModal } from "./modal";
import { useState } from "react";

const MembersPage = ({ params }: { params: { tripId: number } }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: api.trips.keys.members(params.tripId),
    queryFn: async () =>
      await api.trips.getMembers({ pathParams: { tripId: params.tripId } }),
  });

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex h-full flex-col px-10 pt-7">
      {/* 上方資訊欄 */}
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">成員</div>
          <div className="mt-5 text-body-large">一串介紹的文字</div>
        </div>

        <div className="flex gap-2">
          <Link href="members/edit">
            <Button
              type="default"
              size="large"
              icon={<MaterialSymbol icon="edit" />}
            >
              編輯
            </Button>
          </Link>
          <Button
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="add" />}
            onClick={() => setOpenModal(true)}
          >
            邀請成員
          </Button>
        </div>
      </div>
      <div className="mt-5 flex h-0 flex-[1_1_0] flex-col gap-2 overflow-auto">
        {(() => {
          if (isLoading) return <Loading colorClass="text-gray-400" />;
          return (
            <Table
              rowKey="id"
              pagination={false}
              columns={TableColumns(getCustomKey(members?.[0]))}
              dataSource={members}
            />
          );
        })()}
      </div>
      <InviteModal
        tripMembersId={members?.map(({ userId }) => userId) ?? []}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default MembersPage;
