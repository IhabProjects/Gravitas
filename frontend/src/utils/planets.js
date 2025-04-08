import { getPlanetImage } from './nasaApi';

// Gravity values are relative to Earth's gravity (1g)
// Mass values in 10^24 kg
// Diameter in km
// Distance from Sun in millions of km

// Premium subscription tiers
export const PREMIUM_TIERS = {
  FREE: 'free',
  BASIC: 'basic',      // 2€ - Includes basic additional bodies
  PLUS: 'plus',        // 4€ - Includes all basic plus rare bodies
  EXPLORER: 'explorer' // 7€ - Includes all celestial bodies
};

// Map planets to required premium tiers
export const PLANET_ACCESS_TIERS = {
  mercury: PREMIUM_TIERS.FREE,
  venus: PREMIUM_TIERS.FREE,
  earth: PREMIUM_TIERS.FREE,
  mars: PREMIUM_TIERS.FREE,
  jupiter: PREMIUM_TIERS.BASIC,
  saturn: PREMIUM_TIERS.BASIC,
  uranus: PREMIUM_TIERS.PLUS,
  neptune: PREMIUM_TIERS.PLUS,
  pluto: PREMIUM_TIERS.EXPLORER
};

export const planets = [
  // Free planets - No changes needed
  {
    id: 1,
    name: "Mercury",
    gravitationalForce: 0.38,
    mass: 0.33,
    diameter: 4879,
    distanceFromSun: 57.9,
    dayLength: 4222.6, // hours
    yearLength: 88, // Earth days
    color: "bg-gray-400",
    description: "Mercury is the smallest and innermost planet in the Solar System. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/640px-Mercury_in_true_color.jpg",
    funFact: "Despite being the closest planet to the Sun, Mercury is not the hottest planet in our solar system – that title belongs to Venus. However, Mercury has the most extreme temperature variations, ranging from 430°C during the day to -180°C at night.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 2,
    name: "Venus",
    gravitationalForce: 0.91,
    mass: 4.87,
    diameter: 12104,
    distanceFromSun: 108.2,
    dayLength: 2802, // hours
    yearLength: 225, // Earth days
    color: "bg-yellow-200",
    description: "Venus is the second planet from the Sun and Earth's closest planetary neighbor. Venus has a thick toxic atmosphere filled with carbon dioxide and sulfuric acid clouds.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/640px-Venus-real_color.jpg",
    funFact: "Venus rotates in the opposite direction to most planets, meaning the Sun rises in the west and sets in the east. Its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with an average temperature of 462°C.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 3,
    name: "Earth",
    gravitationalForce: 1,
    mass: 5.97,
    diameter: 12756,
    distanceFromSun: 149.6,
    dayLength: 24, // hours
    yearLength: 365.25, // Earth days
    color: "bg-blue-500",
    description: "Earth is the third planet from the Sun and the only known place in the universe where life has originated and found habitability. It's home to millions of species, including humans.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/640px-The_Blue_Marble_%28remastered%29.jpg",
    funFact: "Earth is the only planet not named after a god. All other planets in our solar system are named after Roman deities.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 4,
    name: "Mars",
    gravitationalForce: 0.38,
    mass: 0.642,
    diameter: 6792,
    distanceFromSun: 227.9,
    dayLength: 24.7, // hours
    yearLength: 687, // Earth days
    color: "bg-red-600",
    description: "Mars is the fourth planet from the Sun. It is a dusty, cold, desert world with a very thin atmosphere. Mars is known as the Red Planet because iron minerals in the Martian soil oxidize, or rust, causing the soil to look red.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg",
    funFact: "Mars is home to Olympus Mons, the tallest mountain in the solar system. Standing at nearly 22 km (14 miles) high and 600 km (370 miles) across, it's roughly the size of Arizona and nearly three times the height of Mount Everest!",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 5,
    name: "Jupiter",
    gravitationalForce: 2.34,
    mass: 1898,
    diameter: 142984,
    distanceFromSun: 778.6,
    dayLength: 9.9, // hours
    yearLength: 4333, // Earth days
    color: "bg-yellow-600",
    description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass two and a half times that of all the other planets in the Solar System combined, but less than one-thousandth the mass of the Sun.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/640px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    funFact: "Jupiter has the shortest day of all the planets, completing a rotation in just under 10 hours. This rapid rotation causes the planet to bulge at the equator and flatten at the poles, making it noticeably oblate or egg-shaped rather than spherical.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 6,
    name: "Saturn",
    gravitationalForce: 1.06,
    mass: 568,
    diameter: 120536,
    distanceFromSun: 1433.5,
    dayLength: 10.7, // hours
    yearLength: 10759, // Earth days
    color: "bg-yellow-300",
    description: "Saturn is the sixth planet from the Sun and is famous for its spectacular rings. Like Jupiter, Saturn is a gas giant and is made mostly of hydrogen and helium.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/640px-Saturn_during_Equinox.jpg",
    funFact: "Saturn's iconic rings are made primarily of ice particles with a smaller amount of rocky debris and dust. Though they look solid from Earth, the rings are actually made up of countless small particles that range in size from tiny dust grains to objects as large as mountains.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 7,
    name: "Uranus",
    gravitationalForce: 0.92,
    mass: 86.8,
    diameter: 51118,
    distanceFromSun: 2872.5,
    dayLength: 17.2, // hours
    yearLength: 30687, // Earth days
    color: "bg-blue-300",
    description: "Uranus is the seventh planet from the Sun. It's an ice giant planet, similar to Neptune, with a thick atmosphere mostly made of hydrogen, helium, and methane. Uranus has a unique rotational axis, tilted nearly 98 degrees.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/640px-Uranus2.jpg",
    funFact: "Uranus rotates on its side, with its axis nearly perpendicular to its orbit around the Sun. This unique tilt causes extreme seasons that last for more than 20 years, with one hemisphere experiencing direct sunlight while the other is in complete darkness.",
    premiumTier: PREMIUM_TIERS.FREE
  },
  {
    id: 8,
    name: "Neptune",
    gravitationalForce: 1.19,
    mass: 102,
    diameter: 49528,
    distanceFromSun: 4495.1,
    dayLength: 16.1, // hours
    yearLength: 60190, // Earth days
    color: "bg-blue-700",
    description: "Neptune is the eighth and farthest-known planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/640px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
    funFact: "Neptune experiences the most violent weather in the solar system. Winds on Neptune can reach up to 2,100 kilometers (1,300 miles) per hour, the fastest in the solar system. These supersonic winds whip around the planet, driving massive storm systems across its surface.",
    premiumTier: PREMIUM_TIERS.FREE
  },

  // BASIC Premium Tier - Includes basic additional bodies
  {
    id: 9,
    name: "Pluto",
    gravitationalForce: 0.06,
    mass: 0.0146,
    diameter: 2376,
    distanceFromSun: 5906.4,
    dayLength: 153.3, // hours
    yearLength: 90560, // Earth days
    color: "bg-gray-300",
    description: "Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune. It was the first Kuiper belt object to be discovered and is the largest known dwarf planet.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/640px-Pluto_in_True_Color_-_High-Res.jpg",
    funFact: "Pluto has a heart-shaped glacier on its surface. This distinctive feature, named Tombaugh Regio after Pluto's discoverer Clyde Tombaugh, is composed of nitrogen, carbon monoxide, and methane ices that form a vast, bright plain roughly the size of Texas and Oklahoma combined.",
    premiumTier: PREMIUM_TIERS.BASIC
  },
  {
    id: 10,
    name: "Moon",
    gravitationalForce: 0.166,
    mass: 0.073,
    diameter: 3475,
    distanceFromSun: 149.6, // Same as Earth
    dayLength: 708, // hours
    yearLength: 27.3, // Earth days to orbit Earth
    color: "bg-gray-200",
    description: "Earth's Moon is the fifth largest moon in the solar system. The Moon's presence helps stabilize our planet's wobble, which helps stabilize our climate.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/640px-FullMoon2010.jpg",
    funFact: "The Moon is gradually moving away from Earth at a rate of approximately 3.8 cm per year. This is happening because the Moon's gravity creates tidal bulges on Earth, which get slightly ahead of the Moon due to Earth's rotation, pulling the Moon forward and causing it to gain energy and move to a wider orbit.",
    premiumTier: PREMIUM_TIERS.BASIC
  },
  {
    id: 11,
    name: "Ceres",
    gravitationalForce: 0.028,
    mass: 0.00093,
    diameter: 939,
    distanceFromSun: 413.7,
    dayLength: 9, // hours
    yearLength: 1682, // Earth days
    color: "bg-gray-400",
    description: "Ceres is the largest object in the asteroid belt between Mars and Jupiter. It is the only dwarf planet in the inner Solar System and was the first asteroid discovered in 1801.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg/640px-Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg",
    funFact: "Ceres contains almost a third of the total mass of the asteroid belt.",
    premiumTier: PREMIUM_TIERS.BASIC
  },

  // PLUS Premium Tier - More exotic moons and dwarf planets
  {
    id: 12,
    name: "Europa",
    gravitationalForce: 0.134,
    mass: 0.048,
    diameter: 3122,
    distanceFromSun: 778.6, // Same as Jupiter
    dayLength: 85, // hours
    yearLength: 3.5, // Earth days to orbit Jupiter
    color: "bg-blue-100",
    description: "Europa is one of Jupiter's largest moons and has a surface of mostly ice. Scientists believe there is a salty ocean beneath Europa's icy crust that may contain twice as much water as all of Earth's oceans combined.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon.jpg/640px-Europa-moon.jpg",
    funFact: "Europa is believed to have an ocean of liquid water beneath its icy surface that contains more water than all of Earth's oceans combined. This subsurface ocean, along with Europa's internal heat source and potential nutrients, makes it one of the most promising places in our solar system to search for extraterrestrial life.",
    premiumTier: PREMIUM_TIERS.PLUS
  },
  {
    id: 13,
    name: "Titan",
    gravitationalForce: 0.138,
    mass: 0.1345,
    diameter: 5149,
    distanceFromSun: 1433.5, // Same as Saturn
    dayLength: 382, // hours
    yearLength: 16, // Earth days to orbit Saturn
    color: "bg-yellow-800",
    description: "Titan is Saturn's largest moon and the second-largest in the solar system. It's the only moon known to have a dense atmosphere, and it's the only world besides Earth where clear evidence of surface liquid has been found.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Titan_in_true_color.jpg/640px-Titan_in_true_color.jpg",
    funFact: "Titan has rain, lakes and seas of liquid methane and ethane, and a complete methane cycle similar to Earth's water cycle. It's the only body in our solar system besides Earth with stable liquid on its surface, though it's methane rather than water.",
    premiumTier: PREMIUM_TIERS.PLUS
  },
  {
    id: 14,
    name: "Io",
    gravitationalForce: 0.183,
    mass: 0.0893,
    diameter: 3643,
    distanceFromSun: 778.6,
    dayLength: 42.5,
    yearLength: 1.77,
    color: "bg-yellow-500",
    description: "Io is the innermost of the four Galilean moons of Jupiter and the fourth-largest moon in the Solar System. It's also the most volcanically active body in our solar system.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Io_highest_resolution_true_color.jpg/640px-Io_highest_resolution_true_color.jpg",
    funFact: "Io has over 400 active volcanoes, making it the most geologically active object in the Solar System. Some of its volcanoes eject plumes of sulfur and sulfur dioxide up to 500 km (310 mi) into space, giving the moon its distinctive yellow, orange, and red appearance.",
    premiumTier: PREMIUM_TIERS.PLUS
  },
  {
    id: 15,
    name: "Ganymede",
    gravitationalForce: 0.146,
    mass: 0.148,
    diameter: 5268,
    distanceFromSun: 778.6,
    dayLength: 171.7,
    yearLength: 7.15,
    color: "bg-gray-400",
    description: "Ganymede is the largest moon of Jupiter and in the entire Solar System. It's the only moon known to have its own magnetic field and is larger than the planet Mercury.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Galileo_Remastered.jpg/640px-Ganymede_-_Galileo_Remastered.jpg",
    funFact: "Despite being a moon, Ganymede is larger than the planet Mercury. It's the only moon in our solar system known to generate its own magnetic field, suggesting a molten iron core like Earth's.",
    premiumTier: PREMIUM_TIERS.PLUS
  },
  {
    id: 16,
    name: "Enceladus",
    gravitationalForce: 0.012,
    mass: 0.000108,
    diameter: 504,
    distanceFromSun: 1433.5,
    dayLength: 32.9,
    yearLength: 1.37,
    color: "bg-blue-100",
    description: "Enceladus is the sixth-largest moon of Saturn. It's mostly covered by fresh, clean ice, making it one of the most reflective bodies in the Solar System.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/PIA17202_-_Approaching_Enceladus.jpg/640px-PIA17202_-_Approaching_Enceladus.jpg",
    funFact: "Despite its small size, Enceladus has geysers that spray water from its subsurface ocean into space. These plumes contain organic compounds, suggesting the possibility of conditions that could support life in its subsurface ocean.",
    premiumTier: PREMIUM_TIERS.PLUS
  },

  // EXPLORER Premium Tier - Most exotic celestial bodies
  {
    id: 17,
    name: "Sun",
    gravitationalForce: 27.9,
    mass: 1989000,
    diameter: 1392700,
    distanceFromSun: 0,
    dayLength: 609.6,
    yearLength: 0,
    color: "bg-yellow-500",
    description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core, radiating the energy mainly as light and infrared radiation.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/The_Sun_in_white_light.jpg/640px-The_Sun_in_white_light.jpg",
    funFact: "The Sun accounts for 99.86% of the total mass of the entire Solar System. It would take around 1.3 million Earths to fill the volume of the Sun, and every second, it converts about 600 million tons of hydrogen into helium through nuclear fusion, releasing enormous amounts of energy in the process.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  },
  {
    id: 18,
    name: "Eris",
    gravitationalForce: 0.084,
    mass: 0.0166,
    diameter: 2326,
    distanceFromSun: 10180,
    dayLength: 25.9,
    yearLength: 203600,
    color: "bg-gray-300",
    description: "Eris is the most massive and second-largest known dwarf planet in the Solar System. It's located in the scattered disc, a region beyond the Kuiper belt.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Eris_and_dysnomia2.jpg/640px-Eris_and_dysnomia2.jpg",
    funFact: "Eris was once considered for designation as the tenth planet, and its discovery was a key factor in the 2006 debate that led to Pluto's reclassification as a dwarf planet. Despite being smaller in diameter, Eris is actually 27% more massive than Pluto.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  },
  {
    id: 19,
    name: "Triton",
    gravitationalForce: 0.079,
    mass: 0.0214,
    diameter: 2707,
    distanceFromSun: 4495.1,
    dayLength: 141,
    yearLength: 5.88,
    color: "bg-blue-200",
    description: "Triton is the largest natural satellite of Neptune and was the first Neptunian moon to be discovered. It's the only large moon in the Solar System with a retrograde orbit.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg/640px-Triton_moon_mosaic_Voyager_2_%28large%29.jpg",
    funFact: "Triton orbits Neptune in the opposite direction to the planet's rotation (retrograde), suggesting it was captured from the Kuiper Belt rather than forming alongside Neptune. It's also one of the coldest objects in our solar system at -235°C and has active nitrogen geysers despite this extreme cold.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  },
  {
    id: 20,
    name: "Makemake",
    gravitationalForce: 0.05,
    mass: 0.0046,
    diameter: 1430,
    distanceFromSun: 6850,
    dayLength: 22.5,
    yearLength: 112897,
    color: "bg-red-300",
    description: "Makemake is a dwarf planet and the second-largest Kuiper belt object in the classical population. It has no known natural satellites and appears red in color.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Makemake_moon_Hubble_image_with_legend_%28cropped%29.jpg/640px-Makemake_moon_Hubble_image_with_legend_%28cropped%29.jpg",
    funFact: "Makemake is named after the creator deity of the Rapa Nui people of Easter Island. It's covered in methane ice and has a reddish-brown color similar to Pluto, but unlike many other large trans-Neptunian objects, it lacks a detectable atmosphere.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  },
  {
    id: 21,
    name: "Haumea",
    gravitationalForce: 0.044,
    mass: 0.0041,
    diameter: 1632, // Longest axis (elongated shape)
    distanceFromSun: 6452,
    dayLength: 3.92,
    yearLength: 103468,
    color: "bg-gray-200",
    description: "Haumea is a dwarf planet located beyond Neptune's orbit. It's notable for its unusual elongated shape and rapid rotation, which causes it to be flattened at the poles and elongated at the equator.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Haumea%2C_Celestia.jpg/640px-Haumea%2C_Celestia.jpg",
    funFact: "Haumea has one of the strangest shapes of any known large object in the solar system - it resembles a flattened football due to its extremely fast rotation (one day on Haumea lasts less than 4 hours). It also has a ring system and two known moons.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  },
  {
    id: 22,
    name: "Black Hole",
    gravitationalForce: 2000000, // Theoretical value near event horizon
    mass: 30000000000, // Stellar mass black hole
    diameter: 60, // Event horizon of a typical stellar black hole
    distanceFromSun: 3000 * 9460730777119.6, // 3000 light years in km
    dayLength: 0,
    yearLength: 0,
    color: "bg-black",
    description: "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. They form when massive stars collapse at the end of their life cycle.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/640px-Black_hole_-_Messier_87_crop_max_res.jpg",
    funFact: "If you could somehow stand on a black hole's event horizon (the boundary beyond which nothing can escape), you would experience time at half the rate of someone watching you from far away. The first-ever image of a black hole was captured in 2019, showing the supermassive black hole at the center of galaxy M87.",
    premiumTier: PREMIUM_TIERS.EXPLORER
  }
];

// Function to calculate weight on other planets based on Earth weight
export function calculatePlanetWeight(earthWeight) {
  if (isNaN(earthWeight) || earthWeight <= 0) {
    throw new Error('Please enter a valid weight greater than 0');
  }

  return planets.map(planet => {
    // Create a deep copy to avoid mutating the original planet object
    const planetData = { ...planet };

    // Calculate the weight on this planet
    planetData.weight = parseFloat((earthWeight * planet.gravitationalForce).toFixed(1));

    return planetData;
  });
}

// Function to get planets accessible based on subscription level
export function getAccessiblePlanets(subscriptionTier = PREMIUM_TIERS.FREE) {
  switch (subscriptionTier) {
    case PREMIUM_TIERS.EXPLORER:
      return planets; // All planets
    case PREMIUM_TIERS.PLUS:
      return planets.filter(planet =>
        planet.premiumTier === PREMIUM_TIERS.FREE ||
        planet.premiumTier === PREMIUM_TIERS.BASIC ||
        planet.premiumTier === PREMIUM_TIERS.PLUS
      );
    case PREMIUM_TIERS.BASIC:
      return planets.filter(planet =>
        planet.premiumTier === PREMIUM_TIERS.FREE ||
        planet.premiumTier === PREMIUM_TIERS.BASIC
      );
    case PREMIUM_TIERS.FREE:
    default:
      return planets.filter(planet => planet.premiumTier === PREMIUM_TIERS.FREE);
  }
}
