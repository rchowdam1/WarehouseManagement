import HomeNavigation from "./HomeNavigation";
import Navigation from "./Navigation";

function Layout(props, { LoggedIn }) {
  return (
    <div>
      {LoggedIn ? <Navigation /> : <HomeNavigation />}
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
