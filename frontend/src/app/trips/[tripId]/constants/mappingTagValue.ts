export const mappingTagValue = {
  TRANSPORTATION: "交通",
  ACCOMMODATION: "住宿",
  RESTAURANT: "餐廳",
  HEALTH_BEAUTY: "健康與美容類",
  ENTERTAINMENT: "娛樂類",
  OUTDOOR_ACTIVITY: "戶外活動類",
  OTHER: "其他類",
};

export type TagType = keyof typeof mappingTagValue;
