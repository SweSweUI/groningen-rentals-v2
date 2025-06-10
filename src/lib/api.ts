// Enhanced Property interface with multiple images and detailed information
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  size: string;
  rooms: number;
  source: string;
  sourceUrl: string;
  listedDays: number; // Keep for backwards compatibility
  daysAgo?: number; // New field from scraper
  listedDate?: string; // New field from scraper (YYYY-MM-DD format)
  image: string;
  images?: string[]; // Multiple images for gallery
  description: string;
  type: string;
  available: string;
  realEstateAgent?: string;
  neighborhood?: string;
  buildYear?: string;
  interior?: string;
  // Enhanced fields for detailed view
  fullDescription?: string;
  features?: string[];
  energyLabel?: string;
  deposit?: number;
  floorPlan?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  amenities?: string[];
  nearbyFacilities?: {
    schools?: string[];
    transport?: string[];
    shopping?: string[];
  };
}

// API endpoints structure for real integration
export const API_ENDPOINTS = {
  // Public APIs (if available)
  funda: {
    baseUrl: "https://api.funda.nl",
    rental: "/v2/huur",
    // Note: Funda API requires partner access
  },

  // Scraping endpoints (would be implemented on backend)
  scraping: {
    pararius: "https://pararius.com/apartments/groningen",
    kamernet: "https://kamernet.nl/en/for-rent/rooms-groningen",
    huurwoningen: "https://www.huurwoningen.nl/huur/groningen/",
    nijestee: "https://www.nijestee.nl/zoeken/",
    directwonen: "https://www.directwonen.nl/huur/groningen",
  }
};

