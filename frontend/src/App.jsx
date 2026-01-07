import React from "react";
import AppRouter from "./router/AppRouter";
import NavBar from "./components/nav/NavBar";

const App = () => {
  return (
    <div className="w-full h-full ">
      <NavBar/>
      <AppRouter /> 
    </div>
  );
};

export default App;
