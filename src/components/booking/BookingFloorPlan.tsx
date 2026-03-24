import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, useDragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { 
  Trash2, RotateCw, ZoomIn, ZoomOut, Grid, 
  Layout, Square, Circle, Save, 
  Maximize, Minimize, Sofa,
  DoorOpen, ScanLine, Flower2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FloorObject, ObjectType, Room } from './types';

// Constants
const GRID_SIZE = 20;
const ITEM_TYPES = {
  OBJECT: 'object',
  NEW_OBJECT: 'new_object'
};

const snapToGrid = (x: number, y: number) => {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return [snappedX, snappedY];
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Sidebar Item (Draggable) ---
interface SidebarItemProps {
  type: ObjectType;
  label: string;
  icon: React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  defaultSeats?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon, defaultWidth, defaultHeight, defaultSeats }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ITEM_TYPES.NEW_OBJECT,
    item: { type, defaultWidth, defaultHeight, defaultSeats, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      className={`
        flex flex-col items-center justify-center p-3 
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
        rounded-lg cursor-grab hover:shadow-md transition-all hover:bg-blue-50 dark:hover:bg-gray-700
        ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : 'opacity-100'}
      `}
    >
      <div className="mb-2 text-gray-700 dark:text-gray-300 pointer-events-none">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight select-none">
        {label}
      </span>
    </div>
  );
};

// --- Styles Helper ---
const getObjectStyles = (
  type: ObjectType, 
  width: number, 
  height: number, 
  rotation: number, 
  isSelected: boolean = false, 
  isDragging: boolean = false
) => {
  const base = {
    width,
    height,
    transform: `rotate(${rotation}deg)`,
    // Disable transition during drag to prevent lag, enable otherwise for smooth updates
    transition: isDragging ? 'none' : 'box-shadow 0.2s', 
    touchAction: 'none' // Important for pointer events
  };

  if (type === 'wall') {
    return {
      ...base,
      backgroundColor: '#374151',
      borderRadius: '2px',
      boxShadow: isSelected ? '0 0 0 2px #3b82f6' : '0 1px 2px rgba(0,0,0,0.2)'
    };
  }
  if (type === 'plant') {
    return {
      ...base,
      backgroundColor: '#dcfce7',
      border: '2px solid #22c55e',
      borderRadius: '50%',
      boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none'
    };
  }
  if (type === 'door' || type === 'window') {
    return {
      ...base,
      backgroundColor: '#cbd5e1',
      border: '1px solid #64748b',
      boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none'
    };
  }

  // Tables
  const isRound = type === 'table-round';
  return {
    ...base,
    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
    border: `2px solid ${isSelected ? '#3b82f6' : '#9ca3af'}`,
    borderRadius: isRound ? '50%' : '6px',
    boxShadow: isSelected ? '0 4px 6px -1px rgba(59, 130, 246, 0.5)' : '0 2px 4px rgba(0,0,0,0.05)'
  };
};

// --- Canvas Object ---
interface CanvasObjectProps {
  object: FloorObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FloorObject>) => void;
  onDelete: (id: string) => void;
}

