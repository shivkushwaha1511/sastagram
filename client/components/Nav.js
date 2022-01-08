import Link from "next/link";

const Nav = () => {
  return (
    <nav className="nav bg-warning justify-content-end">
      <Link href="/" className="nav-item">
        <a className="nav-link text-white fw-bold fs-5">Home</a>
      </Link>
      <Link href="/register" className="nav-item">
        <a className="nav-link text-white fw-bold fs-5">Register</a>
      </Link>
      <Link href="/login" className="nav-item">
        <a className="nav-link text-white fw-bold fs-5">Login</a>
      </Link>
    </nav>
  );
};

export default Nav;
