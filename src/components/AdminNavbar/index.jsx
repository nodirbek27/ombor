import { Container, Section } from "./style";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const AdminNavbar = () => {
  return (
    <Container>
      <Section>
        <Link to="/admin/so'rovlar">
          <IoNotificationsOutline className="w-6 h-auto" />
        </Link>
      </Section>
    </Container>
  );
};

export default AdminNavbar;
