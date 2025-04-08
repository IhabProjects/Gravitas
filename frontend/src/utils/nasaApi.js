// NASA API Configuration
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your NASA API key if needed
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Reliable planet image URLs from public sources
const PLANET_IMAGES = {
  Mercury: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/600px-Mercury_in_color_-_Prockter07-edit1.jpg',
  Venus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg',
  Earth: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/600px-The_Blue_Marble_%28remastered%29.jpg',
  Mars: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg',
  Jupiter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
  Saturn: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg',
  Uranus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg',
  Neptune: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg'
};

/**
 * Get the NASA Astronomy Picture of the Day
 * @param {string} date - Optional date in YYYY-MM-DD format
 * @returns {Promise<Object>} - APOD data
 */
export const getAstronomyPictureOfDay = async (date = null) => {
  try {
    let url = `${APOD_URL}?api_key=${NASA_API_KEY}`;
    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch APOD');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching APOD:', error);
    return null;
  }
};

/**
 * Get a random NASA Astronomy Picture of the Day
 * @returns {Promise<Object>} - Random APOD data
 */
export const getRandomAstronomyPicture = async () => {
  try {
    // Get a random date between June 16, 1995 (first APOD) and today
    const start = new Date('1995-06-16').getTime();
    const end = new Date().getTime();
    const randomDate = new Date(start + Math.random() * (end - start));

    // Format date as YYYY-MM-DD
    const formattedDate = randomDate.toISOString().split('T')[0];

    return await getAstronomyPictureOfDay(formattedDate);
  } catch (error) {
    console.error('Error fetching random APOD:', error);
    return null;
  }
};

/**
 * Get reliable image URL for a planet
 * @param {string} planetName - Name of the planet
 * @returns {string} - URL to the planet image
 */
export const getPlanetImage = (planetName) => {
  return PLANET_IMAGES[planetName] || PLANET_IMAGES.Earth;
};

export default {
  getPlanetImage,
  getAstronomyPictureOfDay,
  getRandomAstronomyPicture
};
