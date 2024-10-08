import { redirect } from "next/navigation";

const TripPage = ({ params }: { params: any }) => {
  redirect(`/trips/${params.tripId}/settings`);
};

export default TripPage;
