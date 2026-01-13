import React from "react";
import {
  Card, CardContent, Typography, Grid, TextField, Stack, Button, Box, Divider,
  Alert, CircularProgress, IconButton
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadImagesMutation,
} from "../../Features/api/apiSlice";
import SortableImageGrid from "./SortableImageGrid";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const [form, setForm] = React.useState({
    title: "", price: "", category: "", brand: "Uomo", stock: 0, description: ""
  });
  const [imageUrls, setImageUrls] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        price: product.price ?? "",
        category: product.category || "",
        brand: product.brand || "Uomo",
        stock: product.stock ?? 0,
        description: product.description || "",
      });
      setImageUrls(product.images || []);
    }
  }, [product]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePickFiles = async (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    try {
      const res = await uploadImages(fd).unwrap();
      setImageUrls((prev) => [...prev, ...(res.urls || [])]);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Image upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (url) => setImageUrls((prev) => prev.filter((u) => u !== url));

  const handleSave = async () => {
    setError("");
    if (!form.title.trim()) return setError("Title is required");
    if (!form.category.trim()) return setError("Category is required");
    if (!form.price || Number(form.price) <= 0) return setError("Price must be > 0");
    if (imageUrls.length === 0) return setError("At least 1 image is required");

    const body = {
      title: form.title.trim(),
      category: form.category.trim(),
      brand: form.brand?.trim() || "Uomo",
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description || "",
      images: imageUrls,
    };

    try {
      await updateProduct({ id, body }).unwrap();
      navigate("/admin/products");
    } catch (err) {
      setError(err?.data?.message || err?.error || "Failed to update product");
    }
  };

  const base = process.env.REACT_APP_API_URL || "http://localhost:5001";

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Edit Product</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Update product details and images
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Title" name="title" value={form.title} onChange={onChange} fullWidth />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Category" name="category" value={form.category} onChange={onChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Brand" name="brand" value={form.brand} onChange={onChange} fullWidth />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Price" name="price" type="number" value={form.price} onChange={onChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={onChange} fullWidth />
                  </Grid>
                </Grid>

                <TextField label="Description" name="description" value={form.description} onChange={onChange} fullWidth multiline minRows={4} />
                <Divider />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate("/admin/products")}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || uploading}
                    startIcon={(saving || uploading) ? <CircularProgress size={18} /> : null}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Images</Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload More"}
                  <input hidden type="file" multiple accept="image/*" onChange={handlePickFiles} />
                </Button>

              

                {imageUrls.length > 0 ? (
  <SortableImageGrid
    images={imageUrls}
    setImages={setImageUrls}
    baseUrl={base}
    onRemove={(url) => removeImage(url)}
  />
) : (
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
