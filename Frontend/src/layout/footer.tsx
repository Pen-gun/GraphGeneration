import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bottom-0 bg-gray-800 text-white py-8 text-center">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="">
          <h4 className="text-lg font-bold mb-4">About Us</h4>
          <p className="text-sm">
            We are committed to providing the best services and solutions.
          </p>
        </div>
        <div className="flex flex-col gap-2 mx-auto">
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <Link to={"/"}>Home</Link>
          <Link to="/">About</Link>
          <Link to={"/"}>Services</Link>
          <Link to={"/"}>Contact</Link>
        </div>
        <div className="">
          <h4 className="text-lg font-bold mb-4">Contact</h4>
          <p className="text-sm">Email: softech@domain.com</p>
          <p className="text-sm">Phone: +123 456 789</p>
        </div>
      </div>
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Softech AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;