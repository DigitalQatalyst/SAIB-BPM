import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ServiceCardProps {
  title: string;
  description: string;
  category: string;
  tag?: string;
  isHovered?: boolean;
  link: string;
  linkText?: string;
  id?: string;
}
const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  category,
  tag = 'Amendment',
  isHovered = false,
  link,
  linkText = 'Request',
  id
}) => {
  // Check if this is a procedure/manual service
  const isProcedureService = category === 'Procedure Management' || category.includes('Procedure') || category.includes('Manual') || title.includes('Procedure') || title.includes('Manual');
  // Determine the actual link to use - for procedure services, use our React form
  const serviceLink = id ? isProcedureService && linkText.includes('Request') ? `/service/${id}/request` : `/service/${id}` : link;
  return <Link to={serviceLink} className="block h-full">
      <div className={`relative bg-white rounded-lg border ${isHovered ? 'border-[#FECC0E] shadow-md' : 'border-gray-200'} overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group cursor-pointer`}>
        {/* Yellow border on left side when hovered */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isHovered ? 'bg-[#FECC0E]' : 'bg-transparent group-hover:bg-[#FECC0E]'} transition-all duration-300`}></div>
        <div className="p-6 flex flex-col h-full">
          <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-1 overflow-hidden">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-8 flex-grow line-clamp-3 overflow-hidden">
            {description}
          </p>
          {/* Divider line */}
          <div className="border-t border-gray-100 pt-4 mt-auto flex justify-between items-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {tag}
            </span>
            <span className="text-sm font-normal text-[#9E800D] group-hover:text-[#FECC0E] transition-colors flex items-center">
              {linkText} <ArrowRight size={16} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>;
};
export default ServiceCard;