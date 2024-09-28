import { api } from "@/api";
import { SignUp } from "./SignUp";

const Page = async () => {
  const countries = await api.info.countries();

  return <SignUp countries={countries} />;
};

export default Page;
