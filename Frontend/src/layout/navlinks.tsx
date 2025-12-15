import { Link} from "react-router-dom"
import { SearchCodeIcon } from "lucide-react" 

type NavLink = {
  label: string
  to: string
  icon?: React.ComponentType
}

const navLinks: NavLink[] = [
  { label: "Home", icon: SearchCodeIcon, to: "/" },
]


export default function Navbar() {

  return (
    <nav className="sticky top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-color-gray-50/95">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:text-purple-600">
            <span className="hidden sm:inline">Softech AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground hover:cursor-pointer hover:text-purple-600"
              >
                {link.icon && <link.icon />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}