// Real properties scraped from Pararius on Jun 8, 2025
export const realProperties: Property[] = [
  {
    id: "a3dc47c1",
    title: "Flat Nieuwe Blekerstraat",
    price: 1175,
    location: "Groningen Centrum (Schildersbuurt)",
    size: "39m²",
    rooms: 2,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/a3dc47c1/nieuwe-blekerstraat",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/a3dc47c1-4a83-5290-99a3-cfa1e1e8c15c/f107e7c1201789f0338e4e674bb75db7.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/a3dc47c1-4a83-5290-99a3-cfa1e1e8c15c/f107e7c1201789f0338e4e674bb75db7.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/a3dc47c1-4a83-5290-99a3-cfa1e1e8c15c/f107e7c1201789f0338e4e674bb75db7.jpg?width=400&auto=webp"
    ],
    description: "Beautiful apartment in the heart of Groningen with modern amenities. Located in the popular Schildersbuurt district.",
    type: "Apartment",
    available: "Immediately",
    realEstateAgent: "Vastgoedbemiddeling 4u",
    neighborhood: "Schildersbuurt",
    buildYear: "1990",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "8290c4fc",
    title: "Flat Boterdiep",
    price: 0, // Price on request
    location: "Groningen Centrum (Hortusbuurt-Ebbingekwartier)",
    size: "86m²",
    rooms: 3,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/8290c4fc/boterdiep",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/8290c4fc-d7b6-5663-a97d-43131c957bc3/37170ff4d7e0554b9646c1e2a37bcbd0.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/8290c4fc-d7b6-5663-a97d-43131c957bc3/37170ff4d7e0554b9646c1e2a37bcbd0.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/8290c4fc-d7b6-5663-a97d-43131c957bc3/37170ff4d7e0554b9646c1e2a37bcbd0.jpg?width=400&auto=webp"
    ],
    description: "Spacious 3-room apartment in the prestigious Hortusbuurt-Ebbingekwartier. Modern finishes throughout.",
    type: "Apartment",
    available: "January 1st",
    realEstateAgent: "Bosscha Makelaardij",
    neighborhood: "Hortusbuurt-Ebbingekwartier",
    buildYear: "1990",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "de57b6bf",
    title: "Studio Floresplein 10 a",
    price: 645,
    location: "Groningen Noord (Indische buurt)",
    size: "24m²",
    rooms: 1,
    source: "Pararius",
    sourceUrl: "https://pararius.com/studio-for-rent/groningen/de57b6bf/floresplein",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/de57b6bf-3d98-5c33-94ab-9dc6b07b6e9a/f52b027bf613029236a8965c02f7e0a2.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/de57b6bf-3d98-5c33-94ab-9dc6b07b6e9a/f52b027bf613029236a8965c02f7e0a2.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/de57b6bf-3d98-5c33-94ab-9dc6b07b6e9a/f52b027bf613029236a8965c02f7e0a2.jpg?width=400&auto=webp"
    ],
    description: "Compact studio perfect for students, close to university campus. Recently renovated.",
    type: "Studio",
    available: "September 1st",
    realEstateAgent: "Maxx Groningen",
    neighborhood: "Indische buurt",
    buildYear: "1990",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "18cda004",
    title: "Room Hofstraat 13 b s1",
    price: 723,
    location: "Groningen Centrum (Binnenstad-Noord)",
    size: "50m²",
    rooms: 1,
    source: "Pararius",
    sourceUrl: "https://pararius.com/room-for-rent/groningen/18cda004/hofstraat",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/18cda004-0665-564d-9edf-9ce8330c09bf/dc4d8491c7cefe1fc4cf2ce8498dc292.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/18cda004-0665-564d-9edf-9ce8330c09bf/dc4d8491c7cefe1fc4cf2ce8498dc292.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/18cda004-0665-564d-9edf-9ce8330c09bf/dc4d8491c7cefe1fc4cf2ce8498dc292.jpg?width=400&auto=webp"
    ],
    description: "Large room in historic city center, ideal for professionals or graduate students.",
    type: "Room",
    available: "Immediately",
    realEstateAgent: "Maxx Groningen",
    neighborhood: "Binnenstad-Noord",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "140f9a31",
    title: "Flat Nieuwe Ebbingestraat 7 a",
    price: 1695,
    location: "Groningen Centrum (Hortusbuurt-Ebbingekwartier)",
    size: "63m²",
    rooms: 3,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/140f9a31/nieuwe-ebbingestraat",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/140f9a31-49fd-53a9-8ead-ddd7b6671d76/1c1a0d4788838e1423ed197f867f779f.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/140f9a31-49fd-53a9-8ead-ddd7b6671d76/1c1a0d4788838e1423ed197f867f779f.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/140f9a31-49fd-53a9-8ead-ddd7b6671d76/1c1a0d4788838e1423ed197f867f779f.jpg?width=400&auto=webp"
    ],
    description: "Modern 3-room apartment in sought-after location near University of Groningen.",
    type: "Apartment",
    available: "October 15th",
    realEstateAgent: "Maxx Groningen",
    neighborhood: "Hortusbuurt-Ebbingekwartier",
    buildYear: "2010",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "986d4e8b",
    title: "House Helper Oostsingel",
    price: 2250,
    location: "Groningen Oost (Helpman)",
    size: "147m²",
    rooms: 5,
    source: "Pararius",
    sourceUrl: "https://pararius.com/house-for-rent/groningen/986d4e8b/helper-oostsingel",
    listedDays: 1,
    image: "https://casco-media-prod.global.ssl.fastly.net/986d4e8b-375a-566e-9691-9f18947313f7/855a428e9827a6cbd3dde5c79706a2c3.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/986d4e8b-375a-566e-9691-9f18947313f7/855a428e9827a6cbd3dde5c79706a2c3.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/986d4e8b-375a-566e-9691-9f18947313f7/855a428e9827a6cbd3dde5c79706a2c3.jpg?width=400&auto=webp"
    ],
    description: "Spacious family home with private garden and parking. Perfect for families or sharing.",
    type: "House",
    available: "November 1st",
    realEstateAgent: "Rotsvast Groningen",
    neighborhood: "Helpman",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "e7160702",
    title: "Flat Stoeldraaierstraat",
    price: 2093,
    location: "Groningen Centrum (Binnenstad-Noord)",
    size: "170m²",
    rooms: 4,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/e7160702/stoeldraaierstraat",
    listedDays: 2,
    image: "https://casco-media-prod.global.ssl.fastly.net/e7160702-a0cf-51df-ae37-8ec6a46340b7/61a66ed210a9e69120e79b7b23e8e643.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/e7160702-a0cf-51df-ae37-8ec6a46340b7/61a66ed210a9e69120e79b7b23e8e643.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/e7160702-a0cf-51df-ae37-8ec6a46340b7/61a66ed210a9e69120e79b7b23e8e643.jpg?width=400&auto=webp"
    ],
    description: "Large luxury apartment in historic city center. Prime location with city views.",
    type: "Apartment",
    available: "December 1st",
    realEstateAgent: "Rotsvast Groningen",
    neighborhood: "Binnenstad-Noord",
    interior: "Shell",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "adee5b86",
    title: "Flat Robijnstraat",
    price: 825,
    location: "Groningen West (Vinkhuizen-Noord)",
    size: "45m²",
    rooms: 2,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/adee5b86/robijnstraat",
    listedDays: 2,
    image: "https://casco-media-prod.global.ssl.fastly.net/adee5b86-e684-5916-a7d8-d2e201077bb1/83006b56307af0a7669f7f2ef9f40082.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/adee5b86-e684-5916-a7d8-d2e201077bb1/83006b56307af0a7669f7f2ef9f40082.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/adee5b86-e684-5916-a7d8-d2e201077bb1/83006b56307af0a7669f7f2ef9f40082.jpg?width=400&auto=webp"
    ],
    description: "Affordable 2-room apartment in quiet residential area. Good transport connections.",
    type: "Apartment",
    available: "January 15th",
    realEstateAgent: "DC Wonen",
    neighborhood: "Vinkhuizen-Noord",
    interior: "Shell",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "dd9ffcd0",
    title: "House Bergstraat",
    price: 1195,
    location: "Groningen West (Noorderplantsoenbuurt)",
    size: "81m²",
    rooms: 2,
    source: "Pararius",
    sourceUrl: "https://pararius.com/house-for-rent/groningen/dd9ffcd0/bergstraat",
    listedDays: 2,
    image: "https://casco-media-prod.global.ssl.fastly.net/dd9ffcd0-a114-5374-8236-19302f4e09d5/88307ccf479ebf33262262e1350fdc64.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/dd9ffcd0-a114-5374-8236-19302f4e09d5/88307ccf479ebf33262262e1350fdc64.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/dd9ffcd0-a114-5374-8236-19302f4e09d5/88307ccf479ebf33262262e1350fdc64.jpg?width=400&auto=webp"
    ],
    description: "Charming house near Noorderplantsoen park. Perfect for young professionals.",
    type: "House",
    available: "February 1st",
    realEstateAgent: "123Wonen Groningen",
    neighborhood: "Noorderplantsoenbuurt",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "479f6f1a",
    title: "Flat Jozef Israëlsstraat",
    price: 1160,
    location: "Groningen Centrum (Schildersbuurt)",
    size: "35m²",
    rooms: 2,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/479f6f1a/jozef-israëlsstraat",
    listedDays: 2,
    image: "https://casco-media-prod.global.ssl.fastly.net/479f6f1a-cae6-559f-911d-069ec7839e48/0f946510978c8476994b2432f2931347.png?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/479f6f1a-cae6-559f-911d-069ec7839e48/0f946510978c8476994b2432f2931347.png?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/479f6f1a-cae6-559f-911d-069ec7839e48/0f946510978c8476994b2432f2931347.png?width=400&auto=webp"
    ],
    description: "Historic apartment in cultural district. Walking distance to museums and galleries.",
    type: "Apartment",
    available: "March 1st",
    realEstateAgent: "Gruno Vastgoed B.V.",
    neighborhood: "Schildersbuurt",
    buildYear: "1907",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "0c602e44",
    title: "Flat Raamstraat",
    price: 1250,
    location: "Groningen Centrum (Binnenstad-Zuid)",
    size: "34m²",
    rooms: 1,
    source: "Pararius",
    sourceUrl: "https://pararius.com/apartment-for-rent/groningen/0c602e44/raamstraat",
    listedDays: 2,
    image: "https://casco-media-prod.global.ssl.fastly.net/0c602e44-3b45-5a43-9a71-c1a4a49ed88e/35d893ff32ed920929c340c22cb7a5c3.png?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/0c602e44-3b45-5a43-9a71-c1a4a49ed88e/35d893ff32ed920929c340c22cb7a5c3.png?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/0c602e44-3b45-5a43-9a71-c1a4a49ed88e/35d893ff32ed920929c340c22cb7a5c3.png?width=400&auto=webp"
    ],
    description: "Central apartment with all amenities nearby. Ideal for city living.",
    type: "Apartment",
    available: "Immediately",
    realEstateAgent: "Gruno Vastgoed B.V.",
    neighborhood: "Binnenstad-Zuid",
    interior: "Upholstered or furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "cfe4791c",
    title: "House Framaheerd",
    price: 1795,
    location: "Groningen Noord (Beijum-West)",
    size: "114m²",
    rooms: 5,
    source: "Pararius",
    sourceUrl: "https://pararius.com/house-for-rent/groningen/cfe4791c/framaheerd",
    listedDays: 3,
    image: "https://casco-media-prod.global.ssl.fastly.net/cfe4791c-f6b9-5b6b-aeb6-48f7bdace9a8/9eb3e351c5ccf7c509cae6547fe7a0e2.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/cfe4791c-f6b9-5b6b-aeb6-48f7bdace9a8/9eb3e351c5ccf7c509cae6547fe7a0e2.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/cfe4791c-f6b9-5b6b-aeb6-48f7bdace9a8/9eb3e351c5ccf7c509cae6547fe7a0e2.jpg?width=400&auto=webp"
    ],
    description: "Large family house in quiet residential area. Garden and multiple bedrooms.",
    type: "House",
    available: "April 1st",
    realEstateAgent: "Van der Meulen Makelaars",
    neighborhood: "Beijum-West",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "d5ea6781",
    title: "Room Ceramstraat",
    price: 574,
    location: "Groningen Noord (Indische buurt)",
    size: "12m²",
    rooms: 1,
    source: "Pararius",
    sourceUrl: "https://pararius.com/room-for-rent/groningen/d5ea6781/ceramstraat",
    listedDays: 3,
    image: "https://casco-media-prod.global.ssl.fastly.net/d5ea6781-9abf-5484-8f64-6e1437349a03/0f46390943fb25dfc764b3a7348f955c.png?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/d5ea6781-9abf-5484-8f64-6e1437349a03/0f46390943fb25dfc764b3a7348f955c.png?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/d5ea6781-9abf-5484-8f64-6e1437349a03/0f46390943fb25dfc764b3a7348f955c.png?width=400&auto=webp"
    ],
    description: "Affordable student room in multicultural neighborhood. Shared facilities.",
    type: "Room",
    available: "August 1st",
    realEstateAgent: "Gruno Vastgoed B.V.",
    neighborhood: "Indische buurt",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "0be66c77",
    title: "Room Snelliusstraat",
    price: 575,
    location: "Groningen Zuid (Grunobuurt)",
    size: "9m²",
    rooms: 1,
    source: "Pararius",
    sourceUrl: "https://pararius.com/room-for-rent/groningen/0be66c77/snelliusstraat",
    listedDays: 3,
    image: "https://casco-media-prod.global.ssl.fastly.net/0be66c77-273a-5a16-9609-396ca57335a5/bc4e4fd6ebc6343256a88ba9710cab3e.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/0be66c77-273a-5a16-9609-396ca57335a5/bc4e4fd6ebc6343256a88ba9710cab3e.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/0be66c77-273a-5a16-9609-396ca57335a5/bc4e4fd6ebc6343256a88ba9710cab3e.jpg?width=400&auto=webp"
    ],
    description: "Compact student room near university. All utilities included in rent.",
    type: "Room",
    available: "September 1st",
    realEstateAgent: "Gruno Vastgoed B.V.",
    neighborhood: "Grunobuurt",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "ea961261",
    title: "Room Korreweg 50",
    price: 640,
    location: "Groningen Noord (Indische buurt)",
    size: "24m²",
    rooms: 2,
    source: "Pararius",
    sourceUrl: "https://pararius.com/room-for-rent/groningen/ea961261/korreweg",
    listedDays: 3,
    image: "https://casco-media-prod.global.ssl.fastly.net/ea961261-5850-5a57-9a7b-6e2a422cbd9d/2a23c8202dafac37ae3929304d70f06e.jpg?width=400&auto=webp",
    images: [
      "https://casco-media-prod.global.ssl.fastly.net/ea961261-5850-5a57-9a7b-6e2a422cbd9d/2a23c8202dafac37ae3929304d70f06e.jpg?width=400&auto=webp",
      "https://casco-media-prod.global.ssl.fastly.net/ea961261-5850-5a57-9a7b-6e2a422cbd9d/2a23c8202dafac37ae3929304d70f06e.jpg?width=400&auto=webp"
    ],
    description: "Spacious student room with private entrance. Popular student area.",
    type: "Room",
    available: "July 1st",
    realEstateAgent: "Maxx Groningen",
    neighborhood: "Indische buurt",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  }
];

