import React from 'react';
import { CheckCircle, X } from 'lucide-react';
interface AcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestNumber: string;
}
const AcknowledgmentModal: React.FC<AcknowledgmentModalProps> = ({
  isOpen,
  onClose,
  requestNumber
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Request Submitted Successfully
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3">
              Your request has been submitted successfully and has been assigned
              to the Policies & Procedures team.
            </p>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <p className="text-sm font-medium text-gray-900">
                Request Number:
              </p>
              <p className="text-lg font-bold text-[#9E800D]">
                {requestNumber}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You can track the status of your request in the "Track Requests"
              section. You will also receive email notifications when there are
              updates to your request.
            </p>
          </div>
          <div className="mt-6">
            <button onClick={onClose} className="w-full px-4 py-2 bg-[#FECC0E] text-gray-900 font-medium rounded-md hover:bg-[#FECC0E]/90 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default AcknowledgmentModal;