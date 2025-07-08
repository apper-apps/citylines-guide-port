import mockData from '@/services/mockData/cities.json';

export const cityService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const city = mockData.find(city => city.Id === id);
    return city ? { ...city } : null;
  },

  validateSubdomain: async (subdomain) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!subdomain || subdomain.length < 2) {
      return {
        available: false,
        message: 'Subdomain must be at least 2 characters long'
      };
    }

    if (!/^[a-z0-9]+$/.test(subdomain)) {
      return {
        available: false,
        message: 'Subdomain can only contain lowercase letters and numbers'
      };
    }

    const existingCity = mockData.find(city => 
      city.subdomain.toLowerCase() === subdomain.toLowerCase()
    );

    if (existingCity) {
      return {
        available: false,
        message: `This subdomain is already claimed by ${existingCity.name}`
      };
    }

    return {
      available: true,
      message: 'Subdomain is available'
    };
  },

  checkAvailability: async (subdomain) => {
    const validation = await cityService.validateSubdomain(subdomain);
    return validation.available;
  },

  releaseCity: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const cityIndex = mockData.findIndex(city => city.Id === id);
    if (cityIndex === -1) {
      throw new Error('City not found');
    }

    const releasedCity = mockData.splice(cityIndex, 1)[0];
    return { ...releasedCity };
  },
create: async (cityData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate subdomain availability before creating
    const validation = await cityService.validateSubdomain(cityData.subdomain);
    if (!validation.available) {
      throw new Error(validation.message);
    }

    // Check for duplicate city name (case insensitive)
    const existingCityByName = mockData.find(city => 
      city.name.toLowerCase() === cityData.name.toLowerCase()
    );
    if (existingCityByName) {
      throw new Error(`A city named "${existingCityByName.name}" is already claimed`);
    }

    const newCity = {
      ...cityData,
      Id: mockData.length > 0 ? Math.max(...mockData.map(c => c.Id)) + 1 : 1,
      claimedAt: new Date().toISOString(),
      revenue: 0,
      stations: 0,
      listings: 0
    };
    
    mockData.push(newCity);
    return { ...newCity };
  },

update: async (id, cityData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(city => city.Id === id);
    if (index === -1) {
      throw new Error('City not found');
    }

    // If subdomain is being updated, validate it
    if (cityData.subdomain && cityData.subdomain !== mockData[index].subdomain) {
      const validation = await cityService.validateSubdomain(cityData.subdomain);
      if (!validation.available) {
        throw new Error(validation.message);
      }
    }

    mockData[index] = { ...mockData[index], ...cityData };
    return { ...mockData[index] };
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(city => city.Id === id);
    if (index === -1) {
      throw new Error('City not found');
    }
    
    const deletedCity = mockData.splice(index, 1)[0];
    return { ...deletedCity };
  }
};