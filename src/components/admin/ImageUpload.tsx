import React, { useState } from 'react';
import { UploadCloudIcon, XIcon, GripVerticalIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUpload: (files: File[]) => Promise<void>;
  loading?: boolean;
}

// Компонент одной сортируемой фотографии
function SortablePhoto({ url, onRemove, index }: { url: string; onRemove: () => void; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
    >
      <img
        src={url}
        alt={`Product ${index + 1}`}
        className="w-full h-full object-contain p-2"
      />

      {/* Кнопка удаления */}
      <button
        type="button"
        onClick={(e) => {
           e.stopPropagation(); // Предотвращаем начало перетаскивания при клике
           onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <XIcon className="w-4 h-4" />
      </button>

      {/* Хэндл для перетаскивания (необязательно, можно тянуть за всё фото, но с иконкой понятнее) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-white/80 text-gray-600 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      >
        <GripVerticalIcon className="w-4 h-4" />
      </div>

      {/* Номер фото */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
        {index + 1}
      </div>
    </div>
  );
}

export function ImageUpload({ images, onChange, onUpload, loading }: ImageUploadProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Настройка сенсоров (мышь и тач)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Начинать драг только если сдвинули на 8px (чтобы не путать с кликом)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      // Меняем порядок в массиве и отдаем родителю
      onChange(arrayMove(images, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onUpload(Array.from(e.target.files));
      // Очищаем инпут, чтобы можно было загрузить тот же файл повторно
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Зона загрузки */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <UploadCloudIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>

      {/* Сортируемая сетка изображений */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <SortablePhoto
                key={url}
                url={url}
                index={index}
                onRemove={() => onChange(images.filter((img) => img !== url))}
              />
            ))}
          </div>
        </SortableContext>

        {/* Оверлей перетаскиваемого элемента (для красоты) */}
        <DragOverlay adjustScale={true}>
          {activeId ? (
            <div className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-blue-500 shadow-xl opacity-90">
              <img
                src={activeId}
                alt="Dragging"
                className="w-full h-full object-contain p-2"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}