// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import Navbar from "./components/navbar";
import HykerForm from "./components/hykerForm";
import Map from "./components/map";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 p-6 gap-6">
        <div className="w-[30%] flex justify-center items-start">
          <HykerForm />
        </div>
        <div className="w-[70%] flex justify-center items-center">
          <Map />
        </div>
      </div>
    </div>
  );
}