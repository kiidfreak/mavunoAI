"use client";

export default function MpesaHighlight() {
  return (
    <section className="bg-emerald-50 border-y border-emerald-100 py-16">
      <div className="container mx-auto px-4 max-w-5xl grid gap-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-emerald-700">
          Optional M-Pesa Upload: Boosting accuracy without blocking onboarding.
        </h2>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          We run a base credit model using satellite and engagement features for frictionless onboarding; users who consent to upload M-Pesa receive a boosted score via an MPesa-feature model. MPesa is a predictive booster, not a gate. All uploads are consented, redacted, and used only to improve scoring.
        </p>
      </div>
    </section>
  );
}
