import React from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// Single sortable item
function SortableImageItem({ id, url, index, baseUrl, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,   // ✅ drag handle ref
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
    userSelect: "none",
  };

  return (
    <Grid item xs={6}>
      <Box
        ref={setNodeRef}
        sx={{
          ...style,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
          aspectRatio: "1 / 1",
          bgcolor: "background.default",
        }}
      >
        <img
          src={`${baseUrl}${url}`}
          alt="preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />

        {/* Main badge */}
        {index === 0 && (
          <Box
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Main
            </Typography>
          </Box>
        )}

        {/* ✅ Drag handle (only this area drags) */}
        <IconButton
          size="small"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          sx={{
            position: "absolute",
            bottom: 6,
            left: 6,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            cursor: "grab",
            touchAction: "none", // helps mobile drag
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>

        {/* Delete */}
        <IconButton
          size="small"
          onClick={() => onRemove(url)}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Grid>
  );
}

export default function SortableImageGrid({ images, setImages, baseUrl, onRemove }) {
  // Sensors for desktop + mobile
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setImages((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <Grid container spacing={1}>
          {images.map((url, idx) => (
            <SortableImageItem
              key={url}
              id={url}
              url={url}
              index={idx}
              baseUrl={baseUrl}
              onRemove={onRemove}
            />
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}
