import "./App.css";
import LoginHeader from "./components/LoginHeader";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./components/Error";
import PetDetail from "./pages/PetDetail";
import Pets from "./components/Pets";
import PhotoPage from "./pages/PhotoPage";
import Books from "./components/Books";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/xxx" element={<PhotoPage/>}/>
          <Route path="/" element={<LoginHeader />} />
          <Route path="pets" element={<Pets />} />
          <Route path="pet/:id" element={<PetDetail />} />
          <Route path="books" element={<Books />} />
          <Route path="book/:id" element={<BookDetail />} />
          <Route path="error" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
