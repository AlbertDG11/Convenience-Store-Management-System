// src/pages/purchases/PurchaseList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchPurchases,
  deletePurchase
} from '../../api';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, IconButton, Collapse, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete as DeleteIcon
} from '@mui/icons-material';

export default function PurchaseList() {
  const [rows, setRows] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    fetchPurchases()
      .then(res => setRows(res.data || []))
      .catch(console.error);
  };

  const onDeleteClick = id => {
    setToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!toDeleteId) return;
    deletePurchase(toDeleteId)
      .then(() => {
        load();
        setDeleteDialogOpen(false);
        setToDeleteId(null);
      })
      .catch(err => {
        console.error(err);
        setDeleteDialogOpen(false);
        setToDeleteId(null);
      });
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <Button
        variant="contained"
        onClick={() => navigate('/purchases/new')}
        sx={{ mb: 2 }}
      >
        New Purchase
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell/>
            <TableCell>Purchase ID</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <React.Fragment key={r.purchase_id}>
              <TableRow hover>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setOpenRow(openRow === r.purchase_id ? null : r.purchase_id)
                    }
                  >
                    {openRow === r.purchase_id
                      ? <KeyboardArrowUp/>
                      : <KeyboardArrowDown/>}
                  </IconButton>
                </TableCell>
                <TableCell>{r.purchase_id}</TableCell>
                <TableCell>{r.purchase_time}</TableCell>
                <TableCell>{r.supplier_name || r.supplier}</TableCell>
                <TableCell>${parseFloat(r.total_cost || 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => navigate(`/purchases/${r.purchase_id}/edit`)}
                  >
                    <Edit/>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDeleteClick(r.purchase_id)}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse in={openRow === r.purchase_id} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="subtitle2">Items:</Typography>
                      {r.items.map(item => (
                        <Box key={item.id} sx={{ ml: 2, mt: 0.5 }}>
                          ID: {item.id}, Product: {item.product_name || item.product},
                          Qty: {item.quantity_purchased}
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Purchase</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this purchase? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button onClick={confirmDelete} color="error">
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
