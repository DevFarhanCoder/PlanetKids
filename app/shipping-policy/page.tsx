export default function ShippingPolicy() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Shipping Information
        </h2>
        <p className="mb-4">
          At PlanetKids, we strive to deliver your orders as quickly and
          efficiently as possible.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Delivery Time</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Metro Cities: 2-3 business days</li>
          <li>Other Cities: 4-7 business days</li>
          <li>Remote Areas: 7-10 business days</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Shipping Charges</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Free shipping on orders above ₹999</li>
          <li>₹60 shipping charges for orders below ₹999</li>
          <li>COD available on all orders</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Order Tracking</h3>
        <p className="mb-4">
          Once your order is shipped, you will receive a tracking number via
          email and SMS. You can track your order status in your account
          dashboard.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Contact Us</h3>
        <p className="mb-4">
          For any shipping queries, please contact us at:
          <br />
          Email: Planetkids1133@gmail.com
          <br />
          Phone: +91 9326287112
        </p>
      </div>
    </div>
  );
}
