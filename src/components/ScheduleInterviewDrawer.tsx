import React from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Candidate } from '../types';

interface ScheduleInterviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

const ScheduleInterviewDrawer: React.FC<ScheduleInterviewDrawerProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [notes, setNotes] = React.useState('');
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ]);
  const [selectedSlot, setSelectedSlot] = React.useState<string>('');

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would integrate with Google Calendar API
      // For now, we'll just log the scheduling details
      console.log('Scheduling interview:', {
        candidate,
        date: selectedDate,
        time: selectedSlot,
        notes
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Schedule Interview</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Candidate</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.role}</p>
              </div>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 text-sm rounded-md ${
                        selectedSlot === slot
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add any notes or special instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!selectedSlot}
              >
                Schedule Interview
              </button>
            </form>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default ScheduleInterviewDrawer;