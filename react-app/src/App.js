import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // <-- 1. Import the new Navbar
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob"; 
import EditJob from "./pages/EditJob"; 

function App() {
    return (
        <BrowserRouter>
            {/* 2. Place Navbar INSIDE BrowserRouter but OUTSIDE Routes */}
            <Navbar /> 
            
            {/* Added a little padding so pages aren't touching the navbar */}
            <div style={{ paddingTop: "20px" }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-job" element={<CreateJob />} /> 
                    <Route path="/edit-job/:id" element={<EditJob />} /> 
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;