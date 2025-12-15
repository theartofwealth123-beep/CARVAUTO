/**
 * Example adapter that returns a few mock listings.
 * Replace this with your authorized ingestion sources.
 */
export async function fetchListings() {
  return [
    {
      source: "mock",
      listing_url: "https://example.com/listing/1",
      title: "2019 Toyota Camry SE - Clean Title - VIN 4T1B11HK7KU123456",
      description: "Runs great. Clean title in hand.",
      price: 15900,
      year: 2019,
      make: "Toyota",
      model: "Camry",
      trim: "SE",
      mileage: 82000,
      market_id: null,
      image_urls: [
        "https://picsum.photos/seed/carvauto1/600/400",
        "https://picsum.photos/seed/carvauto2/600/400"
      ],
      // image analysis flags can be set later by OCR worker:
      plate_detected: false,
      vin_label_detected: false,
      vin_text_detected: false
    },
    {
      source: "mock",
      listing_url: "https://example.com/listing/2",
      title: "2018 F-150 XLT - rebuilt title",
      description: "Rebuilt title due to minor accident. Great truck.",
      price: 18900,
      year: 2018,
      make: "Ford",
      model: "F-150",
      trim: "XLT",
      mileage: 99000,
      market_id: null,
      image_urls: ["https://picsum.photos/seed/carvauto3/600/400"]
    }
  ];
}
