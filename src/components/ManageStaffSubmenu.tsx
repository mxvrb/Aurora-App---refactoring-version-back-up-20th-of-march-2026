import React, { useContext } from 'react';
import { ChevronRight, Plus, Trash2, UserRoundCog as LucideUserRoundCog } from 'lucide-react';
import { StaffMember } from './AddStaffModal';
import { FilterContext } from '../contexts/FilterContext';

interface ManageStaffSubmenuProps {
  staffMembers: StaffMember[];
  onAddStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff?: (staff: StaffMember) => void;
}

export function ManageStaffSubmenu({
  staffMembers,
  onAddStaff,
  onEditStaff,
  onDeleteStaff
}: ManageStaffSubmenuProps) {
  const { getFilterClasses } = useContext(FilterContext);

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Apple-style CTA Header */}
      <div className="relative bg-white dark:bg-gray-800">
        {/* Item 1 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        {/* Item 2 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        {/* Item 3 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        {/* Item 4 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        {/* Overlay with actual centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-xl">
            <LucideUserRoundCog className="w-[34px] h-[34px] text-white drop-shadow-lg" />
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">Manage Staff</span>
          <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md">Manage staff members and their permissions such as role assignments, access levels, and account settings.</p>
        </div>
      </div>

      {/* Menu Items Container */}
      <div className="flex flex-col gap-3 px-4 pb-3">
        {/* Add Staff Button — always full width, consistent with Create A Follow-Up */}
        <div
          onClick={onAddStaff}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className={`flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500 ${getFilterClasses('Add Staff Member')}`}
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">Add Staff Member</span>
        </div>

        {/* Staff List */}
        {staffMembers.map(staff => (
          <div
            key={staff.id}
            onClick={() => onEditStaff(staff)}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="group flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">{staff.firstName} {staff.lastName}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm capitalize">{staff.role}</span>
              {onDeleteStaff && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStaff(staff);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}