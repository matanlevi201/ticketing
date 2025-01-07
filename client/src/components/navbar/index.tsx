import { useEffect, useState } from "react";
import { IconBellRinging, IconReceipt2 } from "@tabler/icons-react";
import classes from "./style.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../stores/state-ctx";

const Navbar = () => {
  const currentUser = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("Tickets");

  const data = [
    { link: "/", label: "Tickets", icon: IconReceipt2 },
    {
      link: "/orders",
      label: "Orders",
      icon: IconBellRinging,
      disabled: !currentUser,
    },
  ];

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        if (item.disabled) return;
        navigate(item.link);
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  useEffect(() => {
    const current = data.find(({ label }) =>
      location.pathname.includes(label.toLowerCase())
    );
    setActive(current ? current.label : "Tickets");
  }, [location.pathname]);

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
    </nav>
  );
};
export default Navbar;
