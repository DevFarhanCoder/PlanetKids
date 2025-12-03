export default function About() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">About PlanetKids</h1>
      
      <div className="prose max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Welcome to PlanetKids - Your One-Stop Destination for Quality Kids Products!
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
        <p className="mb-4">
          PlanetKids was founded with a simple mission: to provide parents with high-quality,
          safe, and engaging products for their children. We understand that every parent wants
          the best for their kids, and we're here to make that easier.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>School Essentials - Backpacks, lunch boxes, stationery, and more</li>
          <li>Toys & Games - Educational toys, puzzles, and fun activities</li>
          <li>Art & Craft Supplies - Unleash your child's creativity</li>
          <li>Gift Hampers - Perfect presents for every occasion</li>
          <li>Books & Learning Kits - Foster a love for reading and learning</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>✅ 100% Quality Assured Products</li>
          <li>✅ Safe & Non-Toxic Materials</li>
          <li>✅ Fast & Free Shipping</li>
          <li>✅ Easy Returns & Refunds</li>
          <li>✅ Secure Payment Options</li>
          <li>✅ Excellent Customer Service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment</h2>
        <p className="mb-4">
          We are committed to providing products that not only entertain but also educate and
          inspire children. Every product is carefully selected and tested to meet our high
          standards of quality and safety.
        </p>
      </div>
    </div>
  );
}
