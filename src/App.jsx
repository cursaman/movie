import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import TvShows from "./pages/TvShows";
import TvShowDetail from "./pages/TvShowDetail";
import Search from "./pages/Search";
import MoviePicker from "./pages/MoviePicker";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movie/:id" element={<MovieDetail />} />
        <Route path="tv" element={<TvShows />} />
        <Route path="tv/:id" element={<TvShowDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="recommend" element={<MoviePicker />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
