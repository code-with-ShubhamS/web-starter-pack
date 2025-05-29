
import './App.css'
import { Outlet } from "react-router-dom";
import Header from './components/Header';
function App() {
  return (
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}

export default App
