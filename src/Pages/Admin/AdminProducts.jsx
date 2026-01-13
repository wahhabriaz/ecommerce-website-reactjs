import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Pagination,IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Link } from "react-router-dom";
import { useGetProductsQuery,useDeleteProductMutation } from "../../Features/api/apiSlice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";



export default function AdminProducts() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useGetProductsQuery({ page, limit: 12 });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
const [toDelete, setToDelete] = React.useState(null);
const [deleteErr, setDeleteErr] = React.useState("");


  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  return (
    <>
    <Stack spacing={2}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Products
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            View and manage your catalog
          </Typography>
        </Box>

        <Button variant="contained" component={Link} to="/admin/products/new">
          Add Product
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {isLoading ? (
            <Stack spacing={1}>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </Stack>
          ) : isError ? (
            <Typography color="error">Failed to load products.</Typography>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((p) => (
                    <TableRow key={p._id} hover>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>{p.category || "-"}</TableCell>
                      <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                      <TableCell>{p.stock ?? 0}</TableCell>
                      <TableCell>
                        {(p.stock ?? 0) > 0 ? <Chip label="In stock" size="small" /> : <Chip label="Out" size="small" />}
                      </TableCell>
                      <TableCell align="right">
                    <Tooltip title="Edit">
                    <IconButton component={Link} to={`/admin/products/${p._id}/edit`}>
                        <EditOutlinedIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => setToDelete(p)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                    </Tooltip>

</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Pagination count={pages} page={page} onChange={(_, v) => setPage(v)} />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
    <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
  <DialogTitle>Delete product?</DialogTitle>
  <DialogContent>
    <Typography variant="body2" sx={{ mt: 1 }}>
      This will permanently delete <b>{toDelete?.title}</b>.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setToDelete(null)}>Cancel</Button>
    <Button
      color="error"
      variant="contained"
      disabled={deleting}
      onClick={async () => {
       try {
  setDeleteErr("");
  await deleteProduct(toDelete._id).unwrap();
  setToDelete(null);
} catch (e) {
  setDeleteErr(e?.data?.message || "Delete failed");
}

      }}
    >
      Delete
    </Button>
  </DialogActions>
  {deleteErr && <Typography color="error" variant="body2">{deleteErr}</Typography>}

</Dialog>

    </>
    
  );
}
