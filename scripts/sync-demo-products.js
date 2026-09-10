const { createClient } = require('@supabase/supabase-js');
const { products } = require('../data/products.ts');
const { categories } = require('../data/categories.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hpzdmiugjnnkhajougzt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_iKH6AhGhK8e1T5x-bMqhsw_yoR6xBcW';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('--- Starting Demo Products & Categories Sync to Supabase ---');

  // 1. Sync Categories
  console.log(`\nSyncing ${categories.length} categories...`);
  const catRows = categories.map((cat) => ({
    id: cat.id,
    title: cat.title,
    description: cat.description || '',
    image: cat.image || '/images/home-kitchen.jpg',
    cta: cat.cta || 'Shop Now →',
    href: `/category/${cat.id}`,
  }));

  const { data: syncedCats, error: catErr } = await supabase
    .from('categories')
    .upsert(catRows, { onConflict: 'id' })
    .select();

  if (catErr) {
    console.error('Error syncing categories:', catErr);
    process.exit(1);
  }
  console.log(`✓ Successfully synced ${syncedCats?.length || 0} categories to Supabase.`);

  // Category mapping
  const catMap = {};
  categories.forEach((c) => {
    catMap[c.title.toLowerCase()] = c.id;
    catMap[c.id.toLowerCase()] = c.id;
    catMap[c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')] = c.id;
  });

  // 2. Sync Products
  console.log(`\nSyncing ${products.length} products...`);
  const prodRows = products.map((prod) => {
    const rawCat = (prod.category || '').toLowerCase().trim();
    const catId = catMap[rawCat] || catMap[rawCat.replace(/[^a-z0-9]+/g, '-')] || 'electronics';

    return {
      id: prod.id,
      name: prod.name,
      category_id: catId,
      price: Number(prod.price) || 0,
      old_price: prod.oldPrice ? Number(prod.oldPrice) : Number(prod.price),
      rating: Number(prod.rating) || 5.0,
      reviews: Number(prod.reviews) || 0,
      badge: prod.badge || null,
      in_stock: Boolean(prod.inStock),
      shipping: prod.shipping || 'Fast Shipping',
      image: prod.image || '/images/hero-workspace.jpg',
    };
  });

  // Upsert in batches of 20 to ensure smooth transaction
  const batchSize = 20;
  let totalInserted = 0;

  for (let i = 0; i < prodRows.length; i += batchSize) {
    const batch = prodRows.slice(i, i + batchSize);
    const { data: batchResult, error: prodErr } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' })
      .select('id, name');

    if (prodErr) {
      console.error(`Error in batch ${i / batchSize + 1}:`, prodErr);
      process.exit(1);
    }

    totalInserted += batchResult?.length || 0;
    console.log(`  Uploaded batch ${Math.floor(i / batchSize) + 1} (${totalInserted}/${prodRows.length} products)`);
  }

  console.log(`\n✓ All ${totalInserted} demo products successfully synced to Supabase database!`);

  // Verify total count in Supabase
  const { count, error: countErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`✓ Total products in Supabase 'products' table now: ${count}`);
}

sync().catch(console.error);
