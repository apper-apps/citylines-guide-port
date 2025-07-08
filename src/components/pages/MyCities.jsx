import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import CityCard from '@/components/molecules/CityCard';
import CityClaimModal from '@/components/organisms/CityClaimModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { cityService } from '@/services/api/cityService';

const MyCities = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const loadCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const cityData = await cityService.getAll();
      setCities(cityData);
      setFilteredCities(cityData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
    if (filterType === 'all') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city => city.status === filterType);
      setFilteredCities(filtered);
    }
  };

  const handleClaimCity = async (cityData) => {
    try {
      await cityService.create(cityData);
      await loadCities();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadCities} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cities</h1>
          <p className="text-gray-600">Manage your claimed cities and subdomains</p>
        </div>
        <Button onClick={() => setShowClaimModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Claim New City
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search cities..."
          className="md:w-80"
        />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filter:</span>
          {['all', 'active', 'inactive'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCities.length === 0 ? (
        <Empty
          title="No cities found"
          message="You haven't claimed any cities yet. Start by claiming your first city to begin building your transit tourism directory."
          actionLabel="Claim Your First City"
          onAction={() => setShowClaimModal(true)}
          icon="Building"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <CityCard
              key={city.Id}
              city={city}
              onEdit={() => console.log('Edit city:', city)}
              onViewSite={() => window.open(`https://${city.subdomain}.citylinesguide.com`, '_blank')}
              onManageAds={() => console.log('Manage ads:', city)}
            />
          ))}
        </div>
      )}

      <CityClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onClaim={handleClaimCity}
        availableCities={['Singapore', 'Tokyo', 'London', 'New York', 'Paris', 'Hong Kong']}
      />
    </div>
  );
};

export default MyCities;