export default function TrackOrder() {
  return (
    <div className="container-custom py-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your order ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Track Order
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> You can also track your order by logging into your account
            and visiting the "My Orders" section.
          </p>
        </div>
      </div>
    </div>
  );
}
