import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob"; 

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                
                {/* 2. Add the route so React knows where to show it */}
                <Route path="/create-job" element={<CreateJob />} /> 
            </Routes>
        </BrowserRouter>
    );
}

export default App;