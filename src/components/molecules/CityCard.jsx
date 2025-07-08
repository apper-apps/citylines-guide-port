import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const CityCard = ({ city, onEdit, onViewSite, onManageAds }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'released': return 'error';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card hover className="h-full">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
              <p className="text-sm text-gray-600">{city.subdomain}.citylinesguide.com</p>
            </div>
            <Badge variant={getStatusColor(city.status)}>
              {city.status}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
              {city.stations || 0} stations
            </div>
            <div className="flex items-center">
              <ApperIcon name="Star" className="w-4 h-4 mr-1" />
              {city.listings || 0} listings
            </div>
            <div className="flex items-center">
              <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
              ${city.revenue || 0}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(city)}
              className="flex-1"
            >
              <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewSite(city)}
            >
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => onManageAds(city)}
            >
              <ApperIcon name="Target" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CityCard;