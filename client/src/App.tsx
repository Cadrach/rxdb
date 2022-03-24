import React from 'react';
import logo from './logo.svg';
import './App.css';
import Test from "./components/Test";
import {Layout} from "antd";

function App() {
  return (
      <Layout style={{minHeight: '100vh'}}>
          <Test/>
      </Layout>
  );
}

export default App;
