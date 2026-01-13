import React from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Stack,
  Dialog,
  AppBar,
  Toolbar,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
function SortableImageItem({
  id,
  url,
  index,
  baseUrl,
  onRemove,
  onPreview,
  onOpenFull,
  isSelected,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
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
    <Grid item xs={6} sm={4}>
      <Box
        ref={setNodeRef}
        sx={{
          ...style,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          border: isSelected ? "2px solid" : "1px solid rgba(0,0,0,0.12)",
          borderColor: isSelected ? "primary.main" : "rgba(0,0,0,0.12)",
          aspectRatio: "1 / 1",
          bgcolor: "background.default",
        }}
        onClick={() => onPreview(url)}
      >
        <img
          src={`${baseUrl}${url}`}
          alt="thumb"
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

        {/* Zoom (fullscreen) */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(url);
            onOpenFull(url);
          }}
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
          }}
        >
          <ZoomInIcon fontSize="small" />
        </IconButton>

        {/* Drag handle */}
        <IconButton
          size="small"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: "absolute",
            bottom: 6,
            left: 6,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>

        {/* Delete */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(url);
          }}
          sx={{
            position: "absolute",
            bottom: 6,
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
  const [previewUrl, setPreviewUrl] = React.useState(images?.[0] || "");
  const [fullOpen, setFullOpen] = React.useState(false);

  React.useEffect(() => {
    if (!images?.length) {
      setPreviewUrl("");
      setFullOpen(false);
      return;
    }
    if (!previewUrl || !images.includes(previewUrl)) {
      setPreviewUrl(images[0]);
    }
  }, [images, previewUrl]);

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

  const openFull = (url) => {
    setPreviewUrl(url);
    setFullOpen(true);
  };

  const closeFull = () => setFullOpen(false);

  const idx = previewUrl ? images.indexOf(previewUrl) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < images.length - 1;

  const goPrev = () => {
    if (!hasPrev) return;
    setPreviewUrl(images[idx - 1]);
  };
  const goNext = () => {
    if (!hasNext) return;
    setPreviewUrl(images[idx + 1]);
  };

  // keyboard controls in fullscreen
  React.useEffect(() => {
    if (!fullOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeFull();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullOpen, idx, previewUrl, images]);

  return (
    <Stack spacing={1.5}>
      {/* Big Preview */}
      <Box
        sx={{
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
          bgcolor: "background.default",
          aspectRatio: { xs: "16 / 10", sm: "16 / 9" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: previewUrl ? "zoom-in" : "default",
        }}
        onClick={() => previewUrl && openFull(previewUrl)}
      >
        {previewUrl ? (
          <>
            <img
              src={`${baseUrl}${previewUrl}`}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              draggable={false}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.55)",
                color: "white",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Click to fullscreen
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            No image selected
          </Typography>
        )}
      </Box>

      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        Drag using the handle to reorder. First image is the main image. Click a thumbnail to preview.
      </Typography>

      {/* Thumbnails Grid with Drag & Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <Grid container spacing={1}>
            {images.map((url, i) => (
              <SortableImageItem
                key={url}
                id={url}
                url={url}
                index={i}
                baseUrl={baseUrl}
                onRemove={onRemove}
                onPreview={setPreviewUrl}
                onOpenFull={openFull}
                isSelected={previewUrl === url}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>

      {/* Fullscreen lightbox */}
      <Dialog fullScreen open={fullOpen} onClose={closeFull}>
        <AppBar sx={{ position: "relative" }} elevation={0}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" color="inherit" onClick={closeFull} aria-label="close">
              <CloseIcon />
            </IconButton>

            <Typography sx={{ ml: 1, flex: 1 }} variant="h6" component="div">
              Image Preview
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {idx >= 0 ? `${idx + 1} / ${images.length}` : ""}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            height: "100%",
            width: "100%",
            bgcolor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Prev */}
          <IconButton
            onClick={goPrev}
            disabled={!hasPrev}
            sx={{
              position: "absolute",
              left: 12,
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Image */}
          {previewUrl && (
            <img
              src={`${baseUrl}${previewUrl}`}
              alt="full"
              style={{
                maxWidth: "96vw",
                maxHeight: "86vh",
                objectFit: "contain",
              }}
              draggable={false}
            />
          )}

          {/* Next */}
          <IconButton
            onClick={goNext}
            disabled={!hasNext}
            sx={{
              position: "absolute",
              right: 12,
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Hint */}
          <Box sx={{ position: "absolute", bottom: 18, color: "rgba(255,255,255,0.75)" }}>
            <Typography variant="caption">
              Use ← → keys to navigate • ESC to close
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </Stack>
  );
}
