import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RevenueCard = ({ 
  title, 
  amount, 
  percentage, 
  period = "This month",
  trend = "up",
  className = "" 
}) => {
  const trendIcon = trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`revenue-card ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <ApperIcon name="DollarSign" className="w-5 h-5 text-accent" />
      </div>
      
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900"
        >
          ${amount}
        </motion.div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${trendColor}`}>
            <ApperIcon name={trendIcon} className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <span className="text-sm text-gray-500">{period}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueCard;