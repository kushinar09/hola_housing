import { Globe, Search, Shield } from "lucide-react"
import Footer from "./components/shared/footer"
import Header from "./components/shared/header"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { globalState } from './Constant';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutUs from "./components/others/aboutUs"
import CreateNewsArticle from "./components/others/postNews"
import Article from "./components/others/news"
import PostProperty from "./components/others/postProperty"
import Properties from "./components/others/properties"
import PropertyDetail from "./components/others/propertyDetail"
import { Toaster } from "./components/ui/toaster"
import PropertyPayment from "./components/others/propertyPayment"
import { AuthProvider } from './contexts/AuthContext'
import SignIn from "./components/authen/sign_in"
import SignUp from "./components/authen/sign_up"
import CombinedPropertyForm from "./components/others/post"
import ImageUploader from "./components/others/test"
import PropertyManagement from "./components/others/propertyManagerment"
import OTPVerification from "./components/authen/verify"

function App() {
  return (
    <AuthProvider>
      <div className="relative">
        <Header />
        <main className="flex-1 my-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/post" element={<CombinedPropertyForm />} />
            <Route path="/postNews" element={<CreateNewsArticle />} />
            <Route path="/news" element={<Article />} />
            <Route path="/detail/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/manager" element={<PropertyManagement />} />
            <Route path="/test" element={<OTPVerification />} />
          </Routes>
        </main>
        <Toaster />
        <Footer />
      </div>
    </AuthProvider>
  )
}

function Home() {
  return <>
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Find Your Perfect Home with {globalState.websiteName}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl">
              Your trusted online accommodation broker. Connecting you with ideal living spaces across the globe.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="max-w-lg flex-1 bg-white text-gray-900 placeholder:text-gray-500"
                placeholder="Enter location"
                type="text"
              />
              <Button variant="destructive" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300" type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
            <p className="text-xs text-gray-100">
              Thousands of verified listings waiting for you.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4 text-gray-900">Why Choose {globalState.websiteName}</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-start justify-center">
          <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
            <div className="p-2 bg-gray-100 rounded-full">
              <Search className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900">Wide Selection</h3>
            <p className="text-sm text-center text-gray-500">Thousands of verified listings to choose from.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
            <div className="p-2 bg-gray-100 rounded-full">
              <Shield className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900">Secure Booking</h3>
            <p className="text-sm text-center text-gray-500">Safe and secure accommodation booking process.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
            <div className="p-2 bg-gray-100 rounded-full">
              <Globe className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900">Broad Reach</h3>
            <p className="text-sm text-center text-gray-500">Find accommodation anywhere in the vast Hoa Lac area.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
              Ready to Find Your New Home?
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of satisfied customers who found their perfect accommodation through {globalState.websiteName}.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
              <Button className="bg-gray-800 text-white hover:bg-gray-900" type="submit">
                Get Started
              </Button>
            </form>
            <p className="text-xs text-gray-500">
              Sign up for our newsletter and get the latest listings.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
}

export default App