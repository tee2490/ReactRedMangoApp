import React,{useState,useEffect} from "react";
import { Footer, Header } from "../Components/Layout";
import { Home } from "../Pages";

function App() {

  return (
    <div>
      <Header />
      <Home/>
      <Footer />
    </div>
  );
}

export default App;
