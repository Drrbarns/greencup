import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const SAMPLE_CSV = `name,description,category,price,compare_at_price,quantity,moq,status,featured,seo_title,seo_description,keywords,low_stock_threshold,preorder_shipping,images,variant_color,variant_color_hex,variant_size,variant_price,variant_stock
"Guava Green Brew","Crisp, herbaceous guava leaf brew.","Leaf teas",65.00,,100,1,"Active",true,"Guava Green Brew","Shop Guava Green Brew.","guava,tea,ghana",10,,"guava-green-brew-v4.jpg",,,,,,
"Soursop Brew","Earthy, smooth soursop leaf tea.","Leaf teas",65.00,,100,1,"Active",true,"Soursop Brew","Shop Soursop Brew.","soursop,tea,ghana",10,,"soursop-brew-v4.jpg",,,,,,
"Natural Lemon Ginger","Zesty lemon and real ginger infusion.","Infusions",55.00,,80,1,"Active",true,"Natural Lemon Ginger","Shop lemon ginger tea.","lemon,ginger,tea",10,,"natural-lemon-ginger-v4.jpg",,,,,,
`;

export async function GET(request: Request) {
  const auth = await verifyAuth(request, { requireAdmin: true });
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  return new NextResponse(SAMPLE_CSV, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="products-import-template.csv"',
    },
  });
}
