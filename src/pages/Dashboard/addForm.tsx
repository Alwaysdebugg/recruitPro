import { useState } from 'react';
import { Candidate } from '../../types';
import { X } from 'lucide-react';

interface AddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidate: Candidate) => void;
}

const AddForm: React.FC<AddFormProps> = ({ isOpen, onClose, onSubmit }) => {

  const [formData, setFormData] = useState<Candidate>({
    id: 0,
    name: '',
    email: '',
    note: '',
    appliedRole: '',
    resumeUrl: '',
    experience: '',
    status: 'NEW',
    createdAt: '',
    updatedAt: ''
  });
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      id: 0,
      name: '',
      email: '',
      note: '',
      appliedRole: '',
      resumeUrl: '',
      experience: '',
      status: 'NEW',
      createdAt: '',
      updatedAt: ''
    });
  };

  return (
    <div>
      {/* 添加候选人表单 */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`} style={{borderRadius: '10px'}}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Add New Candidate</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name{' '}
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address{' '}
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Applied Role{' '}
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  id="appliedRole"
                  name="appliedRole"
                  value={formData.appliedRole}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
                  Resume URL{' '}
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience{' '}
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddForm;