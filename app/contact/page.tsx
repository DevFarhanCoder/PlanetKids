export default function Contact() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">📧 Email</h3>
              <p className="text-gray-600">support@planetkids.com</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">📞 Phone</h3>
              <p className="text-gray-600">+91 1234567890</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9:00 AM - 6:00 PM</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">📍 Address</h3>
              <p className="text-gray-600">
                PlanetKids Store<br />
                123, Shopping Complex<br />
                Your City, State - 123456<br />
                India
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">🕐 Business Hours</h3>
              <p className="text-gray-600">
                Monday - Saturday: 9:00 AM - 6:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
