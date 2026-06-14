const fs = require('fs');
let code = fs.readFileSync('c:/Users/ANSH KEDIA/OneDrive/Desktop/STARTUP/FlavourFall/index.html', 'utf-8');

const replacement = `const MenuItemModal = ({ open, onClose, editItem = null }) => {
  const { state, dispatch, toast } = useApp();
  const icons = ['Coffee', 'Cake', 'Cookie', 'Utensils', 'GlassWater', 'ChefHat', 'ShoppingBag', 'Package'];
  const categories = ['Appetizers','Main Course','Indian','Chinese','Italian','Beverages','Desserts'];
  const [form, setForm] = useState({ name:'', category:'Appetizers', price:'', available:true, img:'Utensils', description:'', photo:'', recipe: [] });
  useEffect(() => { if (editItem) setForm({ ...editItem, price: String(editItem.price), recipe: editItem.recipe || [] }); else setForm({ name:'', category:'Appetizers', price:'', available:true, img:'Utensils', description:'', photo:'', recipe: [] }); }, [open, editItem]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    if (!form.name || !form.price) { toast('Name and price are required', 'error'); return; }
    const payload = { ...form, price: Number(form.price) };
    if (editItem) { dispatch({ type: 'UPDATE_MENU', payload: { ...editItem, ...payload } }); toast('Menu item updated', 'success'); }
    else { dispatch({ type: 'ADD_MENU', payload: { ...payload, id: 'm' + Date.now() } }); toast('Menu item added!', 'success'); }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Menu Item' : 'Add Menu Item'} size="md">
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Item Photo</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
              {form.photo ? <img src={form.photo} alt="Preview" className="w-full h-full object-cover" /> : <Icon name="Image" size={24} className="text-gray-400" />}
            </div>
            <div className="flex-1 space-y-2">
              <input type="text" placeholder="Paste image URL here..." value={form.photo || ''} onChange={e => set('photo', e.target.value)} className="w-full px-3 py-1.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <label className="cursor-pointer text-xs font-semibold px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors inline-block text-zinc-800">
                  Upload from device
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => set('photo', ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <Input label="Item Name" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Chocolate Latte" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" required value={form.category} onChange={e => set('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</Select>
          <Input label="Price (₹)" required type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 250" />
        </div>
        <Input label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." />
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mt-4">
          <div><p className="text-sm font-semibold text-gray-800">Available</p><p className="text-xs text-gray-400">Show on menu for ordering</p></div>
          <button onClick={() => set('available', !form.available)} className={\`relative w-11 h-6 rounded-full transition-colors \${form.available ? 'bg-black' : 'bg-gray-300'}\`}>
            <div className={\`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all \${form.available ? 'left-5' : 'left-0.5'}\`} />
          </button>
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-zinc-800">{editItem ? 'Save Changes' : 'Add Item'}</button>
        </div>
      </div>
    </Modal>
  );
};

const KitchenView = () => {
  const { state, dispatch, toast } = useApp();
  const preparingOrders = state.orders.filter(o => o.status === 'Preparing' && (state.activeOutlet === 'All' || o.outlet === state.activeOutlet)).sort((a, b) => new Date(a.time) - new Date(b.time));

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Kitchen Display System</h1>
          <p className="text-gray-500 font-medium mt-1">Active orders currently being prepared.</p>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
          <Icon name="ChefHat" size={20} />
          <span>{preparingOrders.length} Pending</span>
        </div>
      </div>
      
      {preparingOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Icon name="CheckCircle2" size={64} className="mb-4 text-green-400 opacity-50" />
          <h3 className="text-2xl font-black text-gray-800">All clear!</h3>
          <p className="font-medium">No orders are currently in preparation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
          {preparingOrders.map(order => {
            const minsAgo = Math.floor((new Date() - new Date(order.time)) / 60000);
            const isUrgent = minsAgo > 15;
            return (
              <div key={order.id} className={\`bg-white rounded-2xl shadow-sm border-2 overflow-hidden flex flex-col \${isUrgent ? 'border-red-500' : 'border-gray-200'}\`}>
                <div className={\`p-4 flex justify-between items-center text-white \${isUrgent ? 'bg-red-500' : 'bg-black'}\`}>
                  <div>
                    <h2 className="text-xl font-black flex items-center space-x-2">
                      <span>#{order.id}</span>
                      {order.table && <span className="bg-white text-black px-2 py-0.5 rounded text-sm tracking-wide">Table {order.table}</span>}
                    </h2>
                    <p className="text-sm opacity-80">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{minsAgo}m</p>
                  </div>
                </div>
                <div className="p-5 flex-1 bg-gray-50/50">
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} onClick={() => dispatch({ type: 'TOGGLE_ITEM_READY', payload: { orderId: order.id, itemIndex: idx } })} className="flex items-center space-x-3 text-lg font-bold text-gray-800 cursor-pointer group">
                        <button className={\`w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center transition-colors \${item.ready ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'}\`}>
                          <Icon name="Check" size={14} strokeWidth={3} />
                        </button>
                        <span className={\`text-black bg-gray-200 rounded-md px-2 py-0.5 transition-opacity \${item.ready ? 'opacity-50' : ''}\`}>{item.qty}x</span>
                        <span className={\`transition-all \${item.ready ? 'line-through text-gray-400' : ''}\`}>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                  {order.note && (
                    <div className="mt-4 p-3 bg-yellow-100/50 border border-yellow-200 rounded-lg text-sm font-semibold text-yellow-800">
                      Note: {order.note}
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-white mt-auto">
                  <button onClick={() => {
                    dispatch({ type: 'UPDATE_ORDER', payload: { ...order, status: 'Ready' } });
                    toast(\`Order #\${order.id} marked as Ready!\`, 'success');
                  }} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-lg transition-colors flex items-center justify-center space-x-2">
                    <Icon name="Check" size={24} /><span>Mark Ready</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

`;

const startToken = "const MenuItemModal = ({ open, onClose, editItem = null }) => {";
const endToken = "const MenuView = () => {";

const startIndex = code.indexOf(startToken);
const endIndex = code.indexOf(endToken);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end token");
  process.exit(1);
}

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);

fs.writeFileSync('c:/Users/ANSH KEDIA/OneDrive/Desktop/STARTUP/FlavourFall/index.html', newCode);
