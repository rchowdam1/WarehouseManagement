import Navigation from "./Navigation";
function AuthenticatedLayout(props) {
  return (
    <div>
      <Navigation />
      <main>{props.children}</main>
    </div>
  );
}

export default AuthenticatedLayout;
