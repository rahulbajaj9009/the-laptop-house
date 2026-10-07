import Footer from "./components/common/Footer.jsx";
import Navbar from "./components/common/Navbar.jsx";
import ScrollToTopButton from "./components/common/ScrollToTopButton.jsx";
import AppRouter from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <AppRouter />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
