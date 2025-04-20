import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, ToggleButtonGroup, ToggleButton
} from '@mui/material';

const BASE = 'http://localhost:8000/api/product';

// --- Product Dialogs ---
function AddProductDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    discount: '',
    price: '',
    price_after_discount: ''
  });
  const handleChange = field => e => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = () => {
    fetch(`${BASE}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(data => { onSave(data); onClose(); })
      .catch(() => alert('Failed to add product'));
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:2 }}>
          <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth />
          <TextField label="Type" value={form.type} onChange={handleChange('type')} fullWidth />
          <TextField label="Discount" value={form.discount} onChange={handleChange('discount')} fullWidth />
          <TextField label="Price" value={form.price} onChange={handleChange('price')} fullWidth />
          <TextField label="Price After Discount" value={form.price_after_discount} onChange={handleChange('price_after_discount')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function UpdateProductDialog({ product, open, onClose, onSave }) {
  const [form, setForm] = useState(null);
  useEffect(() => { if (product) setForm({
    name: product.name,
    type: product.type,
    discount: product.discount,
    price: product.price,
    price_after_discount: product.price_after_discount
  }); }, [product]);
  const handleChange = field => e => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = () => {
    fetch(`${BASE}/products/${product.product_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(data => { onSave(data); onClose(); })
      .catch(() => alert('Failed to update product'));
  };
  if (!form) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:2 }}>
          <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth />
          <TextField label="Type" value={form.type} onChange={handleChange('type')} fullWidth />
          <TextField label="Discount" value={form.discount} onChange={handleChange('discount')} fullWidth />
          <TextField label="Price" value={form.price} onChange={handleChange('price')} fullWidth />
          <TextField label="Price After Discount" value={form.price_after_discount} onChange={handleChange('price_after_discount')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function DeleteProductDialog({ product, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        Are you sure you want to delete product #{product?.product_id}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// --- Food Dialogs ---
function AddFoodDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({ product: '', foodtype: '', storage_cond: '', expiration: '' });
  const handle = f => e => setForm(s => ({ ...s, [f]: e.target.value }));
  const submit = () => {
    fetch(`${BASE}/foodproducts/`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form)
    })
      .then(r=>r.json()).then(d=>{ onSave(d); onClose(); }).catch(()=>alert('Failed to add food'));
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Food Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt:2}}>
          <TextField label="Product ID" value={form.product} onChange={handle('product')} fullWidth />
          <TextField label="Food Type" value={form.foodtype} onChange={handle('foodtype')} fullWidth />
          <TextField label="Storage Cond" value={form.storage_cond} onChange={handle('storage_cond')} fullWidth />
          <TextField label="Expiration (YYYY-MM-DD)" value={form.expiration} onChange={handle('expiration')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function UpdateFoodDialog({ item, open, onClose, onSave }) {
  const [form, setForm] = useState(null);
  useEffect(()=>{ if(item) setForm({ product: item.product, foodtype: item.foodtype, storage_cond: item.storage_cond, expiration: item.expiration }); },[item]);
  const handle = f => e => setForm(s=>({...s,[f]:e.target.value}));
  const submit = ()=>{ fetch(`${BASE}/foodproducts/${item.product}/`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) }) .then(r=>r.json()).then(d=>{onSave(d);onClose()}).catch(()=>alert('Failed to update food')); };
  if(!form) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Food Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt:2}}>
          <TextField label="Food Type" value={form.foodtype} onChange={handle('foodtype')} fullWidth />
          <TextField label="Storage Cond" value={form.storage_cond} onChange={handle('storage_cond')} fullWidth />
          <TextField label="Expiration" value={form.expiration} onChange={handle('expiration')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function DeleteFoodDialog({ item, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Food Product</DialogTitle>
      <DialogContent>Delete food product #{item?.product}?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// --- Non-Food Dialogs ---
function AddNonfoodDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({ product: '', warranty_period: '', brand: '' });
  const handle = f => e => setForm(s => ({ ...s, [f]: e.target.value }));
  const submit = () => { fetch(`${BASE}/nonfoodproducts/`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) }) .then(r=>r.json()).then(d=>{onSave(d);onClose()}).catch(()=>alert('Failed')) };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Non-Food Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt:2}}>
          <TextField label="Product ID" value={form.product} onChange={handle('product')} fullWidth />
          <TextField label="Warranty Period" value={form.warranty_period} onChange={handle('warranty_period')} fullWidth />
          <TextField label="Brand" value={form.brand} onChange={handle('brand')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function UpdateNonfoodDialog({ item, open, onClose, onSave }) {
  const [form, setForm] = useState(null);
  useEffect(()=>{ if(item) setForm({ warranty_period: item.warranty_period, brand: item.brand }); },[item]);
  const handle = f=>e=>setForm(s=>({...s,[f]:e.target.value}));
  const submit=()=>{fetch(`${BASE}/nonfoodproducts/${item.product}/`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}) .then(r=>r.json()).then(d=>{onSave(d);onClose()}).catch(()=>alert('Failed'))};
  if(!form) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Non-Food Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt:2}}>
          <TextField label="Warranty Period" value={form.warranty_period} onChange={handle('warranty_period')} fullWidth />
          <TextField label="Brand" value={form.brand} onChange={handle('brand')} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
