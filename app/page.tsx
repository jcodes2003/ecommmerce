'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Star, Search, Menu, ArrowRight, Filter, X, User } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Product {
  product: string;
  price: number;
  quantity: number;
  expiration_date: string | null;
  img: string | null;
  description: string;
  ratings: number; // Added rating property
}

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
 const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formData = new FormData();
        formData.append("operation", "getProduct");
        const response = await axios.post<Product[]>(
          "http://localhost/map/app/api/masterlist.php",
          formData,
          { headers: { Accept: "application/json" } }
        );
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (ratings: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 inline ${i <= ratings ? 'text-yellow-500' : 'text-gray-300'}`} />
      );
    }
    return stars;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-xl font-bold text-blue-600">ShopMart</span>
            </div>

            <div className="hidden sm:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Shop</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Categories</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Deals</a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button onClick={() => router.push('/app')} className="p-2 rounded-full hover:bg-gray-200 transition">
                <User className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Welcome to ShopMart
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover amazing products at great prices
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
              <button className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-10">Top Selling</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Groceries', 'Household', 'Personal Care', 'Health'].map((category) => (
            <div key={category} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <img src="/api/placeholder/64/64" alt={category} className="w-8 h-8" />
              </div>
              <h3 className="font-medium">{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse bg-white p-4 sm:p-6 rounded-lg shadow">
                  <div className="bg-gray-200 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      {product.img ? (
                        <img
                          src={`/assets/productImg/${product.img}`}
                          alt={product.product}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                      )}
                    </div>
                    <h3 className="mt-2 sm:mt-4 text-xs sm:text-base font-medium text-gray-800">{product.product}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">{product.description}</p>
                    <div className="mt-2 flex justify-center">{renderStars(product.ratings)}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Stock: {product.quantity}</span>
                      {product.expiration_date && (
                        <span className="text-red-500 text-xs sm:text-sm">Exp: {new Date(product.expiration_date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm sm:text-base font-bold text-blue-600">₱{product.price.toLocaleString()}</p>
                      <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest products and deals</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-blue-600">ShopMart</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">Shop</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">Categories</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">Deals</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Filters</span>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Add filter options here */}
              <div className="mt-4">
                <h3 className="font-medium">Categories</h3>
                {['Groceries', 'Household', 'Personal Care', 'Health'].map((category) => (
                  <div key={category}>
                    <input type="checkbox" id={category} name={category} />
                    <label htmlFor={category} className="ml-2">{category}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;