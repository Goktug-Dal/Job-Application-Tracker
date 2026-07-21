import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <div style={{ paddingTop: "20px", minHeight: "70vh" }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-job" element={<CreateJob />} />
                    <Route path="/edit-job/:id" element={<EditJob />} />
                </Routes>
            </div>

            <Footer />
        </BrowserRouter>
    );
}

export default App;