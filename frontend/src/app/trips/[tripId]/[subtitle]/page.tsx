"use client";
import { useParams } from "next/navigation";

const TmpPage = () => {
  const params = useParams();
  return <div>{params.subtitle}</div>;
};

export default TmpPage;
