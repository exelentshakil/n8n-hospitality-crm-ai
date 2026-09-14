import { GuestLead, HospitalityQuote, SuiteType, CateringTier } from "./types";

export const SUITE_RATES: Record<SuiteType, { name: string; ratePerNight: number; description: string }> = {
  Presidential: {
    name: "Presidential Panoramic Suite",
    ratePerNight: 2850,
    description: "2,400 sq ft dual-level penthouse, private butler pantry, fireplace & mountain panorama."
  },
  Boutique_Villa: {
    name: "Private Alpine Chalet Villa",
    ratePerNight: 1950,
    description: "Multi-bedroom private estate villa, outdoor cedar hot tub, private kitchen & ski-in/out."
  },
  Executive_Suite: {
    name: "Executive Grand Mountain Suite",
    ratePerNight: 850,
    description: "850 sq ft luxury suite with dedicated work salon, marble spa bath, and scenic balcony."
  },
  Deluxe_King: {
    name: "Deluxe Mountainview King Room",
    ratePerNight: 420,
    description: "480 sq ft handcrafted timber room, featherbed, deep soaking tub, and espresso lounge."
  }
};

export const CATERING_RATES: Record<CateringTier, { name: string; perPersonPerDay: number; description: string }> = {
  Michelin_Plated: {
    name: "Michelin-Inspired 4-Course Plated Banquet",
    perPersonPerDay: 240,
    description: "Curated farm-to-table tasting menu paired with regional sommelier wine selections."
  },
  Full_Board: {
    name: "Executive Full-Board Culinary Package",
    perPersonPerDay: 295,
    description: "Gourmet hot breakfast, artisanal working luncheon, fireside afternoon tea & 3-course dinner."
  },
  Artisan_Buffet: {
    name: "Artisan Mountain Buffet & Live Carvery",
    perPersonPerDay: 165,
    description: "Rotational executive buffet featuring Pacific Northwest salmon, prime beef, and organic salads."
  },
  Cocktail_Reception: {
    name: "High-End Passed Canapés & Open Bar Reception",
    perPersonPerDay: 135,
    description: "Handcrafted hors d'oeuvres, oyster bar, and 4-hour premium craft cocktail service."
  }
};

export function calculateHospitalityQuote(lead: GuestLead): HospitalityQuote {
  const suiteConfig = SUITE_RATES[lead.suiteType] || SUITE_RATES.Executive_Suite;
  const cateringConfig = CATERING_RATES[lead.cateringTier] || CATERING_RATES.Artisan_Buffet;

  const suiteRatePerNight = suiteConfig.ratePerNight;
  const headcount = Math.max(1, lead.headcount || 1);
  const suiteCount = (lead.suiteCount && lead.suiteCount > 0) ? lead.suiteCount : Math.max(1, Math.ceil(headcount / 1.5));
  const nights = Math.max(1, lead.nights || 1);

  const roomSubtotal = suiteRatePerNight * suiteCount * nights;
  const cateringPerPerson = cateringConfig.perPersonPerDay;
  const cateringSubtotal = cateringPerPerson * headcount * nights;

  const avPackageFee = lead.avRequirement
    ? lead.headcount > 50
      ? 4800
      : 2400
    : 0;

  const subtotalBeforeTax = roomSubtotal + cateringSubtotal + avPackageFee;
  const serviceCharge = Math.round(subtotalBeforeTax * 0.18); // 18% standard luxury hospitality gratuity/service
  const taxableBase = subtotalBeforeTax + serviceCharge;
  const taxAmount = Math.round(taxableBase * 0.13); // 13% Harmonized Sales Tax (HST)
  const grandTotal = taxableBase + taxAmount;
  const depositRequired = Math.round(grandTotal * 0.30); // 30% advance deposit to secure dates

  return {
    quoteId: `Q-${lead.id.replace(/\D/g, "") || "84920"}-${lead.guestTier.slice(0, 3).toUpperCase()}`,
    suiteRatePerNight,
    suiteCount,
    nights,
    roomSubtotal,
    cateringPerPerson,
    headcount,
    cateringSubtotal,
    avPackageFee,
    subtotalBeforeTax,
    serviceCharge,
    taxAmount,
    grandTotal,
    depositRequired,
    balanceDueDays: 14,
    currency: "CAD",
    rateCardVersion: "v2026.4-APPROVED",
    basis: {
      roomBasis: `${suiteCount} suites × $${suiteRatePerNight.toLocaleString()}/nt × ${nights} nights = $${roomSubtotal.toLocaleString()}`,
      cateringBasis: `${headcount} guests × $${cateringPerPerson}/day × ${nights} days = $${cateringSubtotal.toLocaleString()}`,
      serviceFeeBasis: `18% on $${subtotalBeforeTax.toLocaleString()} subtotal = $${serviceCharge.toLocaleString()}`,
      taxBasis: `13% HST on $${taxableBase.toLocaleString()} = $${taxAmount.toLocaleString()}`
    }
  };
}
