import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/login">
        <Button type="primary">login</Button>
      </Link>
    </div>
  );
}
