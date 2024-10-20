import { Facebook, Twitter, Instagram, X, Linkedin } from "lucide-react"
import { LogoSite, globalState } from '../../Constant';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white min-h-[200px] py-8">
      <div className="container mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl mb-4 font-bold">{globalState.websiteName}</h2>
            <p className="text-sm text-blue-100">Your trusted online accommodation broker, connecting you with ideal living spaces across the globe.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick as</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">Find Accommodation</a></li>
              <li><a href="#" className="text-sm hover:underline">List Your Property</a></li>
              <li><a href="#" className="text-sm hover:underline">How It Works</a></li>
              <li><a href="#" className="text-sm hover:underline">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">FAQs</a></li>
              <li><a href="#" className="text-sm hover:underline">Contact Us</a></li>
              <li><a href="#" className="text-sm hover:underline">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-200">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-blue-200">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-blue-200">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-blue-200">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-400 text-center">
          <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} {globalState.websiteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}