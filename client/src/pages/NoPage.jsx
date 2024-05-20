import { useState } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function NoPage() {
  let navigate = useNavigate();

  return (
    <>
      <h1 style={{ textAlign: "center" }}>No Page Found</h1>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate("/userdashboard");
            }}
          >
            Back To Dashboard
          </Button>
        }
      />
    </>
  );
}

export default NoPage;
