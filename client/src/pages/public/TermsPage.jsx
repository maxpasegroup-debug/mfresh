import { LegalPage } from './PrivacyPage.jsx';

const sections = [
  ['Using MFresh', 'MFresh provides an online platform for ordering fresh seafood, cleaning preferences, delivery slots, and MFresh Pickles. You agree to provide accurate information and use the service lawfully.'],
  ['Accounts and Security', 'You are responsible for your mobile number, OTPs, PIN, and activity on your account. Notify us if you suspect unauthorized access.'],
  ['Orders and Availability', 'Products, prices, delivery slots, cleaning options, and availability may change based on catch availability, serviceability, weather, and operational constraints. We may cancel or modify orders when fulfillment is not possible.'],
  ['Payments and Refunds', 'Payments may be collected through Razorpay or other supported methods. Refunds, where applicable, are processed to the original payment method or as otherwise permitted by law and platform policy.'],
  ['Delivery', 'Delivery estimates are provided in good faith. Seafood freshness depends on receiving the order in the chosen slot and storing it properly after delivery.'],
  ['Freshness and Perishables', 'Seafood is perishable. Report damaged, missing, stale, or incorrect items promptly through support. Return eligibility may be limited after delivery acceptance.'],
  ['MFresh Pickles', 'Pickle products may contain fish, shellfish, spices, oil, and allergens. Please review product details before ordering.'],
  ['Limitation of Liability', 'To the maximum extent permitted by law, MFresh is not liable for indirect losses, business interruption, or issues outside reasonable operational control.'],
  ['Contact', 'For terms, support, or legal questions, contact hello@mfresh.in or MFresh, Kochi, Kerala, India.'],
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" intro="The terms for using MFresh seafood and MFresh Pickles ordering." sections={sections} />;
}
