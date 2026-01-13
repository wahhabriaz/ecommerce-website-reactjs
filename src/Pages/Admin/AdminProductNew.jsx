import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useCreateProductMutation, useUploadImagesMutation } from "../../Features/api/apiSlice";
import { useNavigate } from "react-router-dom";

export default function AdminProductNew() {
  const navigate = useNavigate();
  const [createProduct, { isLoading: saving }] = useCreateProductMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const [form, setForm] = React.useState({
    title: "",
    price: "",
    category: "",
    brand: "Uomo",
    stock: 0,
    description: "",
  });

  const [imageUrls, setImageUrls] = React.useState([]); // strings returned by API: "/uploads/..."
  const [error, setError] = React.useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePickFiles = async (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fd = new FormData();
    files.forEach((f) => fd.append("images", f)); // IMPORTANT: key must be "images"

    try {
      const res = await uploadImages(fd).unwrap();
      setImageUrls((prev) => [...prev, ...(res.urls || [])]);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Image upload failed");
    } finally {
      e.target.value = ""; // allow re-select same file
    }
  };

  const removeImage = (url) => setImageUrls((prev) => prev.filter((u) => u !== url));

  const handleSave = async () => {
    setError("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.category.trim()) return setError("Category is required");
    if (!form.price || Number(form.price) <= 0) return setError("Price must be greater than 0");
    if (imageUrls.length === 0) return setError("Please upload at least 1 product image");

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      brand: form.brand?.trim() || "Uomo",
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description || "",
      images: imageUrls,
    };

    try {
      await createProduct(payload).unwrap();
      navigate("/admin/products");
    } catch (err) {
      setError(err?.data?.message || err?.error || "Failed to create product");
    }
  };

  const base = process.env.REACT_APP_API_URL || "http://localhost:5001";

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          New Product
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Create a new item in your catalog
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {/* Left: Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  fullWidth
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Category"
                      name="category"
                      value={form.category}
                      onChange={onChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Brand"
                      name="brand"
                      value={form.brand}
                      onChange={onChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={onChange}
                      fullWidth
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Stock"
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={onChange}
                      fullWidth
                      inputProps={{ min: 0, step: "1" }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  fullWidth
                  multiline
                  minRows={4}
                />

                <Divider />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate("/admin/products")}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || uploading}
                    startIcon={(saving || uploading) ? <CircularProgress size={18} /> : null}
                  >
                    Save Product
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Images */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Images
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Upload multiple images. First image is used as the main display.
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                  <input hidden type="file" multiple accept="image/*" onChange={handlePickFiles} />
                </Button>

                <Grid container spacing={1}>
                  {imageUrls.map((url) => (
                    <Grid item xs={6} key={url}>
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.12)",
                          aspectRatio: "1 / 1",
                          bgcolor: "background.default",
                        }}
                      >
                        <img
                          src={`${base}${url}`}
                          alt="preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(url)}
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
                  ))}
                </Grid>

                {imageUrls.length === 0 && (
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      No images uploaded yet.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
