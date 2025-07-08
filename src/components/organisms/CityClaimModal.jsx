import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const CityClaimModal = ({ isOpen, onClose, onClaim, availableCities }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const generateSubdomain = (cityName) => {
    return cityName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSubdomain(generateSubdomain(city));
    setUseCustom(false);
  };

  const handleCustomCityChange = (value) => {
    setCustomCity(value);
    setSubdomain(generateSubdomain(value));
  };

  const handleSubmit = async () => {
    const cityName = useCustom ? customCity : selectedCity;
    if (!cityName || !subdomain) return;

    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onClaim({
      name: cityName,
      subdomain: subdomain,
      status: 'active'
    });
    
    setIsChecking(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Claim a City</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Cities</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`p-3 text-left rounded-md border transition-colors ${
                      selectedCity === city && !useCustom
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="checkbox"
                  id="custom"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="custom" className="text-sm font-medium text-gray-700">
                  Use custom city
                </label>
              </div>
              
              {useCustom && (
                <Input
                  label="City Name"
                  value={customCity}
                  onChange={(e) => handleCustomCityChange(e.target.value)}
                  placeholder="Enter city name"
                />
              )}
            </div>

            {(selectedCity || customCity) && (
              <Card className="bg-blue-50">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Globe" className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Your subdomain will be:</span>
                  </div>
                  <div className="text-lg font-semibold text-blue-900">
                    {subdomain}.citylinesguide.com
                  </div>
                </div>
              </Card>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isChecking || (!selectedCity && !customCity)}
                className="flex-1"
              >
                {isChecking ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Claim City'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CityClaimModal;