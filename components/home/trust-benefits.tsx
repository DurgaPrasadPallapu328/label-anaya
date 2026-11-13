import { Icon } from "@/components/ui/icon";

const benefits = [
  { icon: "leaf", first: "Original", second: "Designs" },
  { icon: "tape", first: "Made to", second: "Order" },
  { icon: "shield", first: "Quality", second: "Assured" },
] as const;

export function TrustBenefits() {
  return (
    <section className="trust-benefits mx-auto rounded-2xl bg-pale-olive lg:hidden" aria-label="The Label Anaya promise">
      <ul className="grid grid-cols-3">
        {benefits.map((benefit) => <li key={benefit.first} className="trust-benefit relative flex min-w-0 flex-col items-center text-center"><Icon name={benefit.icon} className="text-olive" /><p><span className="block">{benefit.first}</span><span className="block">{benefit.second}</span></p></li>)}
      </ul>
    </section>
  );
}
