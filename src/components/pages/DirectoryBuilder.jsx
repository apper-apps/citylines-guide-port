import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { directoryService } from '@/services/api/directoryService';

const DirectoryBuilder = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [stations, setStations] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stations');
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    line: '',
    description: '',
    type: 'station'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await directoryService.getBuilderData();
      setCities(data.cities);
      setStations(data.stations);
      setListings(data.listings);
      if (data.cities.length > 0) {
        setSelectedCity(data.cities[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'stations') {
        await directoryService.createStation({
          ...formData,
          cityId: selectedCity.Id
        });
        await loadData();
      } else {
        await directoryService.createListing({
          ...formData,
          cityId: selectedCity.Id
        });
        await loadData();
      }
      setFormData({ name: '', line: '', description: '', type: 'station' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const tabs = [
    { id: 'stations', label: 'MRT Stations', icon: 'MapPin' },
    { id: 'listings', label: 'Listings', icon: 'Star' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  if (cities.length === 0) {
    return (
      <Empty
        title="No cities to manage"
        message="You need to claim a city before you can build your directory."
        actionLabel="Claim a City"
        onAction={() => console.log('Navigate to claim city')}
        icon="Building"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directory Builder</h1>
          <p className="text-gray-600">Build and manage your city's transit directory</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add {activeTab === 'stations' ? 'Station' : 'Listing'}
        </Button>
      </div>

      {/* City Selector */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ApperIcon name="Building" className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900">Selected City</h3>
              <p className="text-sm text-gray-600">{selectedCity?.name}</p>
            </div>
          </div>
          <select
            value={selectedCity?.Id || ''}
            onChange={(e) => setSelectedCity(cities.find(c => c.Id === parseInt(e.target.value)))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {cities.map(city => (
              <option key={city.Id} value={city.Id}>{city.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'stations' && (
        <div className="space-y-4">
          {stations.length === 0 ? (
            <Empty
              title="No stations added"
              message="Add your first MRT station to start building your directory."
              actionLabel="Add Station"
              onAction={() => setShowAddForm(true)}
              icon="MapPin"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(station => (
                <Card key={station.Id} className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{station.name}</h3>
                        <p className="text-sm text-gray-600">{station.line}</p>
                      </div>
                      <Badge variant="primary">{station.line}</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{station.description}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Trash" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <Empty
              title="No listings added"
              message="Add attractions, restaurants, and shops to your directory."
              actionLabel="Add Listing"
              onAction={() => setShowAddForm(true)}
              icon="Star"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(listing => (
                <Card key={listing.Id} className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-600">{listing.type}</p>
                      </div>
                      <Badge variant={listing.isSponsored ? 'accent' : 'default'}>
                        {listing.isSponsored ? 'Sponsored' : 'Free'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{listing.description}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Trash" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full"
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add {activeTab === 'stations' ? 'Station' : 'Listing'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                {activeTab === 'stations' && (
                  <Input
                    label="Line"
                    value={formData.line}
                    onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                    required
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add {activeTab === 'stations' ? 'Station' : 'Listing'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DirectoryBuilder;