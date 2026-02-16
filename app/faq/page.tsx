export default function FAQ() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Ordering */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ordering</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I place an order?
              </h3>
              <p className="text-gray-600">
                Browse our products, add items to your cart, and proceed to
                checkout. Fill in your shipping details and choose your
                preferred payment method to complete your order.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I modify or cancel my order?
              </h3>
              <p className="text-gray-600">
                Orders can be modified or cancelled within 1 hour of placement.
                Please contact us immediately at Planetkids1133@gmail.com or
                call +91 9326287112.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI, Net
                Banking, and Cash on Delivery (COD) for all orders.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Shipping & Delivery
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does delivery take?
              </h3>
              <p className="text-gray-600">
                Metro Cities: 2-3 business days
                <br />
                Other Cities: 4-7 business days
                <br />
                Remote Areas: 7-10 business days
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What are the shipping charges?
              </h3>
              <p className="text-gray-600">
                Free shipping on prepaid orders above ₹999. For orders below
                ₹999, a shipping fee of ₹60 applies. COD is available on all
                orders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order is shipped, you'll receive tracking details via
                email and SMS. You can also track your order in your account
                dashboard or visit our Track Order page.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Currently, we only ship within India. International shipping is
                not available at this time.
              </p>
            </div>
          </div>
        </div>

        {/* Returns & Refunds */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Returns & Refunds
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day return policy from the date of delivery.
                Products must be unused, in original packaging with all tags
                intact. Return requests can be initiated through your account
                dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I return a product?
              </h3>
              <p className="text-gray-600">
                Log in to your account, go to "My Orders," select the order you
                want to return, click "Return," and select the reason. Our team
                will arrange a pickup.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When will I receive my refund?
              </h3>
              <p className="text-gray-600">
                Once we receive and inspect your returned item, refunds are
                processed within 7-10 business days. The amount will be credited
                to your original payment method.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are there any non-returnable items?
              </h3>
              <p className="text-gray-600">
                Yes, personalized products, items marked as "Non-Returnable,"
                opened/used products, and products without original packaging
                cannot be returned.
              </p>
            </div>
          </div>
        </div>

        {/* Products & Quality */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products & Quality
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are your products safe for children?
              </h3>
              <p className="text-gray-600">
                Yes, all our products meet safety standards and are tested for
                child safety. We only source quality products from verified
                suppliers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I receive a damaged product?
              </h3>
              <p className="text-gray-600">
                If you receive a damaged or defective product, please contact us
                immediately at Planetkids1133@gmail.com or +91 9326287112 with
                photos. We'll arrange a replacement or refund.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you have age-appropriate recommendations?
              </h3>
              <p className="text-gray-600">
                Yes, each product listing includes recommended age ranges. You
                can also browse by age category to find suitable products for
                your child.
              </p>
            </div>
          </div>
        </div>

        {/* Account & Privacy */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Account & Privacy
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need an account to place an order?
              </h3>
              <p className="text-gray-600">
                While you can browse without an account, creating one makes
                checkout faster and allows you to track orders, manage your
                wishlist, and save addresses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my personal information secure?
              </h3>
              <p className="text-gray-600">
                Yes, we use industry-standard encryption to protect your data.
                We never share your personal information with third parties
                without consent.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I reset my password?
              </h3>
              <p className="text-gray-600">
                Click "Forgot Password" on the login page, enter your registered
                email, and you'll receive a password reset link.
              </p>
            </div>
          </div>
        </div>

        {/* Bulk Orders */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Orders</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer bulk order discounts?
              </h3>
              <p className="text-gray-600">
                Yes, we provide special rates for bulk orders for schools,
                playschools, and events. Please visit our Bulk Order page or
                contact us for a custom quote.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is the minimum quantity for bulk orders?
              </h3>
              <p className="text-gray-600">
                Bulk orders typically start from 50 pieces or more. Contact us
                for specific requirements and pricing at
                Planetkids1133@gmail.com or +91 9326287112.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl shadow-soft p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            We're here to help! Feel free to reach out to us.
          </p>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900">📧 Email</p>
              <a
                href="mailto:Planetkids1133@gmail.com"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Planetkids1133@gmail.com
              </a>
            </div>
            <div>
              <p className="font-semibold text-gray-900">📞 Phone</p>
              <a
                href="tel:+919326287112"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                +91 9326287112
              </a>
            </div>
            <div>
              <p className="font-semibold text-gray-900">🕐 Support Hours</p>
              <p className="text-gray-600">Mon-Sat: 9:00 AM - 8:00 PM</p>
              <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
