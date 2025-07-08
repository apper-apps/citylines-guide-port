import { motion } from 'framer-motion';

const Loading = ({ className = "" }) => {
  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48 rounded-md"></div>
          <div className="skeleton h-4 w-32 rounded-md"></div>
        </div>
        <div className="skeleton h-10 w-32 rounded-md"></div>
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-5 w-24 rounded-md"></div>
                <div className="skeleton h-8 w-8 rounded-full"></div>
              </div>
              <div className="skeleton h-8 w-20 rounded-md"></div>
              <div className="skeleton h-3 w-full rounded-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="card">
        <div className="space-y-4">
          <div className="skeleton h-6 w-40 rounded-md"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="skeleton h-12 w-12 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded-md"></div>
                  <div className="skeleton h-3 w-1/2 rounded-md"></div>
                </div>
                <div className="skeleton h-8 w-20 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;