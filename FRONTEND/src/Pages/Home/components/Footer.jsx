import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer,   } from 'react-toastify';

function Footer() {
    const [email, setEmail] = React.useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        if(!email){
            toast.error('Please enter your email!',{
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            return;
        }
        toast.success('Thanks for subscribing!',{
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setEmail('');
    }
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About CampusBids</h3>
            <p className="text-gray-400">
              CampusBids is your go-to platform for buying and selling items within your campus community. Connect, trade, and save!
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/im_a_r_i/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/arijitdas1310/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/myProducts" className="text-gray-400 hover:text-blue-500 transition-colors">
                  My Items
                </a>
              </li>
              <li>
                <a href="/createItem" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Post an Item
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: arijitme11@gmail.com</li>
              <li>Phone: +91 (123) 456-7890</li>
              <li>Address: IIIT Gwalior, Gwalior, IN</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400">
              Get the latest updates and exclusive offers straight to your inbox.
            </p>
            <form className="flex space-x-2" onSubmit={()=>handleSubmit(event)}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} CampusBids. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/arijitdas13105"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              <FaGithub className="inline-block mr-1" />
              arijitdas13105
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </footer>
  );
}

export default Footer;