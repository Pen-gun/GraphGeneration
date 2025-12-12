import Navbar from "./navlinks";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[85vh]">
        <Navbar />
        <main className="flex-grow pt-16 min-h-[900px]">{children || <div className="min-h-[500px]"></div>}</main>
    </div>
  );
}
export default Layout;