function DeleteNonfoodDialog({ item, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Non-Food Product</DialogTitle>
      <DialogContent>Delete non-food product #{item?.product}?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// --- Main Component ---
export default function Product() {
  const [mode, setMode] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // product
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  // food
  const [addFood, setAddFood] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [delFood, setDelFood] = useState(null);
  // nonfood
  const [addNonfood, setAddNonfood] = useState(false);
  const [editNonfood, setEditNonfood] = useState(null);
  const [delNonfood, setDelNonfood] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = `${BASE}/products/`;
    if (mode === 'food') url = `${BASE}/foodproducts/`;
    if (mode === 'nonfood') url = `${BASE}/nonfoodproducts/`;
    fetch(url)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [mode]);

  // generic delete
  const handleDel = () => {
    const path = mode === 'food'
      ? `foodproducts/${delFood.product}/`
      : mode === 'nonfood'
        ? `nonfoodproducts/${delNonfood.product}/`
        : `products/${del.product.product_id}/`;
    fetch(`${BASE}/${path}`, { method: 'DELETE' })
      .then(() => {
        if (mode==='all') setItems(i=>i.filter(x=>x.product_id!==del.product.product_id));
        if (mode==='food') setItems(i=>i.filter(x=>x.product!==delFood.product));
        if (mode==='nonfood') setItems(i=>i.filter(x=>x.product!==delNonfood.product));
        setDel(null); setDelFood(null); setDelNonfood(null);
      });
  };

  if (loading) return <Typography>Loading…</Typography>;

  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h3" gutterBottom>Product Management</Typography>
      <ToggleButtonGroup value={mode} exclusive onChange={(_,v)=>v&&setMode(v)} sx={{ mb:2 }}>
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="food">Food</ToggleButton>
        <ToggleButton value="nonfood">Non‑Food</ToggleButton>
      </ToggleButtonGroup>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              {mode==='all'&&<><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Discount</TableCell><TableCell>Price</TableCell><TableCell>Price After</TableCell></>}
              {mode==='food'&&<><TableCell>Product ID</TableCell><TableCell>Food Type</TableCell><TableCell>Storage</TableCell><TableCell>Expiration</TableCell></>}
              {mode==='nonfood'&&<><TableCell>Product ID</TableCell><TableCell>Warranty</TableCell><TableCell>Brand</TableCell></>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item=>{
              const key = mode==='all'?item.product_id:item.product;
              return (<TableRow key={key}>
                {mode==='all'&&<><TableCell>{item.product_id}</TableCell><TableCell>{item.name}</TableCell><TableCell>{item.type}</TableCell><TableCell>{item.discount}</TableCell><TableCell>{item.price}</TableCell><TableCell>{item.price_after_discount}</TableCell></>}
                {mode==='food'&&<><TableCell>{item.product}</TableCell><TableCell>{item.food_type}</TableCell><TableCell>{item.storage_condition}</TableCell><TableCell>{item.expiration_date}</TableCell></>}
                {mode==='nonfood'&&<><TableCell>{item.product}</TableCell><TableCell>{item.warranty_period}</TableCell><TableCell>{item.brand}</TableCell></>}
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    {mode==='all'&&<><Button size="small" onClick={()=>setEdit(item)}>Edit</Button><Button size="small" color="error" onClick={()=>setDel({product:item})}>Delete</Button></>}
                    {mode==='food'&&<><Button size="small" onClick={()=>setEditFood(item)}>Edit</Button><Button size="small" color="error" onClick={()=>setDelFood(item)}>Delete</Button></>}
                    {mode==='nonfood'&&<><Button size="small" onClick={()=>setEditNonfood(item)}>Edit</Button><Button size="small" color="error" onClick={()=>setDelNonfood(item)}>Delete</Button></>}
                  </Stack>
                </TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {mode==='all'&&<Box sx={{mt:2}}><Button variant="contained" onClick={()=>setAddOpen(true)}>Add Product</Button></Box>}
      {mode==='food'&&<Box sx={{mt:2}}><Button variant="contained" onClick={()=>setAddFood(true)}>Add Food</Button></Box>}
      {mode==='nonfood'&&<Box sx={{mt:2}}><Button variant="contained" onClick={()=>setAddNonfood(true)}>Add Non-Food</Button></Box>}

      {/* CRUD Dialogs */}
      <AddProductDialog open={addOpen} onClose={()=>setAddOpen(false)} onSave={d=>setItems(i=>[...i,d])} />
      <UpdateProductDialog open={!!edit} product={edit} onClose={()=>setEdit(null)} onSave={d=>setItems(i=>i.map(x=>x.product_id===d.product_id?d:x))} />
      <DeleteProductDialog open={!!del} product={del?.product} onClose={()=>setDel(null)} onConfirm={handleDel} />

      <AddFoodDialog open={addFood} onClose={()=>setAddFood(false)} onSave={d=>setItems(i=>[...i,d])} />
      <UpdateFoodDialog open={!!editFood} item={editFood} onClose={()=>setEditFood(null)} onSave={d=>setItems(i=>i.map(x=>x.product===d.product?d:x))} />
      <DeleteFoodDialog open={!!delFood} item={delFood} onClose={()=>setDelFood(null)} onConfirm={handleDel} />

      <AddNonfoodDialog open={addNonfood} onClose={()=>setAddNonfood(false)} onSave={d=>setItems(i=>[...i,d])} />
      <UpdateNonfoodDialog open={!!editNonfood} item={editNonfood} onClose={()=>setEditNonfood(null)} onSave={d=>setItems(i=>i.map(x=>x.product===d.product?d:x))} />
      <DeleteNonfoodDialog open={!!delNonfood} item={delNonfood} onClose={()=>setDelNonfood(null)} onConfirm={handleDel} />
    </Box>
  );
}
