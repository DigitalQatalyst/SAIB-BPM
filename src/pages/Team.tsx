import React, { useState } from 'react';
import { Users, Search, Filter, Plus, MoreVertical, Mail, Phone, Edit2, Trash2, UserPlus, X, Check, ChevronDown } from 'lucide-react';
interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar: string;
  permissions: ('view' | 'edit' | 'approve' | 'admin')[];
}
const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  // Sample team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{
    id: 1,
    name: 'Salem Al-Dosari',
    role: 'P&P Team Lead',
    department: 'Policies & Procedures',
    email: 'salem.dosari@saib.com',
    phone: '+966 55 123 4567',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    permissions: ['view', 'edit', 'approve', 'admin']
  }, {
    id: 2,
    name: 'Fatima Al-Zahrani',
    role: 'Policy Analyst',
    department: 'Policies & Procedures',
    email: 'fatima.zahrani@saib.com',
    phone: '+966 55 234 5678',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    permissions: ['view', 'edit', 'approve']
  }, {
    id: 3,
    name: 'Mohammed Al-Ghamdi',
    role: 'Compliance Officer',
    department: 'Compliance',
    email: 'mohammed.ghamdi@saib.com',
    phone: '+966 55 345 6789',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    permissions: ['view', 'approve']
  }, {
    id: 4,
    name: 'Noura Al-Qahtani',
    role: 'Document Specialist',
    department: 'Policies & Procedures',
    email: 'noura.qahtani@saib.com',
    phone: '+966 55 456 7890',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    permissions: ['view', 'edit']
  }, {
    id: 5,
    name: 'Ahmed Al-Otaibi',
    role: 'Risk Manager',
    department: 'Risk Management',
    email: 'ahmed.otaibi@saib.com',
    phone: '+966 55 567 8901',
    status: 'inactive',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    permissions: ['view']
  }]);
  // Filter team members based on search query and filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase()) || member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole ? member.role === filterRole : true;
    const matchesDepartment = filterDepartment ? member.department === filterDepartment : true;
    return matchesSearch && matchesRole && matchesDepartment;
  });
  // Get unique roles and departments for filters
  const roles = Array.from(new Set(teamMembers.map(member => member.role)));
  const departments = Array.from(new Set(teamMembers.map(member => member.department)));
  // Handle member actions
  const handleDeleteMember = (id: number) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
    setShowDropdown(null);
  };
  const toggleMemberStatus = (id: number) => {
    setTeamMembers(teamMembers.map(member => member.id === id ? {
      ...member,
      status: member.status === 'active' ? 'inactive' : 'active'
    } : member));
    setShowDropdown(null);
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Team Management
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Manage your P&P team members and their permissions
          </p>
        </div>
        {/* Filters and search bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search team members..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FECC0E] focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={() => setFilterRole(null)}>
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                {filterRole || 'All Roles'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {/* Dropdown for role filter would go here */}
            </div>
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={() => setFilterDepartment(null)}>
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                {filterDepartment || 'All Departments'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {/* Dropdown for department filter would go here */}
            </div>
            <button className="flex items-center px-4 py-2 bg-[#FECC0E] text-gray-900 rounded-md hover:bg-[#FECC0E]/90 focus:outline-none" onClick={() => setShowAddMemberModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </button>
          </div>
        </div>
        {/* Team members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? filteredMembers.map(member => <div key={member.id} className={`bg-white rounded-lg border ${member.status === 'active' ? 'border-gray-200' : 'border-gray-200 opacity-75'} shadow-sm overflow-hidden`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full object-cover mr-4" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowDropdown(showDropdown === member.id ? null : member.id)}>
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                      {showDropdown === member.id && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => alert('Edit member functionality would go here')}>
                              <Edit2 className="h-4 w-4 mr-2 text-gray-500" />
                              Edit Member
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => toggleMemberStatus(member.id)}>
                              <Check className="h-4 w-4 mr-2 text-gray-500" />
                              {member.status === 'active' ? 'Set as Inactive' : 'Set as Active'}
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left" onClick={() => handleDeleteMember(member.id)}>
                              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                              Remove Member
                            </button>
                          </div>
                        </div>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {member.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {member.department}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map(permission => <span key={permission} className={`px-2 py-1 text-xs rounded-full ${permission === 'admin' ? 'bg-purple-100 text-purple-800' : permission === 'approve' ? 'bg-green-100 text-green-800' : permission === 'edit' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {permission.charAt(0).toUpperCase() + permission.slice(1)}
                        </span>)}
                    </div>
                  </div>
                  <div className="mt-4 pt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>) : <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No team members found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>}
        </div>
      </div>
      {/* Add Member Modal */}
      {showAddMemberModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add Team Member
              </h3>
              <button className="text-gray-400 hover:text-gray-500" onClick={() => setShowAddMemberModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Enter email address" />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select id="role" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                      <option value="">Select role</option>
                      <option value="P&P Team Lead">P&P Team Lead</option>
                      <option value="Policy Analyst">Policy Analyst</option>
                      <option value="Document Specialist">
                        Document Specialist
                      </option>
                      <option value="Compliance Officer">
                        Compliance Officer
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select id="department" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                      <option value="">Select department</option>
                      <option value="Policies & Procedures">
                        Policies & Procedures
                      </option>
                      <option value="Compliance">Compliance</option>
                      <option value="Risk Management">Risk Management</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="perm-view" className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" defaultChecked />
                        <label htmlFor="perm-view" className="ml-2 block text-sm text-gray-700">
                          View (Can view documents and policies)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="perm-edit" className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" />
                        <label htmlFor="perm-edit" className="ml-2 block text-sm text-gray-700">
                          Edit (Can create and edit documents)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="perm-approve" className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" />
                        <label htmlFor="perm-approve" className="ml-2 block text-sm text-gray-700">
                          Approve (Can approve document changes)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="perm-admin" className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" />
                        <label htmlFor="perm-admin" className="ml-2 block text-sm text-gray-700">
                          Admin (Full system access)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]" onClick={() => setShowAddMemberModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]" onClick={() => {
                alert('Add member functionality would go here');
                setShowAddMemberModal(false);
              }}>
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </div>;
};
export default Team;