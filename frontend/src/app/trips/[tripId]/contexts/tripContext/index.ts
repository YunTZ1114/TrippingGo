import { TripDetail } from "@/api/trips";
import { createContext, useContext } from "react";

const defaultValue: TripDetail = {
  trip: {
    id: 0,
    name: "",
    description: "",
    coverUrl: null,
    creatorId: 0,
    currencyCode: 0,
    startTime: "",
    endTime: "",
  },
  tripMembers: [],
};

export const tripContext = createContext(defaultValue);

export const useTripContext = () => {
  return useContext(tripContext);
};
