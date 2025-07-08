import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { touristAttractionService } from "@/services/api/touristAttractionService";
import { directoryService } from "@/services/api/directoryService";

const DirectoryBuilder = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [stations, setStations] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState('stations');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);
const [events, setEvents] = useState([]);
const [touristAttractions, setTouristAttractions] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    line: '',
    description: '',
    type: 'attraction',
    title: '',
    imageUrl: '',
    link: '',
    stationId: '',
    isFeatured: false,
    isSponsored: false,
eventDate: '',
    eventTime: ''
  });

  const [editingTouristAttraction, setEditingTouristAttraction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    line: '',
    description: '',
    type: 'attraction',
    title: '',
    imageUrl: '',
    link: '',
    stationId: '',
    isFeatured: false,
    isSponsored: false,
    eventDate: '',
    eventTime: ''
});

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await directoryService.getBuilderData();
      setCities(data.cities);
      setStations(data.stations);
      setListings(data.listings);
      setEvents(data.events || []);
      
      // Load tourist attractions
      const attractionsData = await touristAttractionService.getAll();
      setTouristAttractions(attractionsData);
      
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
        if (editingStation) {
          // Update existing station
          await directoryService.updateStation(editingStation.Id, {
            name: editFormData.name,
            line: editFormData.line,
            description: editFormData.description,
            cityId: selectedCity.Id
          });
        } else {
          // Create new station
          await directoryService.createStation({
            ...formData,
            cityId: selectedCity.Id
          });
        }
      } else if (activeTab === 'listings') {
        if (editingListing) {
          // Update existing listing
          await directoryService.updateListing(editingListing.Id, {
            type: editFormData.type,
            title: editFormData.title,
            description: editFormData.description,
            imageUrl: editFormData.imageUrl,
            link: editFormData.link,
            stationId: editFormData.stationId,
            isFeatured: editFormData.isFeatured,
            isSponsored: editFormData.isSponsored,
            cityId: selectedCity.Id
          });
        } else {
          // Create new listing
          await directoryService.createListing({
            ...formData,
            cityId: selectedCity.Id
          });
        }
      } else if (activeTab === 'events') {
        if (editingEvent) {
          // Update existing event
          await directoryService.updateEvent(editingEvent.Id, {
            title: editFormData.title,
            description: editFormData.description,
            eventDate: editFormData.eventDate,
            eventTime: editFormData.eventTime,
            stationId: editFormData.stationId,
            cityId: selectedCity.Id
          });
        } else {
          // Create new event
          await directoryService.createEvent({
            ...formData,
            cityId: selectedCity.Id
          });
        }
      } else if (activeTab === 'touristAttractions') {
        if (editingTouristAttraction) {
          // Update existing tourist attraction
          await touristAttractionService.update(editingTouristAttraction.Id, {
            Name: editFormData.name,
            description: editFormData.description,
            imageUrl: editFormData.imageUrl,
            station: editFormData.stationId
          });
        } else {
          // Create new tourist attraction
          await touristAttractionService.create({
            Name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl,
            station: formData.stationId
          });
        }
      }
      
      await loadData();
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      line: '',
      description: '',
      type: 'attraction',
      title: '',
      imageUrl: '',
      link: '',
      stationId: '',
      isFeatured: false,
      isSponsored: false,
      eventDate: '',
      eventTime: ''
    });
    setEditFormData({
      name: '',
      line: '',
      description: '',
      type: 'attraction',
      title: '',
      imageUrl: '',
      link: '',
      stationId: '',
      isFeatured: false,
      isSponsored: false,
eventDate: '',
      eventTime: ''
    });
    setEditingStation(null);
    setEditingListing(null);
    setEditingEvent(null);
    setEditingTouristAttraction(null);
  };

  const handleEditStation = (station) => {
    setEditingStation(station);
    setEditFormData({
      name: station.name,
      line: station.line,
      description: station.description
    });
    setShowAddForm(true);
  };

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setEditFormData({
      type: listing.type,
      title: listing.title,
      description: listing.description,
      imageUrl: listing.imageUrl,
      link: listing.link,
      stationId: listing.stationId,
      isFeatured: listing.isFeatured,
      isSponsored: listing.isSponsored
    });
    setShowAddForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
stationId: event.stationId
    });
    setShowAddForm(true);
  };

  const handleEditTouristAttraction = (attraction) => {
    setEditingTouristAttraction(attraction);
    setEditFormData({
      name: attraction.Name,
      description: attraction.description,
      imageUrl: attraction.imageUrl,
      stationId: attraction.station?.Id
    });
    setShowAddForm(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };
const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        if (activeTab === 'stations') {
          await directoryService.delete(itemToDelete.Id);
        } else if (activeTab === 'listings') {
          await directoryService.deleteListing(itemToDelete.Id);
        } else if (activeTab === 'events') {
          await directoryService.deleteEvent(itemToDelete.Id);
        } else if (activeTab === 'touristAttractions') {
          await touristAttractionService.delete(itemToDelete.Id);
        }
        await loadData();
      } catch (err) {
        setError(err.message);
      }
    }
setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

const tabs = [
    { id: 'stations', label: 'MRT Stations', icon: 'MapPin' },
    { id: 'listings', label: 'Listings', icon: 'Star' },
    { id: 'events', label: 'Events', icon: 'Calendar' },
    { id: 'touristAttractions', label: 'Tourist Attractions', icon: 'Landmark' }
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
          Add {activeTab === 'stations' ? 'Station' : activeTab === 'listings' ? 'Listing' : activeTab === 'events' ? 'Event' : 'Tourist Attraction'}
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditStation(station)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(station)}
                      >
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                         onClick={() => handleEditListing(listing)}
                       >
                         <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                         Edit
                       </Button>
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => handleDelete(listing)}
                       >
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
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <Empty
              title="No events added"
              message="Add events and activities happening around your city's transit stations."
              actionLabel="Add Event"
              onAction={() => setShowAddForm(true)}
              icon="Calendar"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <Card key={event.Id} className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.eventDate} at {event.eventTime}</p>
                      </div>
                      <Badge variant="secondary">Event</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{event.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditEvent(event)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(event)}
                      >
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

      {activeTab === 'touristAttractions' && (
        <div className="space-y-4">
          {touristAttractions.length === 0 ? (
            <Empty
              title="No tourist attractions added"
              message="Add tourist attractions to help visitors discover your city's best spots."
              actionLabel="Add Tourist Attraction"
              onAction={() => setShowAddForm(true)}
              icon="Landmark"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {touristAttractions.map(attraction => (
                <Card key={attraction.Id} className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{attraction.Name}</h3>
                        <p className="text-sm text-gray-600">{attraction.station?.Name}</p>
                      </div>
                      <Badge variant="accent">Attraction</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{attraction.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditTouristAttraction(attraction)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(attraction)}
                      >
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
                  {(editingStation || editingListing || editingEvent || editingTouristAttraction) ? 'Edit' : 'Add'} {
                    activeTab === 'stations' ? 'Station' :
                    activeTab === 'listings' ? 'Listing' : 
                    activeTab === 'events' ? 'Event' : 'Tourist Attraction'
                  }
                </h2>
                <button
                   onClick={() => {
                     setShowAddForm(false);
                     resetForm();
                   }}
                   className="p-2 hover:bg-gray-100 rounded-md"
                 >
                   <ApperIcon name="X" className="w-5 h-5" />
</button>
              </div>
              <div className="space-y-4">
                {activeTab === 'stations' && (
                  <>
                    <Input
                      label="Station Name"
                      value={editingStation ? editFormData.name : formData.name}
                      onChange={(e) => {
                        if (editingStation) {
                          setEditFormData({ ...editFormData, name: e.target.value });
                        } else {
                          setFormData({ ...formData, name: e.target.value });
                        }
                      }}
                      required
                    />
                    <Input
                      label="Line"
                      value={editingStation ? editFormData.line : formData.line}
                      onChange={(e) => {
                        if (editingStation) {
                          setEditFormData({ ...editFormData, line: e.target.value });
                        } else {
                          setFormData({ ...formData, line: e.target.value });
                        }
                      }}
                      required
                    />
                  </>
                )}

                {activeTab === 'listings' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Listing Type
                      </label>
                      <select
                        value={editingListing ? editFormData.type : formData.type}
                        onChange={(e) => {
                          if (editingListing) {
                            setEditFormData({ ...editFormData, type: e.target.value });
                          } else {
                            setFormData({ ...formData, type: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="attraction">Tourist Attraction</option>
                        <option value="food">Food & Dining</option>
                        <option value="shopping">Shopping</option>
                      </select>
                    </div>
                    <Input
                      label="Title"
                      value={editingListing ? editFormData.title : formData.title}
                      onChange={(e) => {
                        if (editingListing) {
                          setEditFormData({ ...editFormData, title: e.target.value });
                        } else {
                          setFormData({ ...formData, title: e.target.value });
                        }
                      }}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nearest Station
                      </label>
                      <select
                        value={editingListing ? editFormData.stationId : formData.stationId}
                        onChange={(e) => {
                          if (editingListing) {
                            setEditFormData({ ...editFormData, stationId: e.target.value });
                          } else {
                            setFormData({ ...formData, stationId: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a station</option>
                        {stations.map(station => (
                          <option key={station.Id} value={station.Id}>
                            {station.name} - {station.line}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Image URL"
                      value={editingListing ? editFormData.imageUrl : formData.imageUrl}
                      onChange={(e) => {
                        if (editingListing) {
                          setEditFormData({ ...editFormData, imageUrl: e.target.value });
                        } else {
                          setFormData({ ...formData, imageUrl: e.target.value });
                        }
                      }}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                    />
                    <Input
                      label="Website Link"
                      value={editingListing ? editFormData.link : formData.link}
                      onChange={(e) => {
                        if (editingListing) {
                          setEditFormData({ ...editFormData, link: e.target.value });
                        } else {
                          setFormData({ ...formData, link: e.target.value });
                        }
                      }}
                      type="url"
                      placeholder="https://example.com"
                    />
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingListing ? editFormData.isFeatured : formData.isFeatured}
                          onChange={(e) => {
                            if (editingListing) {
                              setEditFormData({ ...editFormData, isFeatured: e.target.checked });
                            } else {
                              setFormData({ ...formData, isFeatured: e.target.checked });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingListing ? editFormData.isSponsored : formData.isSponsored}
                          onChange={(e) => {
                            if (editingListing) {
                              setEditFormData({ ...editFormData, isSponsored: e.target.checked });
                            } else {
                              setFormData({ ...formData, isSponsored: e.target.checked });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Sponsored</span>
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'events' && (
                  <>
                    <Input
                      label="Event Title"
                      value={editingEvent ? editFormData.title : formData.title}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditFormData({ ...editFormData, title: e.target.value });
                        } else {
                          setFormData({ ...formData, title: e.target.value });
                        }
                      }}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Station Location
                      </label>
                      <select
                        value={editingEvent ? editFormData.stationId : formData.stationId}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditFormData({ ...editFormData, stationId: e.target.value });
                          } else {
                            setFormData({ ...formData, stationId: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a station</option>
                        {stations.map(station => (
                          <option key={station.Id} value={station.Id}>
                            {station.name} - {station.line}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Event Date"
                        type="date"
                        value={editingEvent ? editFormData.eventDate : formData.eventDate}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditFormData({ ...editFormData, eventDate: e.target.value });
                          } else {
                            setFormData({ ...formData, eventDate: e.target.value });
                          }
                        }}
                        required
                      />
                      <Input
                        label="Event Time"
                        type="time"
                        value={editingEvent ? editFormData.eventTime : formData.eventTime}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditFormData({ ...editFormData, eventTime: e.target.value });
                          } else {
                            setFormData({ ...formData, eventTime: e.target.value });
                          }
                        }}
required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'touristAttractions' && (
                  <>
                    <Input
                      label="Attraction Name"
                      value={editingTouristAttraction ? editFormData.name : formData.name}
                      onChange={(e) => {
                        if (editingTouristAttraction) {
                          setEditFormData({ ...editFormData, name: e.target.value });
                        } else {
                          setFormData({ ...formData, name: e.target.value });
                        }
                      }}
                      required
                    />
                    <Input
                      label="Image URL"
                      value={editingTouristAttraction ? editFormData.imageUrl : formData.imageUrl}
                      onChange={(e) => {
                        if (editingTouristAttraction) {
                          setEditFormData({ ...editFormData, imageUrl: e.target.value });
                        } else {
                          setFormData({ ...formData, imageUrl: e.target.value });
                        }
                      }}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nearest Station
                      </label>
                      <select
                        value={editingTouristAttraction ? editFormData.stationId : formData.stationId}
                        onChange={(e) => {
                          if (editingTouristAttraction) {
                            setEditFormData({ ...editFormData, stationId: e.target.value });
                          } else {
                            setFormData({ ...formData, stationId: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a station</option>
                        {stations.map(station => (
                          <option key={station.Id} value={station.Id}>
                            {station.name} - {station.line}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={
                      editingStation ? editFormData.description : 
                      editingListing ? editFormData.description :
                      editingEvent ? editFormData.description :
                      editingTouristAttraction ? editFormData.description :
                      formData.description
                    }
                    onChange={(e) => {
                      if (editingStation) {
                        setEditFormData({ ...editFormData, description: e.target.value });
                      } else if (editingListing) {
                        setEditFormData({ ...editFormData, description: e.target.value });
                      } else if (editingEvent) {
                        setEditFormData({ ...editFormData, description: e.target.value });
                      } else if (editingTouristAttraction) {
                        setEditFormData({ ...editFormData, description: e.target.value });
                      } else {
                        setFormData({ ...formData, description: e.target.value });
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
</div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {(editingStation || editingListing || editingEvent || editingTouristAttraction) ? 'Update' : 'Add'} {
                      activeTab === 'stations' ? 'Station' : 
                      activeTab === 'listings' ? 'Listing' : 
                      activeTab === 'events' ? 'Event' : 'Tourist Attraction'
                    }
</Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ApperIcon name="X" className="w-5 h-5" />
</button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{itemToDelete?.name || itemToDelete?.title || itemToDelete?.Name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DirectoryBuilder;