const CanvasObject: React.FC<CanvasObjectProps> = ({ object, isSelected, onSelect, onUpdate, onDelete }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.OBJECT,
    item: { id: object.id, type: object.type, x: object.x, y: object.y, width: object.width, height: object.height, rotation: object.rotation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [object]);

  // Robust Rotation Logic using Pointer Events
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Stop drag from starting
    e.preventDefault(); // Prevent text selection
    
    const element = elementRef.current;
    if (!element) return;

    // Capture the pointer so we keep receiving events even if mouse leaves the element
    (e.target as Element).setPointerCapture(e.pointerId);

    // Calculate center relative to the viewport
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const onPointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      
      // Calculate angle in degrees
      // atan2(y, x) gives angle from X axis (right)
      // We want 0 degrees to be UP (handle position).
      // So we adjust by +90 degrees.
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      
      // Normalize to 0-360
      if (angle < 0) angle += 360;
      
      // Snap to 45 degree increments if close
      const snapInterval = 45;
      const snapThreshold = 5;
      
      const remainder = angle % snapInterval;
      // Check distance to lower bound
      if (remainder < snapThreshold) {
        angle = angle - remainder;
      } 
      // Check distance to upper bound
      else if (snapInterval - remainder < snapThreshold) {
        angle = angle + (snapInterval - remainder);
      }
      
      onUpdate(object.id, { rotation: Math.round(angle) });
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      (e.target as Element).releasePointerCapture(upEvent.pointerId);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const renderChairs = () => {
    if (!object.seats || ['wall', 'plant', 'door', 'window'].includes(object.type)) return null;
    
    // Improved chair visualization with better spacing
    return (
      <>
        {/* Top/Bottom Chairs */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-400 rounded-full" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-400 rounded-full" />
        
        {object.seats > 2 && (
          <>
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
          </>
        )}
        
        {/* Additional chairs for 6-tops or 8-tops could be added here */}
        {object.seats >= 6 && object.type === 'table-rect' && (
           <>
              {/* Extra chairs on sides */}
              <div className="absolute top-[20%] -left-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
              <div className="absolute bottom-[20%] -left-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
              <div className="absolute top-[20%] -right-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
              <div className="absolute bottom-[20%] -right-1.5 -translate-y-1/2 w-1.5 h-8 bg-gray-400 rounded-full" />
           </>
        )}
      </>
    );
  };

  // Combine refs
  // We need both the drag ref (for DnD) and the element ref (for rotation center calc)
  const setRefs = (element: HTMLDivElement | null) => {
    drag(element);
    (elementRef as any).current = element;
  };

  if (isDragging) return <div ref={setRefs} className="opacity-0" />;

  return (
    <div
      ref={setRefs}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
      style={{
        position: 'absolute',
        left: object.x,
        top: object.y,
        ...getObjectStyles(object.type, object.width, object.height, object.rotation, isSelected, isDragging),
      }}
      className={`
        absolute flex items-center justify-center cursor-move group select-none
        ${isSelected ? 'z-30' : 'z-10 hover:z-20'}
      `}
    >
      {renderChairs()}
      
      {/* Content */}
      {!['wall', 'door', 'window'].includes(object.type) && (
        <div 
          className="pointer-events-none select-none font-bold text-gray-700 text-sm flex flex-col items-center justify-center transform"
          style={{ transform: `rotate(${-object.rotation}deg)` }}
        >
          {object.type === 'plant' ? <Flower2 className="w-5 h-5 text-green-600" /> : (
            <>
              <span className="leading-none">{object.label}</span>
              {object.seats && <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">{object.seats}p</span>}
            </>
          )}
        </div>
      )}

      {/* Handles (Selected Only) */}
      {isSelected && (
        <>
          {/* Rotation Handle UI */}
          <div 
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 cursor-grab active:cursor-grabbing group/handle"
            onPointerDown={handleRotatePointerDown}
          >
             {/* The visible handle */}
             <div className="w-5 h-5 bg-blue-500 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform ring-2 ring-white">
                <RotateCw className="w-3 h-3 text-white" />
             </div>
             {/* The connecting line */}
             <div className="w-0.5 h-5 bg-blue-500" />
             
             {/* Angle tooltip on hover/drag */}
             <div className="absolute bottom-full mb-1 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-opacity whitespace-nowrap">
               {object.rotation}°
             </div>
          </div>
          
          {/* Visual Center Point for Rotation Reference */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(object.id);
            }}
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 p-1.5 bg-white border border-gray-200 text-red-500 rounded-full shadow-sm hover:bg-red-50 hover:border-red-200 transition-all z-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
};

// --- Drag Layer ---
const CustomDragLayer = () => {
  const { isDragging, item, itemType, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) return null;

  // Defaults for preview
  let width = 60;
  let height = 60;
  let type: ObjectType = 'table-square';
  let rotation = 0;

  if (itemType === ITEM_TYPES.NEW_OBJECT) {
    width = item.defaultWidth;
    height = item.defaultHeight;
    type = item.type;
  } else if (itemType === ITEM_TYPES.OBJECT) {
    width = item.width;
    height = item.height;
    type = item.type;
    rotation = item.rotation;
  }

  return (
    <div className="fixed pointer-events-none z-[100] left-0 top-0 w-full h-full">
      <div style={{ 
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}>
        <div style={getObjectStyles(type, width, height, rotation, true, false)} className="flex items-center justify-center opacity-90 shadow-2xl scale-105">
           {!['wall', 'door', 'window'].includes(type) && (
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-50" />
           )}
        </div>
      </div>
    </div>
  );
};

// --- Main Floor Plan Component ---
interface BookingFloorPlanProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  activeRoomId: string;
  setActiveRoomId: (id: string) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

export const BookingFloorPlan: React.FC<BookingFloorPlanProps> = ({
  rooms, setRooms, activeRoomId, setActiveRoomId, isFullScreen, onToggleFullScreen
}) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const dropRef = useRef<HTMLDivElement>(null);
  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];
  const selectedObject = activeRoom.objects.find(o => o.id === selectedObjectId);

  const [, drop] = useDrop(() => ({
    accept: [ITEM_TYPES.NEW_OBJECT, ITEM_TYPES.OBJECT],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!dropRef.current || !clientOffset) return;

      const dropRect = dropRef.current.getBoundingClientRect();
      
      // Calculate scaled coordinates
      // (ClientPos - ContainerPos) / Zoom
      const x = (clientOffset.x - dropRect.left) / zoom;
      const y = (clientOffset.y - dropRect.top) / zoom;
      
      const [snappedX, snappedY] = snapToGrid(x, y);

      if (monitor.getItemType() === ITEM_TYPES.NEW_OBJECT) {
        // Place new object centered on cursor
        const newObj: FloorObject = {
          id: generateId(),
          type: item.type,
          x: snappedX - (item.defaultWidth / 2),
          y: snappedY - (item.defaultHeight / 2),
          width: item.defaultWidth,
          height: item.defaultHeight,
          rotation: 0,
          seats: item.defaultSeats,
          label: item.label.includes('Top') ? `${activeRoom.objects.filter(o => o.type.includes('table')).length + 1}` : undefined
        };
        addReviewObject(newObj);
      } else {
        // Move existing object
        // We use the item's current width/height to center it on the cursor drop point
        updateObject(item.id, { 
          x: snappedX - (item.width / 2), 
          y: snappedY - (item.height / 2)
        });
      }
    }
  }), [activeRoom, zoom]);

  drop(dropRef);

  // Actions
  const addReviewObject = (obj: FloorObject) => {
    setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, objects: [...r.objects, obj] } : r));
    setSelectedObjectId(obj.id);
  };
  
  const updateObject = (id: string, updates: Partial<FloorObject>) => {
    setRooms(prev => prev.map(r => r.id === activeRoomId ? {
      ...r, objects: r.objects.map(o => o.id === id ? { ...o, ...updates } : o)
    } : r));
  };
  
  const updateRoom = (updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, ...updates } : r));
  };

  const deleteObject = (id: string) => {
    setRooms(prev => prev.map(r => r.id === activeRoomId ? {
      ...r, objects: r.objects.filter(o => o.id !== id)
    } : r));
    setSelectedObjectId(null);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* Toolbar */}
      <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm z-20 shrink-0">
        <div className="flex items-center space-x-2">
          {isFullScreen && (
             <span className="font-bold text-lg mr-4 text-gray-800 dark:text-white">Floor Plan Editor</span>
          )}
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
             <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded">
               <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
             </button>
             <span className="w-12 text-center text-xs font-medium py-1.5">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded">
               <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
             </button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowGrid(!showGrid)} className="gap-2 text-xs">
            <Grid className="w-4 h-4" /> {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
           <Button 
             variant="outline" 
             size="sm" 
             onClick={onToggleFullScreen}
             className="gap-2 hidden md:flex"
           >
             {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
             {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
           </Button>
           
           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
             <Save className="w-4 h-4" /> Save
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Draggables) */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-10 shadow-sm shrink-0 overflow-hidden">
          <div className="p-4 overflow-y-auto custom-scrollbar h-full">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tables</h4>
                <div className="grid grid-cols-2 gap-2">
                  <SidebarItem type="table-square" label="2 Top" icon={<Square className="w-5 h-5" />} defaultWidth={50} defaultHeight={50} defaultSeats={2} />
                  <SidebarItem type="table-rect" label="4 Top" icon={<Layout className="w-5 h-5 rotate-90" />} defaultWidth={60} defaultHeight={90} defaultSeats={4} />
                  <SidebarItem type="table-round" label="Round 4" icon={<Circle className="w-5 h-5" />} defaultWidth={80} defaultHeight={80} defaultSeats={4} />
                  <SidebarItem type="table-rect" label="6 Top" icon={<Layout className="w-6 h-6 rotate-90" />} defaultWidth={70} defaultHeight={120} defaultSeats={6} />
                  <SidebarItem type="booth" label="Booth" icon={<Sofa className="w-5 h-5" />} defaultWidth={100} defaultHeight={60} defaultSeats={4} />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Structure</h4>
                <div className="grid grid-cols-2 gap-2">
                  <SidebarItem type="wall" label="Wall" icon={<div className="w-8 h-1 bg-gray-400" />} defaultWidth={100} defaultHeight={8} />
                  <SidebarItem type="door" label="Door" icon={<DoorOpen className="w-5 h-5" />} defaultWidth={60} defaultHeight={60} />
                  <SidebarItem type="window" label="Window" icon={<ScanLine className="w-5 h-5" />} defaultWidth={60} defaultHeight={8} />
                  <SidebarItem type="plant" label="Plant" icon={<Flower2 className="w-5 h-5" />} defaultWidth={40} defaultHeight={40} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center p-8"
          onClick={() => setSelectedObjectId(null)}
        >
          <div 
            ref={dropRef}
            style={{ 
              width: activeRoom.width, 
              height: activeRoom.height, 
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              backgroundImage: showGrid 
                ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' 
                : 'none',
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
            className="bg-white transition-all shadow-xl relative"
          >
            {activeRoom.objects.map(obj => (
              <CanvasObject 
                key={obj.id} 
                object={obj} 
                isSelected={selectedObjectId === obj.id}
                onSelect={setSelectedObjectId}
                onUpdate={updateObject}
                onDelete={deleteObject}
              />
            ))}
            
            {/* Dimensions */}
            <div className="absolute -top-8 left-0 text-gray-400 text-xs font-mono select-none">{activeRoom.width}px</div>
            <div className="absolute top-0 -left-8 text-gray-400 text-xs font-mono -rotate-90 origin-top-right translate-x-full select-none">{activeRoom.height}px</div>
          </div>
        </div>

        {/* Properties Panel (Right) */}
        <div className="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-20 shrink-0 p-4 overflow-y-auto">
           {selectedObject ? (
             <>
               <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white border-b pb-2">Properties</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input 
                      value={selectedObject.label || ''} 
                      onChange={(e) => updateObject(selectedObject.id, { label: e.target.value })}
                    />
                  </div>

                  {selectedObject.seats !== undefined && (
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => updateObject(selectedObject.id, { seats: Math.max(1, (selectedObject.seats||0) - 1) })}>-</Button>
                        <Input 
                          type="number" 
                          value={selectedObject.seats} 
                          onChange={(e) => updateObject(selectedObject.id, { seats: parseInt(e.target.value) })}
                          className="text-center"
                        />
                        <Button variant="outline" size="icon" onClick={() => updateObject(selectedObject.id, { seats: (selectedObject.seats||0) + 1 })}>+</Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label>Rotation ({selectedObject.rotation}°)</Label>
                       <RotateCw className="w-4 h-4 text-gray-400" />
                     </div>
                     <Input 
                        type="range"
                        min="0"
                        max="360"
                        value={selectedObject.rotation}
                        onChange={(e) => updateObject(selectedObject.id, { rotation: parseInt(e.target.value) })}
                        className="w-full"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                        <Label className="text-xs">W</Label>
                        <Input 
                          type="number" 
                          value={selectedObject.width} 
                          onChange={(e) => updateObject(selectedObject.id, { width: parseInt(e.target.value) })}
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-xs">H</Label>
                        <Input 
                          type="number" 
                          value={selectedObject.height} 
                          onChange={(e) => updateObject(selectedObject.id, { height: parseInt(e.target.value) })}
                        />
                     </div>
                  </div>

                  <Button variant="destructive" className="w-full mt-4" onClick={() => deleteObject(selectedObject.id)}>
                     <Trash2 className="w-4 h-4 mr-2" /> Delete Object
                  </Button>
               </div>
             </>
           ) : (
             <>
               <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white border-b pb-2">Room Settings</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Room Name</Label>
                    <Input 
                      value={activeRoom.name} 
                      onChange={(e) => updateRoom({ name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Width (px)</Label>
                          <Input 
                            type="number" 
                            value={activeRoom.width} 
                            onChange={(e) => updateRoom({ width: parseInt(e.target.value) || 100 })}
                          />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Height (px)</Label>
                          <Input 
                            type="number" 
                            value={activeRoom.height} 
                            onChange={(e) => updateRoom({ height: parseInt(e.target.value) || 100 })}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300 mt-4">
                     <p><strong>Tip:</strong> Drag the blue handle above an object to rotate it. It snaps to 45° angles.</p>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>

      <CustomDragLayer />
    </div>
  );
};
