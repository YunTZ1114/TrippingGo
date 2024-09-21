import { Button } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";

const Home = () => {
  return (
    <div>
      <Button variant="contained" size="medium" startIcon={<AddOutlined />}>
        create trip
      </Button>
      home
    </div>
  );
};

export default Home;
