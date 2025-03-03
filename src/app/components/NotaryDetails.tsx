import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface NotaryDetailsProps {
  notary: {
    id: number;
    name: string;
    rating: number;
    reviewCount: number;
    services: string[];
    address: string;
    distance: number;
    businessHours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    pricing: {
      basePrice: number;
      mileageFee: number;
      rushFee: number;
      weekendFee: number;
    };
    about: string;
    languages: string[];
    certifications: string[];
  } | null;
  onClose: () => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

function parseHours(timeString: string): { start: number; end: number } | null {
  if (timeString === 'Closed') return null;
  
  const [startStr, endStr] = timeString.split(' - ');
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
    return totalMinutes;
  };

  return {
    start: parseTime(startStr),
    end: parseTime(endStr)
  };
}

function isCurrentlyOpen(hours: string): boolean {
  if (hours === 'Closed') return false;

  const parsed = parseHours(hours);
  if (!parsed) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return currentMinutes >= parsed.start && currentMinutes <= parsed.end;
}

export default function NotaryDetails({ notary, onClose }: NotaryDetailsProps) {
  if (!notary) return null;

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const currentDay = daysOfWeek[new Date().getDay()];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = isCurrentlyOpen(notary.businessHours[currentDay]);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: typeof daysOfWeek[number];
    hour: number;
    isActive: boolean;
  } | null>(null);

  // Add ref for the details popup
  const detailsRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setSelectedSlot(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update open status every minute
  const [, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  function getTimeUntilChange(hours: string): string {
    if (!notary || hours === 'Closed') return '';
    
    const parsed = parseHours(hours);
    if (!parsed) return '';

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    if (currentMinutes < parsed.start) {
      const minutesUntilOpen = parsed.start - currentMinutes;
      const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
      const remainingMinutes = minutesUntilOpen % 60;
      return `Opens in ${hoursUntilOpen}h ${remainingMinutes}m`;
    } else if (currentMinutes < parsed.end) {
      const minutesUntilClose = parsed.end - currentMinutes;
      const hoursUntilClose = Math.floor(minutesUntilClose / 60);
      const remainingMinutes = minutesUntilClose % 60;
      return `Closes in ${hoursUntilClose}h ${remainingMinutes}m`;
    }
    
    // If we're past closing time, calculate time until opening tomorrow
    const nextDayIndex = (daysOfWeek.indexOf(currentDay) + 1) % 7;
    const nextDay = daysOfWeek[nextDayIndex];
    const nextDayHours = notary.businessHours[nextDay];
    
    if (nextDayHours === 'Closed' || !nextDayHours) return '';
    
    const nextDayParsed = parseHours(nextDayHours);
    if (!nextDayParsed) return '';
    
    const minutesUntilNextOpen = (24 * 60 - currentMinutes) + nextDayParsed.start;
    const hoursUntilNextOpen = Math.floor(minutesUntilNextOpen / 60);
    const remainingMinutes = minutesUntilNextOpen % 60;
    return `Opens in ${hoursUntilNextOpen}h ${remainingMinutes}m`;
  }

  function formatHourRange(hours: string): { start: string; end: string } {
    if (hours === 'Closed') return { start: '', end: '' };
    const [start, end] = hours.split(' - ');
    return { start, end };
  }

  function formatTimeDisplay(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  }

  function getSlotDetails(day: typeof daysOfWeek[number], hour: number) {
    if (!notary) return null;
    
    const isToday = day === currentDay;
    const dayHours = notary.businessHours[day];
    if (dayHours === 'Closed') return null;

    const parsed = parseHours(dayHours);
    if (!parsed) return null;

    const slotMinutes = hour;
    const isActive = slotMinutes >= parsed.start && slotMinutes < parsed.end;
    
    if (!isActive) return null;

    const timeDisplay = formatTimeDisplay(hour);
    const nextHourDisplay = formatTimeDisplay(hour + 60);
    
    return {
      timeRange: `${timeDisplay} - ${nextHourDisplay}`,
      isCurrentHour: isToday && currentMinutes >= hour && currentMinutes < (hour + 60),
      isWeekend: day === 'saturday' || day === 'sunday',
      pricing: {
        base: notary.pricing.basePrice,
        weekend: day === 'saturday' || day === 'sunday' ? notary.pricing.weekendFee : 0,
        rush: hour < 540 || hour >= 1020 ? notary.pricing.rushFee : 0, // Before 9AM or after 5PM
      }
    };
  }

  const renderTimeSlotDetails = () => {
    if (!selectedSlot) return null;

    const details = getSlotDetails(selectedSlot.day, selectedSlot.hour);
    if (!details) return null;

    const totalPrice = details.pricing.base + details.pricing.weekend + details.pricing.rush;

    return (
      <motion.div
        ref={detailsRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute z-10 bg-white rounded-lg shadow-xl p-4 w-64 border border-gray-200"
        style={{
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "0.5rem"
        }}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => setSelectedSlot(null)}
            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium capitalize">{selectedSlot.day}</span>
              <span className="text-sm text-gray-600">{details.timeRange}</span>
            </div>
            
            {details.isCurrentHour && (
              <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-sm">
                Currently Available
              </div>
            )}
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">${details.pricing.base}</span>
              </div>
              {details.pricing.weekend > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weekend Fee</span>
                  <span className="font-medium">+${details.pricing.weekend}</span>
                </div>
              )}
              {details.pricing.rush > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rush Hour Fee</span>
                  <span className="font-medium">+${details.pricing.rush}</span>
                </div>
              )}
              <div className="border-t pt-1.5 mt-1.5 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">${totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={() => {/* Handle booking logic */}}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-2"
            >
              Book This Time
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderListView = () => (
    <div className="grid grid-cols-1 gap-1 bg-gray-50 rounded-lg p-4">
      {daysOfWeek.map((day) => {
        const isToday = day === currentDay;
        const dayHours = notary.businessHours[day];
        const dayIsOpen = isToday && isCurrentlyOpen(dayHours);
        const timeUntilChange = isToday ? getTimeUntilChange(dayHours) : '';

        return (
          <div 
            key={day}
            className={`flex justify-between py-1.5 px-2 rounded group relative ${
              isToday ? 'bg-white shadow-sm' : ''
            }`}
          >
            <span className={`capitalize ${
              isToday ? 'text-gray-900 font-medium' : 'text-gray-600'
            }`}>
              {isToday ? `${day} (Today)` : day}
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${
                dayIsOpen ? 'text-green-600' : 
                isToday ? 'text-gray-900' :
                dayHours === 'Closed' ? 'text-red-500' : 'text-gray-600'
              }`}>
                {dayHours}
              </span>
              {timeUntilChange && (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {timeUntilChange}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGridView = () => (
    <div className="bg-gray-50 rounded-lg p-4 relative">
      <div className="grid grid-cols-8 gap-2 text-sm">
        {/* Time column */}
        <div className="space-y-2">
          <div className="h-6" /> {/* Empty cell for alignment */}
          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
            <div key={hour} className="h-6 text-right pr-2 text-gray-500">
              {hour % 12 || 12}{hour < 12 ? 'AM' : 'PM'}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {daysOfWeek.map((day) => {
          const isToday = day === currentDay;
          const dayHours = notary.businessHours[day];
          const { start: startTime, end: endTime } = formatHourRange(dayHours);
          const startHour = startTime ? parseHours(startTime)?.start || 0 : 0;
          const endHour = endTime ? parseHours(endTime)?.end || 0 : 0;
          const dayIsOpen = isToday && isCurrentlyOpen(dayHours);

          return (
            <div key={day} className="space-y-2">
              <div className={`capitalize font-medium text-center ${
                isToday ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {day.slice(0, 3)}
              </div>
              {Array.from({ length: 13 }, (_, i) => {
                const hour = (i + 8) * 60; // Convert to minutes
                const isActiveHour = hour >= startHour && hour < endHour;
                const isSelected = selectedSlot?.day === day && selectedSlot?.hour === hour;
                
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (isActiveHour) {
                        setSelectedSlot(isSelected ? null : { day, hour, isActive: isActiveHour });
                      }
                    }}
                    className={`h-6 rounded cursor-pointer transition-all ${
                      isActiveHour
                        ? `${
                            isSelected
                              ? 'ring-2 ring-blue-500 ring-offset-2'
                              : ''
                          } ${
                            dayIsOpen
                              ? 'bg-green-100 border-l-4 border-green-500 hover:bg-green-200'
                              : 'bg-blue-50 border-l-4 border-blue-300 hover:bg-blue-100'
                          }`
                        : 'bg-gray-100'
                    }`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedSlot && renderTimeSlotDetails()}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modal}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{notary.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(Math.floor(notary.rating))}
                    {notary.rating % 1 === 0.5 ? '½' : ''}
                  </span>
                  <span className="text-gray-600">
                    {notary.rating} ({notary.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* About */}
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-600">{notary.about}</p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p>{notary.address}</p>
              </div>
              <p className="mt-1 text-gray-600">{notary.distance} miles away</p>
            </div>

            {/* Business Hours */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">Business Hours</h3>
                  <button
                    onClick={() => setIsGridView(!isGridView)}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isGridView ? 'rotate-0' : 'rotate-90'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isGridView ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      )}
                    </svg>
                    {isGridView ? 'List View' : 'Grid View'}
                  </button>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isOpen ? 'Open Now' : 'Closed'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getTimeUntilChange(notary.businessHours[currentDay])}
                  </span>
                </motion.div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={isGridView ? 'grid' : 'list'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {isGridView ? renderGridView() : renderListView()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-medium mb-2">Pricing</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fee</span>
                  <span className="font-medium">${notary.pricing.basePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mileage Fee</span>
                  <span className="font-medium">${notary.pricing.mileageFee}/mile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rush Service</span>
                  <span className="font-medium">+${notary.pricing.rushFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekend Service</span>
                  <span className="font-medium">+${notary.pricing.weekendFee}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-medium mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {notary.languages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-lg font-medium mb-2">Certifications</h3>
              <div className="space-y-1">
                {notary.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-medium mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {notary.services.map((service) => (
                  <span
                    key={service}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service === 'Mobile'
                        ? 'bg-blue-100 text-blue-800'
                        : service === '24-Hour'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-medium mb-2">Contact</h3>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Notary
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 