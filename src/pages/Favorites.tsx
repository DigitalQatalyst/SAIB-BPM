import React, { useState } from 'react';
import { Star, Search, Filter, FileText, ClipboardList, BookOpen, BarChart2, ChevronDown, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
type FavoriteItemType = 'document' | 'policy' | 'procedure' | 'service' | 'regulation' | 'process';
interface FavoriteItem {
  id: number;
  title: string;
  description: string;
  type: FavoriteItemType;
  lastViewed: string;
  dateAdded: string;
  link: string;
}
const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FavoriteItemType | null>(null);
  // Sample favorites data
  const [favorites, setFavorites] = useState<FavoriteItem[]>([{
    id: 1,
    title: 'Anti-Money Laundering Policy',
    description: "Comprehensive policy outlining SAIB's approach to preventing money laundering and financial crime.",
    type: 'policy',
    lastViewed: '2023-06-15',
    dateAdded: '2023-01-10',
    link: '/document/1'
  }, {
    id: 2,
    title: 'Customer Due Diligence Procedure',
    description: 'Step-by-step procedure for conducting customer due diligence in compliance with regulations.',
    type: 'procedure',
    lastViewed: '2023-06-10',
    dateAdded: '2023-02-22',
    link: '/document/2'
  }, {
    id: 3,
    title: 'SAMA Circular No. 44/2023',
    description: 'Latest circular from Saudi Central Bank regarding digital banking services.',
    type: 'regulation',
    lastViewed: '2023-06-08',
    dateAdded: '2023-05-15',
    link: '/regulations'
  }, {
    id: 4,
    title: 'Document Review Service',
    description: 'Service for reviewing and updating existing documentation for regulatory compliance.',
    type: 'service',
    lastViewed: '2023-06-01',
    dateAdded: '2023-03-18',
    link: '/service/3'
  }, {
    id: 5,
    title: 'Loan Approval Process Dashboard',
    description: 'Interactive dashboard showing the current loan approval process performance metrics.',
    type: 'process',
    lastViewed: '2023-05-28',
    dateAdded: '2023-04-05',
    link: '/process-mining/2'
  }, {
    id: 6,
    title: 'Corporate Credit Card Policy',
    description: 'Policy governing the issuance and use of corporate credit cards for employees.',
    type: 'policy',
    lastViewed: '2023-05-20',
    dateAdded: '2023-01-30',
    link: '/document/6'
  }]);
  // Filter favorites based on search query and type filter
  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType ? item.type === filterType : true;
    return matchesSearch && matchesType;
  });
  // Remove an item from favorites
  const removeFromFavorites = (id: number) => {
    if (window.confirm('Are you sure you want to remove this item from your favorites?')) {
      setFavorites(favorites.filter(item => item.id !== id));
    }
  };
  // Get icon for item type
  const getItemIcon = (type: FavoriteItemType) => {
    switch (type) {
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'policy':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'procedure':
        return <ClipboardList className="h-6 w-6 text-purple-500" />;
      case 'service':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'regulation':
        return <BookOpen className="h-6 w-6 text-red-500" />;
      case 'process':
        return <BarChart2 className="h-6 w-6 text-indigo-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-[#FECC0E] mr-3" />
            <h1 className="text-3xl font-semibold text-gray-900">
              My Favorites
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-500">
            Quick access to your favorite documents, policies, and resources
          </p>
        </div>
        {/* Filters and search bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search favorites..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FECC0E] focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="relative w-full md:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={() => setFilterType(null)}>
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'All Types'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {/* Dropdown for type filter would go here */}
          </div>
        </div>
        {/* Favorites grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.length > 0 ? filteredFavorites.map(item => <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:border-[#FECC0E] transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {getItemIcon(item.type)}
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 mb-2">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-500 focus:outline-none" onClick={() => removeFromFavorites(item.id)} aria-label="Remove from favorites">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">
                        Last viewed: {formatDate(item.lastViewed)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added: {formatDate(item.dateAdded)}
                      </p>
                    </div>
                    <Link to={item.link} className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[#9E800D] bg-[#FECC0E]/10 hover:bg-[#FECC0E]/20">
                      View <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>) : <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No favorites found
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't added any favorites yet, or your search returned no
                results.
              </p>
              <Link to="/documents" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-[#FECC0E] text-gray-900 hover:bg-[#FECC0E]/90">
                Browse Documents
              </Link>
            </div>}
        </div>
      </div>
    </div>;
};
export default Favorites;