import React from "react";
import Header from "./Header";
import Table from "./Table";
import "./style.css";

export default function DashboardOverview() {
  return (
    <div className="container">
      <Header />

      <Table/>
    </div>
  );
}
