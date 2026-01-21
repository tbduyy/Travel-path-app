import Link from "next/link";
import { Search, MapPin, Info, Phone } from "lucide-react";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                Travel Path
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm">
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Search className="w-4 h-4" />
                    Search
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <MapPin className="w-4 h-4" />
                    Destinations
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                    Policy
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    Contact
                </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-white/90 text-sm font-medium hover:text-white transition-colors"
                >
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="bg-white text-primary px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-white/90 transition-all"
                >
                    Sign up
                </Link>
            </div>
        </header>
    );
}
