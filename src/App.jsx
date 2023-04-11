import "./App.css";
import Books from "./components/Books";
import LoginHeader from "./components/LoginHeader";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginHeader />} />
          <Route path="books" element={<Books />} />
          <Route path="book/:id" element={<BookDetail />} />
          <Route path="footer" element={<Footer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
