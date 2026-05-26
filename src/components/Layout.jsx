import { Outlet } from "react-router-dom";
import Header from "./Header";

/**
 * Общий каркас страниц: шапка + место для контента (Outlet).
 * Outlet — это слот, в который React Router рендерит активную дочернюю страницу.
 */
function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;