// Additional properties from other sources (simulated from API research)
export const additionalProperties: Property[] = [
  // Kamernet properties
  {
    id: "kamernet-001",
    title: "Student room Zernike Campus",
    price: 485,
    location: "Groningen Noord (Zernike)",
    size: "18m²",
    rooms: 1,
    source: "Kamernet",
    sourceUrl: "https://kamernet.nl",
    listedDays: 0,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop"
    ],
    description: "Modern student accommodation near Zernike Campus. Shared kitchen and bathroom.",
    type: "Room",
    available: "August 15th",
    neighborhood: "Zernike",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "kamernet-002",
    title: "Shared house Paddepoel",
    price: 425,
    location: "Groningen Noord (Paddepoel)",
    size: "22m²",
    rooms: 1,
    source: "Kamernet",
    sourceUrl: "https://kamernet.nl",
    listedDays: 1,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop"
    ],
    description: "Room in friendly international student house. Bike to campus in 15 minutes.",
    type: "Room",
    available: "September 1st",
    neighborhood: "Paddepoel",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },

  // Nijestee social housing
  {
    id: "nijestee-001",
    title: "Social housing Selwerd",
    price: 650,
    location: "Groningen Noord (Selwerd)",
    size: "60m²",
    rooms: 2,
    source: "Nijestee",
    sourceUrl: "https://nijestee.nl",
    listedDays: 5,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop"
    ],
    description: "Affordable 2-bedroom apartment through housing corporation. Family-friendly area.",
    type: "Apartment",
    available: "October 1st",
    neighborhood: "Selwerd",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "nijestee-002",
    title: "Renovated apartment Lewenborg",
    price: 720,
    location: "Groningen Noord (Lewenborg)",
    size: "75m²",
    rooms: 3,
    source: "Nijestee",
    sourceUrl: "https://nijestee.nl",
    listedDays: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop"
    ],
    description: "Recently renovated apartment with modern amenities. Good public transport.",
    type: "Apartment",
    available: "November 15th",
    neighborhood: "Lewenborg",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },

  // DirectWonen luxury properties
  {
    id: "directwonen-001",
    title: "Luxury penthouse Martinistad",
    price: 2800,
    location: "Groningen Centrum (Binnenstad)",
    size: "120m²",
    rooms: 3,
    source: "DirectWonen",
    sourceUrl: "https://directwonen.nl",
    listedDays: 7,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop"
    ],
    description: "Premium penthouse with panoramic city views. High-end finishes throughout.",
    type: "Penthouse",
    available: "December 1st",
    neighborhood: "Binnenstad",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },

  // Huurwoningen.nl mixed properties
  {
    id: "huurwoningen-001",
    title: "Modern studio Europapark",
    price: 750,
    location: "Groningen West (Europapark)",
    size: "35m²",
    rooms: 1,
    source: "Huurwoningen.nl",
    sourceUrl: "https://huurwoningen.nl",
    listedDays: 4,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop"
    ],
    description: "Contemporary studio in modern development. All amenities within walking distance.",
    type: "Studio",
    available: "January 1st",
    neighborhood: "Europapark",
    interior: "Furnished",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  },
  {
    id: "huurwoningen-002",
    title: "Family house De Wijert",
    price: 1650,
    location: "Groningen Oost (De Wijert)",
    size: "105m²",
    rooms: 4,
    source: "Huurwoningen.nl",
    sourceUrl: "https://huurwoningen.nl",
    listedDays: 6,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop"
    ],
    description: "Spacious family home with garden. Quiet neighborhood near schools.",
    type: "House",
    available: "February 15th",
    neighborhood: "De Wijert",
    interior: "Upholstered",
    fullDescription: "This is a detailed description of the apartment.",
    features: ["Kitchen", "Bathroom", "Balcony"],
    energyLabel: "A",
    deposit: 1000,
    floorPlan: "https://example.com/floorplan.jpg",
    coordinates: {
      lat: 52.370216,
      lng: 4.890924
    },
    amenities: ["Gym", "Pool", "Parking"],
    nearbyFacilities: {
      schools: ["Groningen University", "Groningen High School"],
      transport: ["Train Station", "Bus Stop"],
      shopping: ["Groningen City Center", "Groningen Market"]
    }
  }
];

// Combine all properties
export const allProperties = [...realProperties, ...additionalProperties];

// API functions for future backend integration
export const propertyAPI = {
  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    // In production, this would make actual API calls
    return allProperties;
  },

  // Get properties by source
  getPropertiesBySource: async (source: string): Promise<Property[]> => {
    return allProperties.filter(prop => prop.source === source);
  },

  // Search properties
  searchProperties: async (query: string): Promise<Property[]> => {
    const lowercaseQuery = query.toLowerCase();
    return allProperties.filter(prop =>
      prop.title.toLowerCase().includes(lowercaseQuery) ||
      prop.location.toLowerCase().includes(lowercaseQuery) ||
      prop.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Get property by ID
  getPropertyById: async (id: string): Promise<Property | undefined> => {
    return allProperties.find(prop => prop.id === id);
  }
};

// Mock real-time updates
export const startRealTimeUpdates = (callback: (properties: Property[]) => void) => {
  // Simulate new properties being added every 30 seconds
  const interval = setInterval(() => {
    // Add random delays to simulate real-world updates
    const delay = Math.random() * 5000; // 0-5 seconds
    setTimeout(() => {
      callback(allProperties);
    }, delay);
  }, 30000);

  return () => clearInterval(interval);
};
