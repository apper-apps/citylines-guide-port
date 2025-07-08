import stationsData from '@/services/mockData/stations.json';
import listingsData from '@/services/mockData/listings.json';
import citiesData from '@/services/mockData/cities.json';

export const directoryService = {
  getBuilderData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      cities: citiesData,
      stations: stationsData,
      listings: listingsData
    };
  },

  createStation: async (stationData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStation = {
      ...stationData,
      Id: Math.max(...stationsData.map(s => s.Id)) + 1,
      order: stationsData.length + 1
    };
    stationsData.push(newStation);
    return newStation;
  },

  createListing: async (listingData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newListing = {
      ...listingData,
      Id: Math.max(...listingsData.map(l => l.Id)) + 1,
      isFeatured: false,
      isSponsored: false
    };
    listingsData.push(newListing);
    return newListing;
  },

  updateStation: async (id, stationData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = stationsData.findIndex(station => station.Id === id);
    if (index !== -1) {
      stationsData[index] = { ...stationsData[index], ...stationData };
      return stationsData[index];
    }
    throw new Error('Station not found');
  },

  updateListing: async (id, listingData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = listingsData.findIndex(listing => listing.Id === id);
    if (index !== -1) {
      listingsData[index] = { ...listingsData[index], ...listingData };
      return listingsData[index];
    }
    throw new Error('Listing not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Try to find in stations first
    let index = stationsData.findIndex(item => item.Id === id);
    if (index !== -1) {
      return stationsData.splice(index, 1)[0];
    }
    
    // Try to find in listings
    index = listingsData.findIndex(item => item.Id === id);
    if (index !== -1) {
      return listingsData.splice(index, 1)[0];
    }
    
    throw new Error('Item not found');
  }
};