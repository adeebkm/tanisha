// Utility to generate AI-generated fake images for research simulation

/**
 * Generates a seed-based hash for consistent image selection
 */
const getSeedHash = (seed: string): number => {
  return seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
};

/**
 * Get an AI-generated face image URL using DiceBear API
 * This generates consistent, realistic-looking faces based on a seed
 */
export const getAIGeneratedFace = (seed: string, size: number = 200): string => {
  // Use DiceBear Personas API for AI-generated faces
  // The seed ensures the same person is generated for the same seed
  const normalizedSeed = seed.replace(/[^a-zA-Z0-9]/g, '') || 'default';
  return `https://api.dicebear.com/7.x/personas/png?seed=${normalizedSeed}&size=${size}`;
};

/**
 * Get an AI-generated banner/background image
 */
export const getAIGeneratedBanner = (seed: string, width: number = 1200, height: number = 300): string => {
  // Use a different style for banners - use abstract patterns
  const normalizedSeed = seed.replace(/[^a-zA-Z0-9]/g, '') || 'default';
  return `https://api.dicebear.com/7.x/shapes/png?seed=${normalizedSeed}&size=${width}&backgroundColor=0077b5`;
};

/**
 * Get a fake image URL for a result - now using AI-generated faces
 */
export const getFakeImageUrl = (resultId: string, type: 'avatar' | 'thumbnail' | 'header' = 'avatar'): string => {
  const dimensions = {
    avatar: 200,      // Profile pictures - larger for better quality
    thumbnail: 150,  // Thumbnails
    header: 1200     // Banner/header images
  };
  
  const size = dimensions[type];
  
  // Use specific image for Akhilesh Kotegar as requested
  if (resultId.toLowerCase() === 'akhilesh' && (type === 'avatar' || type === 'thumbnail')) {
    return 'https://media.licdn.com/dms/image/v2/C4D03AQFgiUNxZzODeg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1661234870909?e=1771459200&v=beta&t=0a9tUlxh-uDfEhPsV0rMCUx37l1bTukNk0E5HZMaXFI';
  }

  // Use specific image for Ayush Daga as requested
  if (resultId.toLowerCase() === 'ayush' && (type === 'avatar' || type === 'thumbnail')) {
    return 'https://media.licdn.com/dms/image/v2/D5635AQFPnMUNW0T8Fg/profile-framedphoto-shrink_800_800/B56ZnLKuZlKMAg-/0/1760050210667?e=1770764400&v=beta&t=9WxdxjAnLYBGMS9feRHeccWfyvVJUZmBv7A8c662xnk';
  }

  // Use profile picture from Photos folder for Tanisha Jefferson (African American Female)
  if ((resultId.toLowerCase().includes('tanisha') || resultId.toLowerCase().includes('tanisha1')) && (type === 'avatar' || type === 'thumbnail')) {
    return getPersonaProfilePicture('African American', 'Female');
  }
  
  // Use specific image for Adeeb as requested
  if (resultId.toLowerCase().includes('adeeb') && (type === 'avatar' || type === 'thumbnail')) {
    return 'https://media.licdn.com/dms/image/v2/C5603AQH4Q23H_95Dqg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1610555050464?e=2147483647&v=beta&t=vtqWB22HLJsxpwC8ldRKBnxoaYH3StgycW0YAv6ZeLA';
  }
  
  if (type === 'header') {
    return getAIGeneratedBanner(resultId, size, 300);
  }
  
  return getAIGeneratedFace(resultId, size);
};

/**
 * Get a fake video thumbnail URL - using AI-generated images
 */
export const getFakeVideoThumbnail = (videoId: string): string => {
  return getAIGeneratedBanner(videoId, 400, 225);
};

/**
 * Get a single profile picture from Photos folder based on race and gender
 */
export const getPersonaProfilePicture = (race: 'White American' | 'African American', gender: 'Male' | 'Female'): string => {
  const raceFolder = race === 'White American' ? 'Race - White' : 'Race - Black';
  const genderFolder = gender === 'Male' ? 'Male' : 'Female';
  const basePath = `/Photos/${raceFolder} - ${genderFolder}`;
  
  // Select 1 profile picture based on race and gender
  if (race === 'African American' && gender === 'Female') {
    return `${basePath}/1716b819-83d5-41b9-93f8-2d2bf47c87a5.jpg`;
  }
  
  return '';
};


