import { LegalPage } from './PrivacyPage.jsx';

const sections = [
  ['Using Malabarii', 'Malabarii provides an online platform for ordering fresh dairy, vegetables, groceries, and daily essentials from participating local vendors. You agree to provide accurate information and use the service lawfully.'],
  ['Accounts and Security', 'You are responsible for your mobile number, OTPs, PIN, and activity on your account. Notify us if you suspect unauthorized access.'],
  ['Orders and Availability', 'Products, prices, delivery slots, and availability may change based on vendor stock, serviceability, weather, and operational constraints. We may cancel or modify orders when fulfillment is not possible.'],
  ['Payments and Refunds', 'Payments may be collected through Razorpay or other supported methods. Refunds, where applicable, are processed to the original payment method or as otherwise permitted by law and platform policy.'],
  ['Delivery', 'Delivery estimates are provided in good faith. Hotels and recurring buyers may receive custom delivery windows, credit terms, and GST invoice settings after approval.'],
  ['Vendor Responsibilities', 'Vendors are responsible for product quality, accurate listings, required licenses such as FSSAI where applicable, tax details, and lawful sale of their products.'],
  ['Returns and Issues', 'Report damaged, missing, or incorrect items promptly through support. Perishable goods may have limited return eligibility after delivery acceptance.'],
  ['Limitation of Liability', 'To the maximum extent permitted by law, Malabarii is not liable for indirect losses, business interruption, or issues outside reasonable operational control.'],
  ['Contact', 'For terms, support, or legal questions, contact hello@malabarii.com or Malabarii, Kozhikode, Kerala, India.'],
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" intro="The terms for using Malabarii as a customer, vendor, or hotel buyer." sections={sections} />;
}
