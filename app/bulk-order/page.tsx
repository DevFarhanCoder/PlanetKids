export default function BulkOrders() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Bulk Orders</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-xl text-gray-600 mb-8">
          Looking to place a large order? We offer special discounts on bulk purchases!
        </p>

        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Bulk Order Benefits</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Special discounted pricing</li>
            <li>Customization options available</li>
            <li>Dedicated account manager</li>
            <li>Flexible payment terms</li>
            <li>Priority shipping</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Request a Quote</h2>
          
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Products Interested In</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., School bags, Lunch boxes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Estimated quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Details</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Tell us more about your requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Submit Request
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Or email us directly at: <a href="mailto:bulk@planetkids.com" className="text-purple-600 font-medium">bulk@planetkids.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
